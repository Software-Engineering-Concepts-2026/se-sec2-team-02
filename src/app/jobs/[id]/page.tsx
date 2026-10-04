'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import WorkDetailView from '@/components/WorkDetailView';
import ApplyModal from '@/components/ApplyModal';
import { useJobs } from '@/context/JobContext';
import { Job } from '@/types/job';

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { getJobById, favorites, appliedJobs, toggleFavorite, applyForJob, showToast } = useJobs();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const job = getJobById(id);

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
      <div className="min-h-screen bg-zinc-100/60 flex flex-col font-sans text-zinc-900">
        <Header currentView="detail" onBack={() => router.push('/search')} />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl border border-zinc-200 p-8 max-w-md w-full text-center shadow-xs">
            <h1 className="text-xl font-bold text-zinc-900 mb-2">ไม่พบประกาศงาน</h1>
            <p className="text-sm text-zinc-500 mb-6">
              ประกาศงานนี้อาจถูกลบหรือหมดอายุไปแล้ว
            </p>
            <Link
              href="/search"
              className="inline-block px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
            >
              ค้นหาประกาศงานอื่น ๆ
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isFavorite = favorites.has(job.id);
  const isApplied = appliedJobs.has(job.id);

  return (
    <div className="min-h-screen bg-zinc-100/60 flex flex-col font-sans text-zinc-900">
      <Header currentView="detail" onBack={() => router.back()} />

      <main className="flex-1 pb-16">
        <WorkDetailView
          job={job}
          isFavorite={isFavorite}
          isApplied={isApplied}
          onToggleFavorite={(jobId, e) => toggleFavorite(jobId, job.title)}
          onOpenApplyModal={() => setIsApplyModalOpen(true)}
          onShare={handleShare}
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

      <ApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmitApplication={(app) => {
          applyForJob(app);
          setIsApplyModalOpen(false);
        }}
      />
    </div>
  );
}
