import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Avatar } from './ui.jsx';

const NAV = [
  { to: '/', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/study', label: 'Study Area', icon: '📚' },
  { to: '/chat', label: 'Community', icon: '💬' },
  { to: '/questions', label: 'Ask Questions', icon: '❓' },
  { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { to: '/milestones', label: 'Milestones', icon: '🎯' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-screen">
        <div className="px-6 py-5 flex items-center gap-2 border-b border-slate-100">
          <span className="text-2xl">🩺</span>
          <span className="font-extrabold text-xl tracking-tight">
            Med<span className="text-brand-600">Study</span>
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar name={user.username} color={user.avatar} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate">{user.username}</p>
              <p className="text-xs text-amber-600 font-medium">{user.points} pts · 🔥 {user.streak}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full mt-1 text-left px-2 py-2 text-sm text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-50 transition"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
