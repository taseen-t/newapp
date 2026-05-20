import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Card, Button, Spinner, MilestoneIcon } from '../components/ui.jsx';

export default function DeckStudy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [seen, setSeen] = useState(0);
  const [done, setDone] = useState(null); // result payload

  useEffect(() => {
    api.deck(id).then(({ deck, cards }) => {
      setDeck(deck);
      setCards(cards);
    });
  }, [id]);

  if (!deck) return <Spinner />;

  const card = cards[idx];

  const grade = async (isCorrect) => {
    const newSeen = seen + 1;
    const newCorrect = correct + (isCorrect ? 1 : 0);
    setSeen(newSeen);
    setCorrect(newCorrect);

    if (idx + 1 < cards.length) {
      setIdx(idx + 1);
      setFlipped(false);
    } else {
      const result = await api.recordSession({
        deckId: deck.id,
        cardsStudied: newSeen,
        correct: newCorrect,
      });
      await refresh();
      setDone(result);
    }
  };

  if (cards.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 mb-4">This deck has no cards yet.</p>
        <Link to="/study">
          <Button>Back to Study Area</Button>
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold">Session complete!</h1>
        <p className="text-slate-500 mt-1">
          You got {correct} of {seen} correct.
        </p>
        <Card className="p-5 mt-6">
          <p className="text-4xl font-extrabold text-amber-500">+{done.pointsEarned}</p>
          <p className="text-slate-500">points earned</p>
          <p className="text-sm text-slate-400 mt-2">🔥 {done.streak}-day streak</p>
        </Card>

        {done.unlocked?.length > 0 && (
          <div className="mt-6 space-y-2">
            <p className="font-semibold text-slate-700">Milestones unlocked!</p>
            {done.unlocked.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 animate-pop"
              >
                <MilestoneIcon icon={m.icon} />
                <div className="text-left">
                  <p className="font-semibold text-sm">{m.title}</p>
                  <p className="text-xs text-slate-500">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setIdx(0);
              setFlipped(false);
              setCorrect(0);
              setSeen(0);
              setDone(null);
            }}
          >
            Study again
          </Button>
          <Button onClick={() => navigate('/study')}>Done</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to="/study" className="text-sm text-slate-500 hover:text-slate-800">
          ← {deck.title}
        </Link>
        <span className="text-sm text-slate-400">
          {idx + 1} / {cards.length}
        </span>
      </div>

      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-brand-500 transition-all"
          style={{ width: `${(idx / cards.length) * 100}%` }}
        />
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="w-full text-left"
      >
        <Card className="p-10 min-h-[260px] flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition">
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-3">
            {flipped ? 'Answer' : 'Question'}
          </p>
          <p className="text-xl font-medium">{flipped ? card.back : card.front}</p>
          <p className="text-xs text-slate-400 mt-6">Tap card to {flipped ? 'see question' : 'reveal answer'}</p>
        </Card>
      </button>

      {flipped ? (
        <div className="grid grid-cols-2 gap-3 mt-5">
          <Button variant="danger" onClick={() => grade(false)}>
            ✗ Got it wrong
          </Button>
          <Button onClick={() => grade(true)} className="bg-green-600 hover:bg-green-700">
            ✓ Got it right
          </Button>
        </div>
      ) : (
        <Button onClick={() => setFlipped(true)} className="w-full mt-5">
          Reveal answer
        </Button>
      )}
    </div>
  );
}
