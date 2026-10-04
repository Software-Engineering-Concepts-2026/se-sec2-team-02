'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategoryBar from '@/components/CategoryBar';
import JobCard from '@/components/JobCard';
import ApplyModal from '@/components/ApplyModal';
import { useJobs } from '@/context/JobContext';
import { Job, JobCategory } from '@/types/job';
import { filterJobs } from '@/utils/jobFilters';

export default function Home() {
  const router = useRouter();
  const { jobs, favorites, toggleFavorite, applyForJob } = useJobs();

  const [selectedCategory, setSelectedCategory] = useState<JobCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobToApply, setJobToApply] = useState<Job | null>(null);

  // Filtered jobs for Homepage
  const filteredJobs = useMemo(() => {
    return filterJobs(jobs, {
      query: searchQuery,
      category: selectedCategory
    });
  }, [jobs, selectedCategory, searchQuery]);

  const handleSelectJob = (job: Job) => {
    router.push(`/jobs/${job.id}`);
  };

  const handleQuickApply = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation();
    setJobToApply(job);
  };

  const handleNavigateToSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else if (selectedCategory !== 'all') {
      router.push(`/search?cat=${encodeURIComponent(selectedCategory)}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100/60 flex flex-col font-sans text-zinc-900">
      {/* Universal Header */}
      <Header
        currentView="home"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigateToHome={() => router.push('/')}
        onNavigateToSearch={handleNavigateToSearch}
        onNavigateToProfile={() => router.push('/profile')}
        onOpenCreateModal={() => router.push('/create')}
      />

      {/* Main Homepage View matching Takdanai Prototype & Figma Design */}
      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <HeroSection onStartSearch={() => router.push('/search')} />

        {/* Category Filter Bar */}
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onOpenCreateModal={() => router.push('/create')}
          onShowAll={() => router.push('/search')}
        />

        {/* Latest Jobs Section */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6">
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
              onClick={() => router.push('/search')}
              className="text-xs sm:text-sm text-zinc-500 hover:text-zinc-900 font-medium transition-colors cursor-pointer"
            >
              ดูทั้งหมด &gt;
            </button>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isFavorite={favorites.has(job.id)}
                  onToggleFavorite={(id) => toggleFavorite(id, job.title)}
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
                onClick={() => router.push('/search')}
                className="mt-4 px-5 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 cursor-pointer"
              >
                ไปที่หน้าค้นหาละเอียด
              </button>
            </div>
          )}
        </section>
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

      {/* Quick Apply Modal */}
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
