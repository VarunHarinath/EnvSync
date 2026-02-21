import { useState, useCallback, useEffect } from 'react';

let listeners = [];
let memoryState = []; // Simple global state for toast to persist across re-renders if needed, 
// though typically context is better. For simplicity in this scope, we'll use a simple event bus pattern or just local state if used at top level.
// Actually, let's just make a simple custom hook that dispatches custom events, 
// and a ToastContainer that listens.

const TOAST_EVENT = 'envsync-toast';

export function useToast() {
  const toast = useCallback(({ title, description, variant = 'default' }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const event = new CustomEvent(TOAST_EVENT, {
      detail: { id, title, description, variant },
    });
    window.dispatchEvent(event);
  }, []);

  return { toast };
}

export function useToastListener() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (event) => {
      const newToast = event.detail;
      setToasts((prev) => [...prev, newToast]);
      
      // Auto dismiss
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3000);
    };

    window.addEventListener(TOAST_EVENT, handler);
    return () => window.removeEventListener(TOAST_EVENT, handler);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, removeToast };
}
