import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Card, Avatar, Spinner, Badge } from '../components/ui.jsx';

export default function Leaderboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('allTime');

  useEffect(() => {
    api.leaderboard().then(setData);
  }, []);

  if (!data) return <Spinner />;

  const rows = tab === 'allTime' ? data.allTime : data.weekly;
  const medal = ['🥇', '🥈', '🥉'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-slate-500">Study more, climb higher. Updated in real time.</p>
      </div>

      {/* Podium */}
      {tab === 'allTime' && data.allTime.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 items-end">
          {[1, 0, 2].map((pos) => {
            const u = data.allTime[pos];
            const heights = { 0: 'h-32', 1: 'h-24', 2: 'h-20' };
            return (
              <div key={u.id} className="text-center">
                <Avatar name={u.username} color={u.avatar} size={pos === 0 ? 56 : 44} />
                <p className="font-semibold text-sm mt-2 truncate">{u.username}</p>
                <p className="text-xs text-amber-600 font-bold">{u.points} pts</p>
                <div
                  className={`${heights[pos]} mt-2 rounded-t-xl flex items-start justify-center pt-2 text-2xl ${
                    pos === 0 ? 'bg-amber-200' : pos === 1 ? 'bg-slate-200' : 'bg-orange-200'
                  }`}
                >
                  {medal[pos]}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-2">
        <Tab active={tab === 'allTime'} onClick={() => setTab('allTime')}>
          All-time
        </Tab>
        <Tab active={tab === 'weekly'} onClick={() => setTab('weekly')}>
          This week
        </Tab>
      </div>

      <Card className="divide-y divide-slate-100">
        {rows.length === 0 && (
          <p className="text-center text-slate-400 py-10 text-sm">No activity yet this week.</p>
        )}
        {rows.map((u, i) => {
          const isMe = u.id === user.id;
          const points = tab === 'allTime' ? u.points : u.week_points;
          return (
            <div
              key={u.id}
              className={`flex items-center gap-4 px-5 py-3 ${isMe ? 'bg-brand-50' : ''}`}
            >
              <span className="w-8 text-center font-bold text-slate-400">
                {i < 3 ? medal[i] : i + 1}
              </span>
              <Avatar name={u.username} color={u.avatar} size={36} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                  {u.username} {isMe && <Badge color="blue">You</Badge>}
                </p>
                {tab === 'allTime' && (
                  <p className="text-xs text-slate-400">
                    🔥 {u.streak} day streak · 🎯 {u.milestones} milestones
                  </p>
                )}
              </div>
              <span className="font-bold text-amber-600">{points} pts</span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function Tab({ active, children, ...rest }) {
  return (
    <button
      {...rest}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
        active ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
      }`}
    >
      {children}
    </button>
  );
}
