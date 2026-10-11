'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategoryBar from '@/components/CategoryBar';
import JobCard from '@/components/JobCard';
import ApplyModal from '@/components/ApplyModal';
import { useJobs } from '@/context/JobContext';
import { Job, JobCategory } from '@/types/job';
import { filterJobs } from '@/utils/jobFilters';

import Footer from '@/components/Footer';

export default function Home() {
  const router = useRouter();
  const { jobs, applyForJob } = useJobs();

  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<JobCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobToApply, setJobToApply] = useState<Job | null>(null);

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase Auth warning in Home:', err);
    }
  }, []);

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
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-zinc-900">
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
          onShowAll={() => router.push('/search')}
        />

        {/* Latest Jobs Section */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                ประกาศล่าสุด
              </h2>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-200/80 text-zinc-700">
                {filteredJobs.length} รายการ
              </span>
            </div>
            <button
              onClick={() => router.push('/search')}
              className="inline-flex items-center gap-1 text-xs sm:text-sm text-zinc-500 hover:text-zinc-950 font-semibold transition-colors cursor-pointer group"
            >
              <span>ดูทั้งหมด</span>
              <span className="group-hover:translate-x-0.5 transition-transform">&gt;</span>
            </button>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredJobs.map((job) => {
                const isOwner = Boolean(currentUser && job.userId && currentUser.uid === job.userId);
                return (
                  <JobCard
                    key={job.id}
                    job={job}
                    isOwner={isOwner}
                    onSelect={handleSelectJob}
                    onQuickApply={handleQuickApply}
                    onEdit={(jobToEdit, e) => {
                      e.stopPropagation();
                      router.push(`/edit/${jobToEdit.id}`);
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-12 text-center my-6 shadow-2xs">
              <p className="text-base font-bold text-zinc-800">
                ไม่พบประกาศงานที่ตรงกับคำค้นหาหรือเงื่อนไข
              </p>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                ลองเปลี่ยนคำค้นหา หรือกดปุ่มค้นหาเพื่อปรับตัวกรองอย่างละเอียด
              </p>
              <button
                onClick={() => router.push('/search')}
                className="mt-5 px-6 py-2.5 rounded-2xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 cursor-pointer shadow-xs hover:shadow-sm transition-all"
              >
                ไปที่หน้าค้นหาละเอียด
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Unified Footer */}
      <Footer />

      {/* Quick Apply Modal */}
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
