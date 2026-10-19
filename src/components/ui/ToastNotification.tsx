'use client';

import React from 'react';
import { useCampus } from '@/context/CampusContext';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toast, clearToast } = useCampus();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isInfo = toast.type === 'info';

  return (
    <div className="fixed bottom-20 md:bottom-8 right-6 z-50 flex items-center gap-3 rounded-2xl border border-border bg-card/95 backdrop-blur-md px-4 py-3 shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
      {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
      {isInfo && <Info className="h-5 w-5 text-indigo-500 shrink-0" />}
      {!isSuccess && !isInfo && <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />}

      <span className="text-xs font-semibold text-foreground max-w-xs">{toast.message}</span>

      <button
        onClick={clearToast}
        className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
