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
        "fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity",
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      )}
    >
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
      />
      <div 
        className={cn(
          "relative z-50 h-full w-full max-w-md bg-background shadow-xl transition-transform duration-300 ease-in-out border-l",
          isOpen ? "translate-x-0" : "translate-x-full",
          className
        )}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="h-[calc(100%-4rem)] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
