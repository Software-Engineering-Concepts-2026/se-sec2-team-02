'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Plus, ArrowLeft, X, User } from 'lucide-react';

interface HeaderProps {
  currentView?: 'home' | 'search' | 'detail' | 'profile' | 'create';
  onBack?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenCreateModal?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToSearch?: () => void;
  onNavigateToProfile?: () => void;
}

export default function Header({
  currentView: propCurrentView,
  onBack,
  searchQuery: propSearchQuery,
  onSearchChange,
  onOpenCreateModal,
  onNavigateToHome,
  onNavigateToSearch,
  onNavigateToProfile
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Local state if controlled query isn't passed
  const [localQuery, setLocalQuery] = useState('');
  const searchQuery = propSearchQuery !== undefined ? propSearchQuery : localQuery;

  // Determine active view
  let activeView: 'home' | 'search' | 'detail' | 'profile' | 'create' = propCurrentView || 'home';
  if (!propCurrentView && pathname) {
    if (pathname === '/search') activeView = 'search';
    else if (pathname.startsWith('/jobs/')) activeView = 'detail';
    else if (pathname === '/profile') activeView = 'profile';
    else if (pathname === '/create') activeView = 'create';
    else activeView = 'home';
  }

  const handleSearchSubmit = () => {
    if (onNavigateToSearch) {
      onNavigateToSearch();
    } else {
      const q = searchQuery.trim();
      router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
    }
  };

  const handleQueryChange = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      setLocalQuery(val);
    }
  };

  const handleGoHome = () => {
    if (onNavigateToHome) onNavigateToHome();
    else router.push('/');
  };

  const handleGoSearch = () => {
    if (onNavigateToSearch) onNavigateToSearch();
    else router.push('/search');
  };

  const handleGoProfile = () => {
    if (onNavigateToProfile) onNavigateToProfile();
    else router.push('/profile');
  };

  const handleCreate = () => {
    if (onOpenCreateModal) onOpenCreateModal();
    else router.push('/create');
  };

  const handleBack = () => {
    if (onBack) onBack();
    else if (typeof window !== 'undefined' && window.history.length > 1) router.back();
    else router.push('/');
  };

  // If in detail or create view, show back button
  if (activeView === 'detail' || activeView === 'create') {
    return (
      <header className="w-full bg-white border-b border-zinc-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-zinc-800 hover:text-zinc-600 font-medium px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base font-semibold">กลับ</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGoSearch}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-zinc-500" />
              <span>ค้นหางาน</span>
            </button>

            <button
              onClick={handleGoProfile}
              title="โปรไฟล์นิสิต"
              className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 flex items-center justify-center text-zinc-700 transition-all cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>

            <div
              onClick={handleGoHome}
              className="flex flex-col items-end cursor-pointer group pl-2"
            >
              <span className="text-2xl font-black tracking-tight text-zinc-900 group-hover:text-blue-600 transition-colors">
                JOB UP
              </span>
              <span className="text-xs text-zinc-500 font-normal">
                หางานหน้า ม.พะเยา
              </span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full bg-white border-b border-zinc-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 min-h-18 py-3 sm:py-0 flex flex-wrap items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo */}
        <div
          onClick={handleGoHome}
          className="order-1 flex flex-col cursor-pointer shrink-0 select-none group sm:order-0"
        >
          <span className="text-2xl font-black tracking-tight text-zinc-900 group-hover:text-blue-600 transition-colors leading-none">
            JOB UP
          </span>
          <span className="text-xs text-zinc-500 mt-1 font-normal">
            หางานหน้า ม.พะเยา
          </span>
        </div>

        {/* Search Bar matching Homepage.png */}
        <div className="order-3 basis-full min-w-0 max-w-lg sm:order-0 sm:flex-1 sm:basis-auto sm:mx-2">
          <div className="relative flex items-center w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit();
                }
              }}
              placeholder="ค้นหาชื่อตำแหน่งงาน, ร้านค้า, หรือสถานที่..."
              className="w-full bg-zinc-100 hover:bg-zinc-50 focus:bg-white text-zinc-900 placeholder:text-zinc-400 text-xs sm:text-sm pl-4 pr-10 py-2.5 rounded-full border border-transparent focus:border-zinc-300 focus:outline-hidden transition-all duration-200"
            />
            {searchQuery ? (
              <button
                onClick={() => handleQueryChange('')}
                className="absolute right-3 text-zinc-400 hover:text-zinc-600 p-1 cursor-pointer"
                aria-label="ล้างการค้นหา"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSearchSubmit}
                className="absolute right-2.5 text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer"
                title="ไปยังหน้าค้นหา"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation & Action Buttons */}
        <div className="order-2 ml-auto flex items-center gap-2 sm:order-0 sm:ml-0 sm:gap-3 shrink-0">
          {/* Dedicated Search Page Button */}
          <button
            onClick={handleGoSearch}
            aria-label="ค้นหางาน"
            className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full text-xs sm:w-auto sm:h-auto sm:gap-1.5 sm:px-4 sm:py-2 sm:text-sm font-bold transition-all cursor-pointer ${
              activeView === 'search'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">ค้นหางาน</span>
          </button>

          <button
            onClick={handleCreate}
            className="hidden sm:flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มงาน</span>
          </button>

          <button
            onClick={handleGoProfile}
            title="โปรไฟล์ของฉัน (ข้อมูลส่วนตัว & ผลงาน)"
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
              activeView === 'profile'
                ? 'bg-zinc-900 text-white border-zinc-900 ring-2 ring-zinc-900/20'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
            }`}
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
