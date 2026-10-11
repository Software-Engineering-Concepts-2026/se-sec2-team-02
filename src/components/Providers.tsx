'use client';

import React from 'react';
import { JobProvider, useJobs } from '@/context/JobContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Toast from '@/components/Toast';

function GlobalToast() {
  const { toast, hideToast } = useJobs();
  if (!toast) return null;
  return <Toast message={toast.message} type={toast.type} onClose={hideToast} />;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <JobProvider>
        {children}
        <GlobalToast />
      </JobProvider>
    </ThemeProvider>
  );
}
