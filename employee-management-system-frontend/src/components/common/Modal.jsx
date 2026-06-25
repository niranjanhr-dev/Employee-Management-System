import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'rgba(17,17,17,0.55)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className={`w-full ${sizeClasses[size]} animate-scale-in`}
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid rgba(229,62,62,0.15)',
          borderRadius: '1rem',
          boxShadow: '0 20px 60px rgba(229,62,62,0.15), 0 4px 16px rgba(0,0,0,0.12)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'rgba(229,62,62,0.1)' }}
        >
          <h2 className="text-base font-semibold" style={{ color: '#111111' }}>{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
            style={{ color: 'rgba(17,17,17,0.4)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(229,62,62,0.08)';
              e.currentTarget.style.color = '#e53e3e';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'rgba(17,17,17,0.4)';
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
