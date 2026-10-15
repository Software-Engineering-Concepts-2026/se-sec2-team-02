'use client';

import React from 'react';
import { Briefcase, Sparkles, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onStartSearch: () => void;
}

export default function HeroSection({ onStartSearch }: HeroSectionProps) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-zinc-50/70 to-zinc-100/60 dark:from-zinc-900 dark:via-zinc-900/90 dark:to-zinc-950 border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm transition-colors duration-200">
        {/* Ambient background glows for clean modern depth */}
        <div className="pointer-events-none absolute -top-28 -left-28 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-28 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl" />

        {/* Left Text Block */}
        <div className="relative z-10 flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Community Connector เพื่อคนพะเยา</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
            กำลังมองหางานอยู่ใช่ไหม?
          </h1>

          <p className="mt-3 text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-300 max-w-lg leading-relaxed">
            ไม่ว่าจะหารายได้เสริม หรือหาคนช่วยงาน<br className="hidden sm:inline" />
            เราพร้อมเชื่อมต่อคุณกับโอกาสที่ใช่ รอบพะเยา
          </p>

          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <button
              onClick={onStartSearch}
              className="w-full sm:w-auto px-7 py-3.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 text-sm sm:text-base font-bold rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            >
              <span>เริ่มค้นหางาน</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 px-1">
              <span className="flex items-center gap-1.5 font-medium text-zinc-600 dark:text-zinc-300 bg-white/80 dark:bg-zinc-800/80 px-2.5 py-1.5 rounded-xl border border-zinc-200/60 dark:border-zinc-700 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> พะเยา
              </span>
              <span className="flex items-center gap-1.5 font-medium text-zinc-600 dark:text-zinc-300 bg-white/80 dark:bg-zinc-800/80 px-2.5 py-1.5 rounded-xl border border-zinc-200/60 dark:border-zinc-700 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> ปลอดภัย มีตัวตนจริง
              </span>
            </div>
          </div>
        </div>

        {/* Right Graphic Banner */}
        <div className="relative z-10 w-full md:w-80 lg:w-88 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-zinc-200/80 dark:border-zinc-800 shadow-md flex flex-col items-center text-center shrink-0 group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
          <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider mb-5 shadow-xs">
            JOB WANTED PHAYAO
          </span>

          <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 text-white dark:text-zinc-900 shadow-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
            <Briefcase className="w-9 h-9 text-white dark:text-zinc-900" />
          </div>

          <h3 className="text-base font-black text-zinc-900 dark:text-white">
            ศูนย์กลางจับคู่งานพาร์ตไทม์
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs">
            พาร์ตไทม์ ฟรีแลนซ์ และงานทั่วไปในพื้นที่พะเยา
          </p>

          <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 w-full flex items-center justify-around text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
            <span>✓ ค่าตอบแทนชัดเจน</span>
            <span>•</span>
            <span>✓ ติดต่อง่าย</span>
          </div>
        </div>
      </div>
    </section>
  );
}
