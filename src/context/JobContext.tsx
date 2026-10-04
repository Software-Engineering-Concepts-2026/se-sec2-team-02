'use client';

import React, { createContext, useContext, useState, useTransition } from 'react';
import { Job, JobApplication } from '@/types/job';
import { initialJobs } from '@/data/mockJobs';

interface JobContextType {
  jobs: Job[];
  favorites: Set<string>;
  appliedJobs: Set<string>;
  toggleFavorite: (jobId: string, title?: string) => void;
  addJob: (newJob: Job) => void;
  applyForJob: (application: JobApplication) => void;
  getJobById: (id: string) => Job | undefined;
  toast: { message: string; type?: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  hideToast: () => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export function JobProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['job-01']));
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const toggleFavorite = (jobId: string, title?: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      const job = jobs.find((j) => j.id === jobId);
      const jobTitle = title || job?.title || 'งาน';
      if (next.has(jobId)) {
        next.delete(jobId);
        showToast(`นำ "${jobTitle}" ออกจากรายการโปรดแล้ว`, 'info');
      } else {
        next.add(jobId);
        showToast(`เพิ่ม "${jobTitle}" ลงในรายการโปรดแล้ว`, 'success');
      }
      return next;
    });
  };

  const addJob = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
    showToast(`เผยแพร่ประกาศ "${newJob.title}" สำเร็จ!`, 'success');
  };

  const applyForJob = (application: JobApplication) => {
    setAppliedJobs((prev) => new Set(prev).add(application.jobId));
    showToast('ยื่นใบสมัครสำเร็จ! ส่งข้อมูลของคุณไปยังผู้ว่าจ้างเรียบร้อยแล้ว', 'success');
  };

  const getJobById = (id: string) => {
    return jobs.find((job) => job.id === id);
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        favorites,
        appliedJobs,
        toggleFavorite,
        addJob,
        applyForJob,
        getJobById,
        toast,
        showToast,
        hideToast
      }}
    >
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}
