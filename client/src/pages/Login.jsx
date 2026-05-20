import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/ui.jsx';

export default function Login() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '', emailOrUsername: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') await login(form.emailOrUsername, form.password);
      else await register(form.username, form.email, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const fillDemo = () => {
    setMode('login');
    setForm({ ...form, emailOrUsername: 'drsarah', password: 'password123' });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Hero */}
      <div className="hidden lg:flex flex-col justify-center px-16 bg-gradient-to-br from-brand-600 to-blue-800 text-white">
        <div className="text-5xl mb-6">🩺</div>
        <h1 className="text-4xl font-extrabold leading-tight">
          MedStudy
        </h1>
        <p className="text-blue-100 text-lg mt-4 max-w-md">
          The community where medical students study together, climb the leaderboard, hit milestones,
          and get their toughest questions answered.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 max-w-md">
          {[
            ['📚', 'Flashcard study decks'],
            ['💬', 'Live community chat'],
            ['🏆', 'Competitive leaderboards'],
            ['🎯', 'Achievement milestones'],
          ].map(([icon, label]) => (
            <div key={label} className="flex items-center gap-2 text-blue-50">
              <span className="text-xl">{icon}</span>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-4xl mb-4 text-center">🩺</div>
          <h2 className="text-2xl font-bold mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            {mode === 'login' ? 'Sign in to keep your streak alive.' : 'Join the study community today.'}
          </p>

          {error && (
            <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-3">
            {mode === 'register' ? (
              <>
                <Input placeholder="Username" value={form.username} onChange={set('username')} />
                <Input type="email" placeholder="Email" value={form.email} onChange={set('email')} />
              </>
            ) : (
              <Input
                placeholder="Email or username"
                value={form.emailOrUsername}
                onChange={set('emailOrUsername')}
              />
            )}
            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={set('password')}
            />
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>
          </form>

          <button
            onClick={fillDemo}
            className="w-full mt-3 text-sm text-brand-600 hover:underline"
          >
            Use a demo account
          </button>

          <p className="text-center text-sm text-slate-500 mt-6">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="text-brand-600 font-semibold hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none text-sm"
    />
  );
}
