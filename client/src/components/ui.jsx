export function Avatar({ name, color, size = 36 }) {
  const initials = (name || '?').slice(0, 2).toUpperCase();
  return (
    <div
      className="flex items-center justify-center rounded-full font-semibold text-white shrink-0"
      style={{ background: color || '#3b82f6', width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}

export function Card({ className = '', children, ...rest }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Button({ variant = 'primary', className = '', ...rest }) {
  const styles = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }[variant];
  return (
    <button
      className={`px-4 py-2 rounded-xl font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${styles} ${className}`}
      {...rest}
    />
  );
}

export function Badge({ children, color = 'slate' }) {
  const map = {
    slate: 'bg-slate-100 text-slate-600',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-700',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[color]}`}>
      {children}
    </span>
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 border-3 border-slate-200 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );
}

export function EmptyState({ icon = '📭', title, subtitle }) {
  return (
    <div className="text-center py-16 text-slate-400">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="font-semibold text-slate-600">{title}</p>
      {subtitle && <p className="text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

export function MilestoneIcon({ icon, className = 'w-6 h-6' }) {
  const map = {
    sparkles: '✨',
    star: '⭐',
    graduation: '🎓',
    crown: '👑',
    flame: '🔥',
    cards: '🃏',
    question: '❓',
    hands: '🤝',
    trophy: '🏆',
  };
  return <span className={className} style={{ fontSize: '1.5rem', lineHeight: 1 }}>{map[icon] || '🏅'}</span>;
}
