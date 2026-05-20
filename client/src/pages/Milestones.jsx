import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { Card, Spinner, MilestoneIcon } from '../components/ui.jsx';

export default function Milestones() {
  const [milestones, setMilestones] = useState(null);

  useEffect(() => {
    api.milestones().then((d) => setMilestones(d.milestones));
  }, []);

  if (!milestones) return <Spinner />;

  const earned = milestones.filter((m) => m.achieved).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Milestones</h1>
        <p className="text-slate-500">
          {earned} of {milestones.length} unlocked. Keep going!
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {milestones.map((m) => (
          <Card
            key={m.id}
            className={`p-5 flex gap-4 items-center ${m.achieved ? '' : 'opacity-90'}`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                m.achieved ? 'bg-amber-100' : 'bg-slate-100 grayscale'
              }`}
            >
              <MilestoneIcon icon={m.icon} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{m.title}</p>
                {m.achieved && <span className="text-green-600 text-sm">✓</span>}
              </div>
              <p className="text-sm text-slate-500">{m.description}</p>
              {!m.achieved && (
                <div className="mt-2">
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all"
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {m.current ?? 0} / {m.threshold}
                  </p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
