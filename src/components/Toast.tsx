'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
  };

  const bgStyles = {
    success: 'bg-zinc-900/95 text-white border border-emerald-500/30',
    info: 'bg-zinc-900/95 text-white border border-sky-500/30',
    error: 'bg-zinc-900/95 text-white border border-rose-500/30'
  };

  return (
    <aside
      aria-label="การแจ้งเตือน"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${bgStyles[type]}`}
    >
      {icons[type]}
      <span className="text-sm font-medium tracking-wide">{message}</span>
      <button
        onClick={onClose}
        className="text-zinc-400 hover:text-white transition-colors ml-1 p-0.5"
        aria-label="ปิดการแจ้งเตือน"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
}
