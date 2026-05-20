import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { Card, Button, Spinner, Badge, EmptyState } from '../components/ui.jsx';

export default function Study() {
  const [subjects, setSubjects] = useState([]);
  const [decks, setDecks] = useState([]);
  const [active, setActive] = useState(null); // subject id or null = all
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const load = async (subjectId = active) => {
    setLoading(true);
    const [{ subjects }, { decks }] = await Promise.all([
      api.subjects(),
      api.decks(subjectId),
    ]);
    setSubjects(subjects);
    setDecks(decks);
    setLoading(false);
  };

  useEffect(() => {
    load(null);
  }, []);

  const pick = (id) => {
    setActive(id);
    load(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Study Area</h1>
          <p className="text-slate-500">Pick a subject and drill flashcards to earn points.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>+ New Deck</Button>
      </div>

      {/* Subject filter */}
      <div className="flex gap-2 flex-wrap">
        <Chip active={active === null} onClick={() => pick(null)}>
          All
        </Chip>
        {subjects.map((s) => (
          <Chip key={s.id} active={active === s.id} onClick={() => pick(s.id)}>
            {s.icon} {s.name}
          </Chip>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : decks.length === 0 ? (
        <EmptyState icon="📚" title="No decks here yet" subtitle="Create the first deck for this subject." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((d) => (
            <Card key={d.id} className="p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: d.subject_color || '#94a3b8' }}
                />
                <Badge>{d.subject_name || 'General'}</Badge>
              </div>
              <h3 className="font-semibold text-lg">{d.title}</h3>
              <p className="text-sm text-slate-500 flex-1 mt-1">{d.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-slate-400">
                  {d.card_count} cards · by {d.owner_name || 'system'}
                </span>
                <Link to={`/study/deck/${d.id}`}>
                  <Button className="py-1.5 px-3 text-xs">Study →</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateDeckModal
          subjects={subjects}
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function Chip({ active, children, ...rest }) {
  return (
    <button
      {...rest}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
        active ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  );
}

function CreateDeckModal({ subjects, onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [cards, setCards] = useState([{ front: '', back: '' }]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const updateCard = (i, k, v) => {
    const next = [...cards];
    next[i][k] = v;
    setCards(next);
  };

  const submit = async () => {
    setError('');
    if (!title.trim()) return setError('Give your deck a title.');
    const valid = cards.filter((c) => c.front.trim() && c.back.trim());
    if (valid.length === 0) return setError('Add at least one complete card.');
    setBusy(true);
    try {
      await api.createDeck({ title, description, subjectId: Number(subjectId), cards: valid });
      onCreated();
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto scroll-thin p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Create a new deck</h2>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <div className="space-y-3">
          <input
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
            placeholder="Deck title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
            placeholder="Short description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.icon} {s.name}
              </option>
            ))}
          </select>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">Cards</p>
            {cards.map((c, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <input
                  className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  placeholder={`Front #${i + 1}`}
                  value={c.front}
                  onChange={(e) => updateCard(i, 'front', e.target.value)}
                />
                <input
                  className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  placeholder={`Back #${i + 1}`}
                  value={c.back}
                  onChange={(e) => updateCard(i, 'back', e.target.value)}
                />
              </div>
            ))}
            <button
              onClick={() => setCards([...cards, { front: '', back: '' }])}
              className="text-sm text-brand-600 hover:underline"
            >
              + Add another card
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy}>
            {busy ? 'Creating…' : 'Create deck'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
