'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import SearchPageView from '@/components/SearchPageView';
import ApplyModal from '@/components/ApplyModal';
import { useJobs } from '@/context/JobContext';
import { Job, JobCategory } from '@/types/job';

import Footer from '@/components/Footer';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCat = (searchParams.get('cat') as JobCategory) || 'all';

  const { jobs, applyForJob } = useJobs();

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
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-zinc-900">
      <Header currentView="search" />

      <main className="flex-1 pb-16">
        <SearchPageView
          jobs={jobs}
          onSelectJob={handleSelectJob}
          onQuickApply={handleQuickApply}
          onBackToHome={handleBackToHome}
          initialQuery={initialQuery}
          initialCategory={initialCat}
        />
      </main>

      {/* Unified Footer */}
      <Footer />

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
