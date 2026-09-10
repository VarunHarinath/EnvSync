import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils';

export default function Drawer({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className 
}) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex justify-end bg-black/45 transition-opacity duration-200",
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      )}
    >
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
      />
      <div 
        className={cn(
          "relative z-50 h-full w-full max-w-[460px] bg-card shadow-2xl shadow-black/30 transition-transform duration-200 ease-out border-l",
          isOpen ? "translate-x-0" : "translate-x-full",
          className
        )}
      >
        <div className="flex min-h-16 items-center justify-between border-b px-6 py-4">
          <h3 className="min-w-0 font-semibold text-base">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="h-[calc(100%-4rem)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
