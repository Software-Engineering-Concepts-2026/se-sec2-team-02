'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Search, Plus, ArrowLeft, X, User, LogIn } from 'lucide-react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';

interface HeaderProps {
  currentView?: 'home' | 'search' | 'detail' | 'profile' | 'create';
  onBack?: () => void;
  backLabel?: string;
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
  backLabel,
  searchQuery: propSearchQuery,
  onSearchChange,
  onOpenCreateModal,
  onNavigateToHome,
  onNavigateToSearch,
  onNavigateToProfile
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase Auth warning in Header:', err);
    }
  }, []);

  // Local state if controlled query isn't passed
  const [localQuery, setLocalQuery] = useState('');
  const searchQuery = propSearchQuery !== undefined ? propSearchQuery : localQuery;

  // Determine active view
  let activeView: 'home' | 'search' | 'detail' | 'profile' | 'create' = propCurrentView || 'home';
  if (!propCurrentView && pathname) {
    if (pathname === '/search') activeView = 'search';
    else if (pathname.startsWith('/jobs/')) activeView = 'detail';
    else if (pathname === '/profile') activeView = 'profile';
    else if (pathname === '/create' || pathname === '/create_job') activeView = 'create';
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

  const handleGoAuth = () => {
    router.push('/auth');
  };

  const handleGoProfile = () => {
    if (!currentUser) {
      router.push('/auth');
      return;
    }
    if (onNavigateToProfile) onNavigateToProfile();
    else router.push('/profile');
  };

  const handleCreate = () => {
    if (!currentUser) {
      router.push('/auth');
      return;
    }
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
      <header className="w-full bg-white/85 backdrop-blur-md border-b border-zinc-200/80 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-zinc-700 hover:text-zinc-950 font-semibold px-3.5 py-2 rounded-xl hover:bg-zinc-100/80 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-600" />
            <span className="text-sm sm:text-base font-bold">{backLabel || (activeView === 'create' ? 'ยกเลิก' : 'กลับ')}</span>
          </button>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={handleGoSearch}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-zinc-500" />
              <span>ค้นหางาน</span>
            </button>

            {currentUser ? (
              <button
                onClick={handleGoProfile}
                title="โปรไฟล์ของฉัน"
                className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-250 flex items-center justify-center text-zinc-700 transition-all cursor-pointer overflow-hidden shadow-2xs"
              >
                {currentUser.photoURL ? (
                  <Image
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Profile'}
                    width={36}
                    height={36}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </button>
            ) : (
              <button
                onClick={handleGoAuth}
                title="เข้าสู่ระบบ หรือ สมัครสมาชิก"
                className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Login/Register</span>
              </button>
            )}

            <div
              onClick={handleGoHome}
              className="flex items-center gap-2.5 cursor-pointer group pl-2 border-l border-zinc-200"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-zinc-900 to-zinc-700 text-white flex items-center justify-center font-black text-xs shadow-2xs group-hover:scale-105 transition-transform">
                JP
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-zinc-900 group-hover:text-blue-600 transition-colors leading-none">
                  JOB Phayao
                </span>
                <span className="text-[10px] text-zinc-500 font-normal mt-0.5">
                  หางานหน้าพะเยา
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full bg-white/85 backdrop-blur-md border-b border-zinc-200/80 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 min-h-18 py-3 sm:py-0 flex flex-wrap items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo */}
        <div
          onClick={handleGoHome}
          className="order-1 flex items-center gap-2.5 cursor-pointer shrink-0 select-none group sm:order-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-zinc-900 to-zinc-700 text-white flex items-center justify-center font-black text-sm shadow-2xs group-hover:scale-105 transition-transform">
            JP
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 group-hover:text-blue-600 transition-colors leading-none">
              JOB Phayao
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 font-normal">
              หางานหน้าพะเยา
            </span>
          </div>
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
              className="w-full bg-zinc-100/80 hover:bg-zinc-100 focus:bg-white text-zinc-900 placeholder:text-zinc-400 text-xs sm:text-sm pl-4 pr-10 py-2.5 rounded-full border border-zinc-200/60 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-900/5 transition-all duration-200 shadow-2xs"
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
            className={`w-9 h-9 sm:w-auto sm:h-auto shrink-0 flex items-center justify-center rounded-full text-xs sm:gap-1.5 sm:px-4 sm:py-2 sm:text-sm font-bold transition-all cursor-pointer ${
              activeView === 'search'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-zinc-100/90 hover:bg-zinc-200 text-zinc-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">ค้นหางาน</span>
          </button>

          {currentUser ? (
            <>
              <button
                onClick={handleCreate}
                className="hidden sm:flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มงาน</span>
              </button>

              <button
                onClick={handleGoProfile}
                title="โปรไฟล์ของฉัน (ข้อมูลส่วนตัว & ผลงาน)"
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer overflow-hidden shadow-2xs ${
                  activeView === 'profile'
                    ? 'bg-zinc-900 text-white border-zinc-900 ring-2 ring-zinc-900/20'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-250'
                }`}
              >
                {currentUser.photoURL ? (
                  <Image
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Profile'}
                    width={36}
                    height={36}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handleGoAuth}
              title="เข้าสู่ระบบ หรือ สมัครสมาชิก"
              className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Login/Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
