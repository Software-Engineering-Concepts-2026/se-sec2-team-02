'use client';

import React from 'react';
import { Search, Plus, ArrowLeft, X, User } from 'lucide-react';

interface HeaderProps {
  currentView: 'home' | 'search' | 'detail' | 'profile';
  onBack?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCreateModal: () => void;
  onNavigateToHome: () => void;
  onNavigateToSearch: () => void;
  onNavigateToProfile: () => void;
}

export default function Header({
  currentView,
  onBack,
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
  onNavigateToHome,
  onNavigateToSearch,
  onNavigateToProfile
}: HeaderProps) {
  // If in WorkDetail view, show Back Button & Brand
  if (currentView === 'detail') {
    return (
      <header className="w-full bg-white border-b border-zinc-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-800 hover:text-zinc-600 font-medium px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base font-semibold">กลับ</span>
          </button>

          {/* Navigation to Other views */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToSearch}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-zinc-500" />
              <span>ค้นหางาน</span>
            </button>

            <button
              onClick={onNavigateToProfile}
              title="โปรไฟล์นิสิต"
              className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 flex items-center justify-center text-zinc-700 transition-all cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Brand on Right */}
            <div
              onClick={onNavigateToHome}
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo */}
        <div
          onClick={onNavigateToHome}
          className="flex flex-col cursor-pointer shrink-0 select-none group"
        >
          <span className="text-2xl font-black tracking-tight text-zinc-900 group-hover:text-blue-600 transition-colors leading-none">
            JOB UP
          </span>
          <span className="text-xs text-zinc-500 mt-1 font-normal">
            หางานหน้า ม.พะเยา
          </span>
        </div>

        {/* Search Bar matching Homepage.png */}
        <div className="flex-1 max-w-lg mx-1 sm:mx-2">
          <div className="relative flex items-center w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onNavigateToSearch();
                }
              }}
              placeholder="ค้นหาชื่อตำแหน่งงาน, ร้านค้า, หรือสถานที่..."
              className="w-full bg-zinc-100 hover:bg-zinc-50 focus:bg-white text-zinc-900 placeholder:text-zinc-400 text-xs sm:text-sm pl-4 pr-10 py-2.5 rounded-full border border-transparent focus:border-zinc-300 focus:outline-hidden transition-all duration-200"
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-zinc-400 hover:text-zinc-600 p-1"
                aria-label="ล้างการค้นหา"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onNavigateToSearch}
                className="absolute right-2.5 text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer"
                title="ไปยังหน้าค้นหา"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Dedicated Search Page Button */}
          <button
            onClick={onNavigateToSearch}
            className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              currentView === 'search'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>ค้นหางาน</span>
          </button>

          {/* + เพิ่มงาน Button */}
          <button
            onClick={onOpenCreateModal}
            className="hidden sm:flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มงาน</span>
          </button>

          {/* User Profile Avatar Button */}
          <button
            onClick={onNavigateToProfile}
            title="โปรไฟล์ของฉัน (ข้อมูลส่วนตัว & ผลงาน)"
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
              currentView === 'profile'
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
