import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  FolderKanban,
  Star,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/departments', label: 'Departments', icon: Building2 },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/reviews', label: 'Performance Reviews', icon: Star },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`relative flex flex-col transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
        border-r`}
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        borderColor: 'rgba(229,62,62,0.12)',
        boxShadow: '2px 0 16px rgba(229,62,62,0.06)',
      }}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b ${collapsed ? 'justify-center' : ''}`}
        style={{ borderColor: 'rgba(229,62,62,0.12)' }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #e53e3e 0%, #f97316 100%)',
            boxShadow: '0 6px 16px rgba(229,62,62,0.35)',
          }}
        >
          <Briefcase size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <p className="text-sm font-bold leading-none" style={{ color: '#111111' }}>EMS</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'rgba(17,17,17,0.4)' }}>Employee Management</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              isActive ? 'sidebar-item-active' : 'sidebar-item'
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && (
              <span className="animate-fade-in truncate">{label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Toggle button */}
      <div className="p-3 border-t" style={{ borderColor: 'rgba(229,62,62,0.12)' }}>
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-xl transition-all duration-200"
          style={{ color: 'rgba(17,17,17,0.4)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(229,62,62,0.06)';
            e.currentTarget.style.color = '#e53e3e';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'rgba(17,17,17,0.4)';
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
