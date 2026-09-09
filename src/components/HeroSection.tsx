'use client';

import React from 'react';
import { Briefcase, Sparkles, MapPin, Users } from 'lucide-react';

interface HeroSectionProps {
  onStartSearch: () => void;
}

export default function HeroSection({ onStartSearch }: HeroSectionProps) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-6">
      <div className="bg-gradient-to-br from-zinc-50 via-zinc-100/70 to-zinc-200/40 rounded-3xl border border-zinc-200/80 p-6 sm:p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
        {/* Left Text Block */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-200/70 text-zinc-700 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Community Connector เพื่อนิสิต ม.พะเยา</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
            กำลังมองหางานอยู่ใช่ไหม?
          </h1>

          <p className="mt-4 text-base sm:text-lg text-zinc-600 max-w-lg leading-relaxed">
            ไม่ว่าจะหารายได้เสริม หรือหาคนช่วยงาน<br className="hidden sm:inline" />
            เราพร้อมเชื่อมต่อคุณกับโอกาสที่ใช่ รอบรั้วมหาวิทยาลัยพะเยา
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
            <button
              onClick={onStartSearch}
              className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white text-base font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95"
            >
              เริ่มหางาน
            </button>
            <div className="flex items-center gap-4 text-xs text-zinc-500 mt-2 sm:mt-0 px-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" /> หน้ามอ & ในมอ
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-zinc-400" /> รับรองผู้ว่าจ้างจริง
              </span>
            </div>
          </div>
        </div>

        {/* Right Graphic Banner matching Homepage.png */}
        <div className="w-full md:w-80 lg:w-96 h-60 sm:h-72 bg-gradient-to-br from-zinc-200 to-zinc-300/80 rounded-2xl flex flex-col items-center justify-center p-6 border border-zinc-200 text-zinc-500 shrink-0 relative overflow-hidden group">
          <div className="absolute inset-0 bg-radial from-white/30 via-transparent to-transparent opacity-60" />
          <div className="w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center text-zinc-700 mb-4 group-hover:scale-105 transition-transform duration-300">
            <Briefcase className="w-10 h-10 text-zinc-800" />
          </div>
          <p className="text-base font-bold text-zinc-800 text-center">
            JOB WANTED UP
          </p>
          <p className="text-xs text-zinc-500 text-center mt-1">
            ศูนย์กลางจับคู่งานพาร์ตไทม์ และฟรีแลนซ์ ม.พะเยา
          </p>
        </div>
      </div>
    </section>
  );
}
