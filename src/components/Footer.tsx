'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-t border-zinc-200/70 dark:border-zinc-800/80 py-10 text-center text-xs text-zinc-500 dark:text-zinc-400 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-black text-xs shadow-xs">
            J
          </div>
          <span className="font-bold text-sm text-zinc-800 dark:text-zinc-200 tracking-tight">
            JOB Phayao
          </span>
        </div>
        
        <p className="text-zinc-600 dark:text-zinc-400 font-medium max-w-md">
          JOB Phayao — แพลตฟอร์มศูนย์กลางจับคู่งานพาร์ตไทม์และฟรีแลนซ์ เพื่อคนพะเยา
        </p>

        <div className="flex items-center gap-4 text-zinc-400 dark:text-zinc-500 text-[11px] pt-1">
          <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
            หน้าหลัก
          </Link>
          <span>•</span>
          <Link href="/search" className="hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
            ค้นหางาน
          </Link>
          <span>•</span>
          <Link href="/profile" className="hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
            โปรไฟล์
          </Link>
        </div>

        <p className="text-zinc-400 dark:text-zinc-500 text-[11px] pt-2 border-t border-zinc-100 dark:border-zinc-800 w-full max-w-sm">
          Software Engineering Concepts 2026 • Team 2 หาร (sec2-team-02)
        </p>
      </div>
    </footer>
  );
}
