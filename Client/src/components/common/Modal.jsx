import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils';
import Button from './Button';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center sm:p-4">
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
      />
      <div className={cn(
        "relative z-50 flex max-h-[100dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border bg-background p-0 shadow-lg animate-in zoom-in-95 duration-200 sm:max-h-[calc(100dvh-2rem)] sm:rounded-xl",
        className
      )}>
        <div className="flex shrink-0 items-center justify-between border-b px-4 py-4 sm:px-6">
          <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          {children}
        </div>
        {footer && (
          <div className="flex shrink-0 flex-col-reverse gap-2 border-t bg-muted/40 px-4 py-3 sm:flex-row sm:justify-end sm:px-6 sm:py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
