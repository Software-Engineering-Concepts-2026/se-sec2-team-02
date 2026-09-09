'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategoryBar from '@/components/CategoryBar';
import JobCard from '@/components/JobCard';
import WorkDetailView from '@/components/WorkDetailView';
import SearchPageView from '@/components/SearchPageView';
import ProfileView from '@/components/ProfileView';
import ApplyModal from '@/components/ApplyModal';
import CreateJobModal from '@/components/CreateJobModal';
import Toast from '@/components/Toast';
import { initialJobs } from '@/data/mockJobs';
import { Job, JobCategory, JobApplication } from '@/types/job';
import { filterJobs } from '@/utils/jobFilters';

export default function Home() {
  // Navigation View State: 'home' | 'search' | 'detail' | 'profile'
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'detail' | 'profile'>('home');

  // Jobs Data & Interactions State
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<JobCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['job-01']));
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [jobToApply, setJobToApply] = useState<Job | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);

  // Filtered jobs for Homepage using shared filter utility
  const filteredJobs = useMemo(() => {
    return filterJobs(jobs, {
      query: searchQuery,
      category: selectedCategory
    });
  }, [jobs, selectedCategory, searchQuery]);

  // Handlers
  const handleToggleFavorite = (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      const job = jobs.find((j) => j.id === jobId);
      if (next.has(jobId)) {
        next.delete(jobId);
        setToast({ message: `นำ "${job?.title || 'งาน'}" ออกจากรายการโปรดแล้ว`, type: 'info' });
      } else {
        next.add(jobId);
        setToast({ message: `เพิ่ม "${job?.title || 'งาน'}" ลงในรายการโปรดแล้ว`, type: 'success' });
      }
      return next;
    });
  };

  const handleShare = async (job: Job) => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setToast({ message: `คัดลอกลิงก์สำหรับงาน "${job.title}" แล้ว!`, type: 'success' });
      }
    } catch {
      setToast({ message: `ไม่สามารถคัดลอกลิงก์ได้ในขณะนี้`, type: 'error' });
    }
  };

  const handleQuickApply = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation();
    setJobToApply(job);
    setIsApplyModalOpen(true);
  };

  const handleOpenApplyModal = (job: Job) => {
    setJobToApply(job);
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = (app: JobApplication) => {
    setAppliedJobs((prev) => new Set(prev).add(app.jobId));
    setToast({
      message: `ยื่นใบสมัครสำเร็จ! ส่งข้อมูลของคุณไปยังผู้ว่าจ้างเรียบร้อยแล้ว`,
      type: 'success'
    });
  };

  const handleCreateJob = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
    setToast({
      message: `เผยแพร่ประกาศ "${newJob.title}" สำเร็จ!`,
      type: 'success'
    });
    setSelectedJob(newJob);
    setCurrentView('detail');
  };

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    setCurrentView('detail');
  };

  const handleNavigateToSearch = () => {
    setCurrentView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToHome = () => {
    setSelectedJob(null);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToProfile = () => {
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-zinc-100/60 flex flex-col font-sans text-zinc-900">
      {/* Universal Header */}
      <Header
        currentView={currentView}
        onBack={() => {
          setSelectedJob(null);
          setCurrentView('home');
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
        }}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onNavigateToHome={handleNavigateToHome}
        onNavigateToSearch={handleNavigateToSearch}
        onNavigateToProfile={handleNavigateToProfile}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {currentView === 'detail' && selectedJob ? (
          /* 1. Work Detail View matching Design/WorkDetail.png */
          <WorkDetailView
            job={selectedJob}
            isFavorite={favorites.has(selectedJob.id)}
            isApplied={appliedJobs.has(selectedJob.id)}
            onToggleFavorite={handleToggleFavorite}
            onOpenApplyModal={handleOpenApplyModal}
            onShare={handleShare}
          />
        ) : currentView === 'search' ? (
          /* 2. Dedicated Search & Filters View */
          <SearchPageView
            jobs={jobs}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectJob={handleSelectJob}
            onQuickApply={handleQuickApply}
            onBackToHome={handleNavigateToHome}
            initialQuery={searchQuery}
            initialCategory={selectedCategory}
          />
        ) : currentView === 'profile' ? (
          /* 3. Profile View: Personal Info + 3-part Portfolio */
          <ProfileView
            onBackToHome={handleNavigateToHome}
            onOpenCreateJob={() => setIsCreateModalOpen(true)}
          />
        ) : (
          /* 4. Homepage View matching Design/Homepage.png */
          <div>
            {/* Hero Section */}
            <HeroSection onStartSearch={handleNavigateToSearch} />

            {/* Category Filter Bar */}
            <CategoryBar
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              onShowAll={handleNavigateToSearch}
            />

            {/* Latest Jobs Section matching Homepage.png */}
            <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                    ประกาศล่าสุด
                  </h2>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-200 text-zinc-700">
                    {filteredJobs.length} รายการ
                  </span>
                </div>
                <button
                  onClick={handleNavigateToSearch}
                  className="text-xs sm:text-sm text-zinc-500 hover:text-zinc-900 font-medium transition-colors cursor-pointer"
                >
                  ดูทั้งหมด &gt;
                </button>
              </div>

              {/* Grid of Job Cards matching Homepage.png */}
              {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isFavorite={favorites.has(job.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelect={handleSelectJob}
                      onQuickApply={handleQuickApply}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center my-6">
                  <p className="text-base font-bold text-zinc-800">
                    ไม่พบประกาศงานที่ตรงกับคำค้นหาหรือเงื่อนไข
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    ลองเปลี่ยนคำค้นหา หรือกดปุ่มค้นหาเพื่อปรับตัวกรองอย่างละเอียด
                  </p>
                  <button
                    onClick={handleNavigateToSearch}
                    className="mt-4 px-5 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 cursor-pointer"
                  >
                    ไปที่หน้าค้นหาละเอียด
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
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

      {/* Interactive Modals */}
      {jobToApply && (
        <ApplyModal
          job={jobToApply}
          isOpen={isApplyModalOpen}
          onClose={() => {
            setIsApplyModalOpen(false);
            setJobToApply(null);
          }}
          onSubmitApplication={handleSubmitApplication}
        />
      )}

      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateJob={handleCreateJob}
      />

      {/* Toast System */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
