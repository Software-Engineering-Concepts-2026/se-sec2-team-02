'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import Header from '@/components/Header';
import WorkDetailView from '@/components/WorkDetailView';
import ApplyModal from '@/components/ApplyModal';
import { useJobs } from '@/context/JobContext';
import { Job } from '@/types/job';

import Footer from '@/components/Footer';

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { getJobById, appliedJobs, applyForJob, showToast } = useJobs();

  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase Auth warning in JobDetailPage:', err);
    }
  }, []);

  const job = getJobById(id);
  const isOwner = Boolean(currentUser && job?.userId && currentUser.uid === job.userId);

  const handleShare = async (jobToShare: Job) => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        showToast(`คัดลอกลิงก์สำหรับงาน "${jobToShare.title}" แล้ว!`, 'success');
      }
    } catch {
      showToast('ไม่สามารถคัดลอกลิงก์ได้ในขณะนี้', 'error');
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-zinc-900">
        <Header currentView="detail" onBack={() => router.push('/search')} />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-8 max-w-md w-full text-center shadow-xs">
            <h1 className="text-xl font-bold text-zinc-900 mb-2">ไม่พบประกาศงาน</h1>
            <p className="text-sm text-zinc-500 mb-6">
              ประกาศงานนี้อาจถูกลบหรือหมดอายุไปแล้ว
            </p>
            <Link
              href="/search"
              className="inline-block px-6 py-2.5 rounded-2xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-xs"
            >
              ค้นหาประกาศงานอื่น ๆ
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isApplied = appliedJobs.has(job.id);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-zinc-900">
      <Header currentView="detail" onBack={() => router.back()} />

      <main className="flex-1 pb-16">
        <WorkDetailView
          job={job}
          isApplied={isApplied}
          isOwner={isOwner}
          onOpenApplyModal={() => {
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
            if (isOwner) {
              showToast('คุณไม่สามารถสมัครงานที่คุณเป็นผู้ประกาศได้', 'info');
              return;
            }
            setIsApplyModalOpen(true);
          }}
          onShare={handleShare}
        />
      </main>

      {/* Unified Footer */}
      <Footer />

      {!isOwner && currentUser && (
        <ApplyModal
          job={job}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSubmitApplication={(app) => {
            applyForJob(app);
            setIsApplyModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
