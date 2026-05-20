import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Card, Button, Spinner, Badge, Avatar } from '../components/ui.jsx';

export default function QuestionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => api.question(id).then(setData);
  useEffect(() => {
    load();
  }, [id]);

  if (!data) return <Spinner />;
  const { question, answers } = data;
  const isAsker = question.user_id === user.id;

  const vote = async (type, targetId, dir) => {
    await api.vote({ type, id: targetId, dir });
    load();
  };

  const accept = async (aid) => {
    await api.acceptAnswer(question.id, aid);
    load();
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setBusy(true);
    try {
      await api.postAnswer(question.id, { body: answer });
      setAnswer('');
      load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Link to="/questions" className="text-sm text-slate-500 hover:text-slate-800">
        ← Back to questions
      </Link>

      {/* Question */}
      <Card className="p-6 flex gap-4">
        <VoteColumn
          votes={question.votes}
          onUp={() => vote('question', question.id, 'up')}
          onDown={() => vote('question', question.id, 'down')}
        />
        <div className="flex-1">
          <h1 className="text-xl font-bold">{question.title}</h1>
          <p className="text-slate-700 mt-3 whitespace-pre-wrap">{question.body}</p>
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {question.tags
              ?.split(',')
              .filter(Boolean)
              .map((t) => (
                <Badge key={t} color="blue">
                  {t.trim()}
                </Badge>
              ))}
            <span className="text-xs text-slate-400 ml-auto flex items-center gap-1.5">
              <Avatar name={question.author} color={question.author_avatar} size={22} />
              asked by {question.author}
            </span>
          </div>
        </div>
      </Card>

      {/* Answers */}
      <div>
        <h2 className="font-semibold mb-3">
          {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
        </h2>
        <div className="space-y-3">
          {answers.map((a) => (
            <Card
              key={a.id}
              className={`p-5 flex gap-4 ${a.is_accepted ? 'border-green-300 bg-green-50/40' : ''}`}
            >
              <VoteColumn
                votes={a.votes}
                accepted={!!a.is_accepted}
                onUp={() => vote('answer', a.id, 'up')}
                onDown={() => vote('answer', a.id, 'down')}
              />
              <div className="flex-1">
                {a.is_accepted && (
                  <Badge color="green">✓ Accepted answer</Badge>
                )}
                <p className="text-slate-700 mt-2 whitespace-pre-wrap">{a.body}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Avatar name={a.author} color={a.author_avatar} size={20} /> {a.author}
                  </span>
                  {isAsker && !a.is_accepted && (
                    <button
                      onClick={() => accept(a.id)}
                      className="text-xs text-green-600 font-medium hover:underline"
                    >
                      Accept this answer
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add answer */}
      <Card className="p-5">
        <h3 className="font-semibold mb-3">Your answer</h3>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={4}
          placeholder="Share your knowledge…"
          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-brand-500 outline-none"
        />
        <div className="flex justify-end mt-3">
          <Button onClick={submitAnswer} disabled={busy}>
            {busy ? 'Posting…' : 'Post answer'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

function VoteColumn({ votes, onUp, onDown, accepted }) {
  return (
    <div className="flex flex-col items-center gap-1 w-10 shrink-0">
      <button onClick={onUp} className="text-slate-400 hover:text-brand-600 text-xl leading-none">
        ▲
      </button>
      <span className={`font-bold ${accepted ? 'text-green-600' : ''}`}>{votes}</span>
      <button onClick={onDown} className="text-slate-400 hover:text-red-500 text-xl leading-none">
        ▼
      </button>
    </div>
  );
}
