'use client';

import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Filter, RotateCcw, ArrowLeft } from 'lucide-react';
import { Job, JobCategory } from '@/types/job';
import { CATEGORY_LIST } from '@/constants/categories';
import { filterJobs, sortJobs } from '@/utils/jobFilters';
import JobCard from '@/components/JobCard';

interface SearchPageViewProps {
  jobs: Job[];
  favorites: Set<string>;
  onToggleFavorite: (jobId: string, e: React.MouseEvent) => void;
  onSelectJob: (job: Job) => void;
  onQuickApply: (job: Job, e: React.MouseEvent) => void;
  onBackToHome: () => void;
  initialQuery?: string;
  initialCategory?: JobCategory;
}

export default function SearchPageView({
  jobs,
  favorites,
  onToggleFavorite,
  onSelectJob,
  onQuickApply,
  onBackToHome,
  initialQuery = '',
  initialCategory = 'all'
}: SearchPageViewProps) {
  // Search & Filter State
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<JobCategory>(initialCategory);
  const [sortBy, setSortBy] = useState<'latest' | 'salary-desc' | 'salary-asc' | 'distance-asc'>('latest');
  const [minSalary, setMinSalary] = useState<number>(0);
  const [maxDistance, setMaxDistance] = useState<number>(5000);
  const [showOpenOnly, setShowOpenOnly] = useState<boolean>(false);

  // Filter and sort computation using shared utilities
  const filteredAndSortedJobs = useMemo(() => {
    const filtered = filterJobs(jobs, {
      query,
      category: selectedCategory,
      minSalary,
      maxDistance,
      showOpenOnly
    });

    return sortJobs(filtered, sortBy);
  }, [jobs, query, selectedCategory, minSalary, maxDistance, showOpenOnly, sortBy]);

  const handleResetFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setSortBy('latest');
    setMinSalary(0);
    setMaxDistance(5000);
    setShowOpenOnly(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300">
      {/* Top Bar with Back link & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับหน้าหลัก</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            ค้นหาและตัวกรองงานพาร์ตไทม์
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            ค้นหางานรอบ ม.พะเยา ตามอัตราค่าตอบแทน ประเภทงาน และระยะทางที่ต้องการ
          </p>
        </div>

        {/* Total Results Count */}
        <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-white px-4 py-2 rounded-2xl border border-zinc-200 shadow-2xs">
          <span className="text-xs text-zinc-500">ผลการค้นหา:</span>
          <span className="text-sm font-bold text-zinc-900">{filteredAndSortedJobs.length} รายการ</span>
        </div>
      </div>

      {/* Search Header Bar */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-4 sm:p-5 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาชื่อตำแหน่งงาน, ร้านค้า, หน้ามอ, หรือตึกเรียน..."
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 hover:bg-zinc-100/70 focus:bg-white text-zinc-900 placeholder:text-zinc-400 rounded-2xl border border-zinc-200 focus:border-zinc-900 focus:outline-hidden text-sm transition-all"
            />
          </div>

          {/* Sort Selector */}
          <div className="relative sm:w-56">
            <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'salary-desc' | 'salary-asc' | 'distance-asc')}
              className="w-full pl-10 pr-8 py-3 bg-zinc-50 hover:bg-zinc-100/70 focus:bg-white text-zinc-800 text-sm font-semibold rounded-2xl border border-zinc-200 focus:border-zinc-900 focus:outline-hidden transition-all appearance-none cursor-pointer"
            >
              <option value="latest">เรียงลำดับ: ล่าสุด</option>
              <option value="salary-desc">ค่าตอบแทน: สูง &rarr; ต่ำ</option>
              <option value="salary-asc">ค่าตอบแทน: ต่ำ &rarr; สูง</option>
              <option value="distance-asc">ระยะทาง: ใกล้ที่สุด</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Sidebar Filters (Left) + Listings Grid (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar (4 Cols on LG) */}
        <aside className="lg:col-span-4 bg-white rounded-3xl border border-zinc-200 p-6 shadow-xs space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div className="flex items-center gap-2 text-zinc-900 font-bold text-base">
              <Filter className="w-4 h-4 text-zinc-700" />
              <span>ตัวกรองละเอียด</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ล้างตัวกรอง</span>
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wide mb-2.5">
              ประเภทงาน
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORY_LIST.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key as JobCategory)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center ${
                    selectedCategory === cat.key
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Salary Filter Slider */}
          <div className="pt-4 border-t border-zinc-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                ค่าตอบแทนขั้นต่ำ
              </label>
              <span className="text-xs font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-lg">
                {minSalary === 0 ? 'ทั้งหมด' : `${minSalary} บาท/ชม.`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={200}
              step={5}
              value={minSalary}
              onChange={(e) => setMinSalary(Number(e.target.value))}
              className="w-full accent-zinc-900 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 mt-1">
              <span>0 บาท</span>
              <span>100 บาท</span>
              <span>200+ บาท</span>
            </div>
          </div>

          {/* Distance Filter Slider */}
          <div className="pt-4 border-t border-zinc-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                ระยะทางสูงสุด
              </label>
              <span className="text-xs font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-lg">
                {maxDistance >= 5000 ? 'ทุกระยะทาง' : `ไม่เกิน ${(maxDistance / 1000).toFixed(1)} กม.`}
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={5000}
              step={250}
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-zinc-900 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 mt-1">
              <span>500 ม.</span>
              <span>2.5 กม.</span>
              <span>5.0+ กม.</span>
            </div>
          </div>

          {/* Status Checkbox */}
          <div className="pt-4 border-t border-zinc-100">
            <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showOpenOnly}
                onChange={(e) => setShowOpenOnly(e.target.checked)}
                className="w-4 h-4 rounded text-zinc-900 accent-zinc-900 focus:ring-zinc-900"
              />
              <span>แสดงเฉพาะตำแหน่งที่ยังเปิดรับสมัคร</span>
            </label>
          </div>
        </aside>

        {/* Right Listings Grid (8 Cols on LG) */}
        <div className="lg:col-span-8">
          {filteredAndSortedJobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {filteredAndSortedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isFavorite={favorites.has(job.id)}
                  onToggleFavorite={onToggleFavorite}
                  onSelect={onSelectJob}
                  onQuickApply={onQuickApply}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto mb-3">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-zinc-800">ไม่พบงานที่ตรงกับเงื่อนไขการค้นหา</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                กรุณาลองปรับลดเกณฑ์ตัวกรอง หรือเปลี่ยนคำค้นหาเพื่อดูประกาศงานอื่นๆ
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-5 px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all cursor-pointer"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
