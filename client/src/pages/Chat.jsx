import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { api, getToken } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Card, Avatar, Spinner } from '../components/ui.jsx';

export default function Chat() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  // Connect socket once.
  useEffect(() => {
    const socket = io('/', { auth: { token: getToken() } });
    socketRef.current = socket;
    socket.on('message:new', (msg) => {
      setMessages((prev) => (msg.room_id === activeRoomRef.current ? [...prev, msg] : prev));
    });
    return () => socket.disconnect();
  }, []);

  // Keep a ref of the active room for the socket listener.
  const activeRoomRef = useRef(null);
  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

  // Load rooms.
  useEffect(() => {
    api.rooms().then(({ rooms }) => {
      setRooms(rooms);
      if (rooms[0]) selectRoom(rooms[0].id);
      setLoading(false);
    });
  }, []);

  const selectRoom = async (roomId) => {
    setActiveRoom(roomId);
    activeRoomRef.current = roomId;
    socketRef.current?.emit('room:join', roomId);
    const { messages } = await api.roomMessages(roomId);
    setMessages(messages);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (e) => {
    e.preventDefault();
    const content = text.trim();
    if (!content || !activeRoom) return;
    socketRef.current.emit('message:send', { roomId: activeRoom, content });
    setText('');
  };

  if (loading) return <Spinner />;

  const room = rooms.find((r) => r.id === activeRoom);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Community</h1>
        <p className="text-slate-500">Chat live with other students. Be kind, stay curious.</p>
      </div>

      <div className="grid grid-cols-[200px_1fr] gap-4 h-[calc(100vh-220px)]">
        {/* Room list */}
        <Card className="p-2 overflow-y-auto scroll-thin">
          {rooms.map((r) => (
            <button
              key={r.id}
              onClick={() => selectRoom(r.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 transition ${
                r.id === activeRoom ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-50'
              }`}
            >
              <p className="font-medium text-sm"># {r.name}</p>
              <p className="text-xs text-slate-400 truncate">{r.description}</p>
            </button>
          ))}
        </Card>

        {/* Messages */}
        <Card className="flex flex-col overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100">
            <p className="font-semibold"># {room?.name}</p>
          </div>

          <div className="flex-1 overflow-y-auto scroll-thin p-5 space-y-4">
            {messages.length === 0 && (
              <p className="text-center text-slate-400 text-sm py-10">
                No messages yet. Say hello! 👋
              </p>
            )}
            {messages.map((m) => {
              const mine = m.user_id === user.id;
              return (
                <div key={m.id} className={`flex gap-3 ${mine ? 'flex-row-reverse' : ''}`}>
                  <Avatar name={m.username} color={m.avatar} size={32} />
                  <div className={`max-w-[70%] ${mine ? 'text-right' : ''}`}>
                    <div className="flex items-center gap-2 mb-0.5" style={mine ? { flexDirection: 'row-reverse' } : {}}>
                      <span className="text-xs font-semibold">{mine ? 'You' : m.username}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(m.created_at + 'Z').toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div
                      className={`inline-block px-3 py-2 rounded-2xl text-sm ${
                        mine ? 'bg-brand-600 text-white rounded-tr-sm' : 'bg-slate-100 rounded-tl-sm'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={send} className="p-3 border-t border-slate-100 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Message #${room?.name || ''}`}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 outline-none text-sm"
            />
            <button
              type="submit"
              className="px-5 rounded-xl bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 transition"
            >
              Send
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
