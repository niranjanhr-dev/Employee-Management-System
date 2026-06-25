import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';

const routeTitles = {
  '/': 'Dashboard',
  '/employees': 'Employees',
  '/departments': 'Departments',
  '/projects': 'Projects',
  '/reviews': 'Performance Reviews',
};

export default function Header() {
  const location = useLocation();
  const title = routeTitles[location.pathname] || 'Employee Management';

  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b"
      style={{
        backgroundColor: '#ffffff',
        borderColor: 'rgba(229,62,62,0.12)',
        boxShadow: '0 2px 12px rgba(229,62,62,0.06)',
      }}
    >
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#111111' }}>{title}</h1>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(17,17,17,0.4)' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-200"
          style={{
            backgroundColor: '#fff8f8',
            borderColor: 'rgba(229,62,62,0.15)',
            color: 'rgba(17,17,17,0.5)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ffe0e0';
            e.currentTarget.style.color = '#e53e3e';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#fff8f8';
            e.currentTarget.style.color = 'rgba(17,17,17,0.5)';
          }}
        >
          <Bell size={16} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2 ring-white"
            style={{ backgroundColor: '#f97316' }}
          />
        </button>

        {/* Avatar */}
        <div
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer"
          style={{
            backgroundColor: '#fff8f8',
            borderColor: 'rgba(229,62,62,0.15)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ffe0e0')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff8f8')}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #e53e3e 0%, #f97316 100%)' }}
          >
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold" style={{ color: '#111111' }}>Admin</p>
            <p className="text-[10px]" style={{ color: 'rgba(17,17,17,0.4)' }}>Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
