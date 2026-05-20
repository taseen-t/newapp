import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { Card, Button, Spinner, Badge, Avatar, EmptyState } from '../components/ui.jsx';

export default function Questions() {
  const [questions, setQuestions] = useState(null);
  const [search, setSearch] = useState('');
  const [showAsk, setShowAsk] = useState(false);

  const load = async (q = '') => {
    setQuestions(null);
    const { questions } = await api.questions(q ? `?q=${encodeURIComponent(q)}` : '');
    setQuestions(questions);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ask Questions</h1>
          <p className="text-slate-500">Stuck on a concept? The community has your back.</p>
        </div>
        <Button onClick={() => setShowAsk(true)}>+ Ask a Question</Button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          load(search);
        }}
        className="flex gap-2"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions…"
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 outline-none text-sm focus:border-brand-500"
        />
        <Button variant="outline" type="submit">
          Search
        </Button>
      </form>

      {!questions ? (
        <Spinner />
      ) : questions.length === 0 ? (
        <EmptyState icon="❓" title="No questions yet" subtitle="Be the first to ask something." />
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <Link key={q.id} to={`/questions/${q.id}`}>
              <Card className="p-5 hover:border-brand-300 transition flex gap-4">
                <div className="flex flex-col items-center gap-1 text-center w-14 shrink-0">
                  <span className="font-bold text-lg">{q.votes}</span>
                  <span className="text-xs text-slate-400">votes</span>
                  <span
                    className={`mt-1 text-xs px-2 py-0.5 rounded-full ${
                      q.solved ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {q.answer_count} ans
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{q.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mt-1">{q.body}</p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {q.tags
                      ?.split(',')
                      .filter(Boolean)
                      .map((t) => (
                        <Badge key={t} color="blue">
                          {t.trim()}
                        </Badge>
                      ))}
                    <span className="text-xs text-slate-400 ml-auto flex items-center gap-1">
                      <Avatar name={q.author} color={q.author_avatar} size={20} /> {q.author}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {showAsk && (
        <AskModal
          onClose={() => setShowAsk(false)}
          onCreated={() => {
            setShowAsk(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function AskModal({ onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    if (!title.trim() || !body.trim()) return setError('Title and details are required.');
    setBusy(true);
    try {
      await api.askQuestion({ title, body, tags });
      onCreated();
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-4">Ask the community</h2>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <div className="space-y-3">
          <input
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
            placeholder="What's your question? Be specific."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
            rows={5}
            placeholder="Add details, what you've tried, and context…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <input
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
            placeholder="Tags (comma separated, e.g. cardiology, ecg)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy}>
            {busy ? 'Posting…' : 'Post question'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
