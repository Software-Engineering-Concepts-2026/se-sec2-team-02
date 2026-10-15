'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
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

  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [jobToApply, setJobToApply] = useState<Job | null>(null);

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase Auth warning in Search:', err);
    }
  }, []);

  const handleSelectJob = (job: Job) => {
    router.push(`/jobs/${job.id}`);
  };

  const handleQuickApply = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation();
    let user = currentUser;
    if (!user) {
      try {
        user = getFirebaseAuth().currentUser;
      } catch {
        // ignore
      }
    }
    if (!user) {
      router.push('/auth');
      return;
    }
    // เจ้าของโพสไม่สามารถสมัครงานของโพสตัวเองได้ ให้ไปหน้าแก้ไขแทน
    if (job.userId && user.uid === job.userId) {
      router.push(`/edit/${job.id}`);
      return;
    }
    setJobToApply(job);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 flex flex-col font-sans text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <Header currentView="search" />

      <main className="flex-1 pb-16">
        <SearchPageView
          jobs={jobs}
          onSelectJob={handleSelectJob}
          onQuickApply={handleQuickApply}
          onBackToHome={handleBackToHome}
          initialQuery={initialQuery}
          initialCategory={initialCat}
          currentUserId={currentUser?.uid}
        />
      </main>

      {/* Unified Footer */}
      <Footer />

      {jobToApply && currentUser && (
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
