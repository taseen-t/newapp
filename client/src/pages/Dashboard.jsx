import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';
import { Card, Avatar, Spinner, MilestoneIcon, Badge } from '../components/ui.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([api.leaderboard(), api.milestones(), api.subjects()]).then(
      ([lb, ms, subs]) => setData({ lb, ms, subs })
    );
  }, []);

  if (!data) return <Spinner />;

  const rank = data.lb.allTime.findIndex((u) => u.id === user.id) + 1;
  const earned = data.ms.milestones.filter((m) => m.achieved);
  const nextUp = data.ms.milestones
    .filter((m) => !m.achieved)
    .sort((a, b) => b.progress - a.progress)[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {user.username} 👋
        </h1>
        <p className="text-slate-500">Here's your study snapshot.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Points" value={user.points} icon="⭐" tone="amber" />
        <Stat label="Day Streak" value={user.streak} icon="🔥" tone="red" />
        <Stat label="Global Rank" value={rank ? `#${rank}` : '—'} icon="🏆" tone="blue" />
        <Stat label="Milestones" value={earned.length} icon="🎯" tone="green" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Next milestone */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Your next milestone</h2>
            <Link to="/milestones" className="text-sm text-brand-600 hover:underline">
              View all
            </Link>
          </div>
          {nextUp ? (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <MilestoneIcon icon={nextUp.icon} />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{nextUp.title}</p>
                <p className="text-sm text-slate-500 mb-2">{nextUp.description}</p>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all"
                    style={{ width: `${nextUp.progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {nextUp.current} / {nextUp.threshold}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">You've earned every milestone. Legend! 👑</p>
          )}
        </Card>

        {/* Top of leaderboard */}
        <Card className="p-5">
          <h2 className="font-semibold mb-4">Top students</h2>
          <div className="space-y-3">
            {data.lb.allTime.slice(0, 5).map((u, i) => (
              <div key={u.id} className="flex items-center gap-3">
                <span className="w-5 text-sm font-bold text-slate-400">{i + 1}</span>
                <Avatar name={u.username} color={u.avatar} size={28} />
                <span className="text-sm font-medium flex-1 truncate">{u.username}</span>
                <span className="text-xs text-amber-600 font-semibold">{u.points}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick study */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Jump into a subject</h2>
          <Link to="/study" className="text-sm text-brand-600 hover:underline">
            Browse all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data.subs.subjects.map((s) => (
            <Link
              key={s.id}
              to="/study"
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 transition"
            >
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="font-medium text-sm">{s.name}</p>
                <p className="text-xs text-slate-400">{s.deck_count} decks</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value, icon, tone }) {
  const tones = {
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
  };
  return (
    <Card className="p-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2 ${tones[tone]}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </Card>
  );
}
