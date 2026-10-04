'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import SearchPageView from '@/components/SearchPageView';
import ApplyModal from '@/components/ApplyModal';
import { useJobs } from '@/context/JobContext';
import { Job, JobCategory } from '@/types/job';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCat = (searchParams.get('cat') as JobCategory) || 'all';

  const { jobs, favorites, toggleFavorite, applyForJob } = useJobs();

  const [jobToApply, setJobToApply] = useState<Job | null>(null);

  const handleSelectJob = (job: Job) => {
    router.push(`/jobs/${job.id}`);
  };

  const handleQuickApply = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation();
    setJobToApply(job);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-zinc-100/60 flex flex-col font-sans text-zinc-900">
      <Header currentView="search" />

      <main className="flex-1 pb-16">
        <SearchPageView
          jobs={jobs}
          favorites={favorites}
          onToggleFavorite={(id) => toggleFavorite(id)}
          onSelectJob={handleSelectJob}
          onQuickApply={handleQuickApply}
          onBackToHome={handleBackToHome}
          initialQuery={initialQuery}
          initialCategory={initialCat}
        />
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-zinc-200 py-8 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4">
          <p className="font-semibold text-zinc-700">
            JOB UP — แพลตฟอร์มศูนย์กลางจับคู่งานนิสิต มหาวิทยาลัยพะเยา
          </p>
          <p className="mt-1">
            Software Engineering Concepts 2026 • Team 2 หาร (sec2-team-02)
          </p>
        </div>
      </footer>

      {jobToApply && (
        <ApplyModal
          job={jobToApply}
          isOpen={!!jobToApply}
          onClose={() => setJobToApply(null)}
          onSubmitApplication={(app) => {
            applyForJob(app);
            setJobToApply(null);
          }}
        />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-500">กำลังโหลดหน้าค้นหางาน...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
