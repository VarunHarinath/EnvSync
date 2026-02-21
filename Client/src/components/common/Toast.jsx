import React from 'react';
import { useToastListener } from '../../hooks/useToast';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../utils';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastListener();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-start gap-3 w-[350px] rounded-lg p-4 shadow-lg border transition-all animate-in slide-in-from-right-full",
            toast.variant === 'destructive' 
              ? "bg-destructive text-destructive-foreground border-destructive/20" 
              : "bg-card text-card-foreground border-border"
          )}
        >
          {toast.variant === 'destructive' ? (
            <AlertCircle className="w-5 h-5 shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 shrink-0 text-primary" />
          )}
          <div className="flex-1">
            {toast.title && <h4 className="font-medium text-sm">{toast.title}</h4>}
            {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
          </div>
          <button 
            onClick={() => removeToast(toast.id)}
            className="text-foreground/50 hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
