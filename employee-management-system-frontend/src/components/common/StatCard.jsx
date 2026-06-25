export default function StatCard({ title, value, icon: Icon, color, subtitle }) {
  // Color palette: red, orange, yellow, blue, black
  const gradients = {
    indigo: 'rgba(229,62,62,0.07)',
    red:    'rgba(229,62,62,0.07)',
    violet: 'rgba(249,115,22,0.07)',
    orange: 'rgba(249,115,22,0.07)',
    emerald:'rgba(37,99,235,0.07)',
    blue:   'rgba(37,99,235,0.07)',
    amber:  'rgba(245,158,11,0.07)',
    yellow: 'rgba(245,158,11,0.07)',
    pink:   'rgba(17,17,17,0.05)',
    black:  'rgba(17,17,17,0.05)',
  };

  const iconStyles = {
    indigo: { bg: 'rgba(229,62,62,0.12)',  color: '#c53030',  bar: '#e53e3e' },
    red:    { bg: 'rgba(229,62,62,0.12)',  color: '#c53030',  bar: '#e53e3e' },
    violet: { bg: 'rgba(249,115,22,0.12)', color: '#c2410c',  bar: '#f97316' },
    orange: { bg: 'rgba(249,115,22,0.12)', color: '#c2410c',  bar: '#f97316' },
    emerald:{ bg: 'rgba(37,99,235,0.12)',  color: '#1d4ed8',  bar: '#2563eb' },
    blue:   { bg: 'rgba(37,99,235,0.12)',  color: '#1d4ed8',  bar: '#2563eb' },
    amber:  { bg: 'rgba(245,158,11,0.12)', color: '#b45309',  bar: '#f59e0b' },
    yellow: { bg: 'rgba(245,158,11,0.12)', color: '#b45309',  bar: '#f59e0b' },
    pink:   { bg: 'rgba(17,17,17,0.08)',   color: '#111111',  bar: '#111111' },
    black:  { bg: 'rgba(17,17,17,0.08)',   color: '#111111',  bar: '#111111' },
  };

  const style = iconStyles[color] || iconStyles.indigo;
  const gradientBg = gradients[color] || gradients.indigo;

  return (
    <div
      className="glass-card-hover p-6"
      style={{ backgroundColor: gradientBg }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'rgba(17,17,17,0.45)' }}>{title}</p>
          <p className="text-3xl font-bold mt-2" style={{ color: '#111111' }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && <p className="text-xs mt-1" style={{ color: 'rgba(17,17,17,0.4)' }}>{subtitle}</p>}
        </div>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: style.bg, color: style.color }}
        >
          <Icon size={22} />
        </div>
      </div>
      {/* Decorative bar */}
      <div
        className="mt-4 h-1 rounded-full opacity-60"
        style={{ background: `linear-gradient(to right, ${style.bar}, ${style.bar}99)` }}
      />
    </div>
  );
}
