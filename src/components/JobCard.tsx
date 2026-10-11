'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowUpRight, Edit3 } from 'lucide-react';
import { Job } from '@/types/job';

interface JobCardProps {
  job: Job;
  onSelect: (job: Job) => void;
  onQuickApply?: (job: Job, e: React.MouseEvent) => void;
  isOwner?: boolean;
  onEdit?: (job: Job, e: React.MouseEvent) => void;
}

export default function JobCard({
  job,
  onSelect,
  onQuickApply,
  isOwner = false,
  onEdit,
}: JobCardProps) {
  const router = useRouter();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(job, e);
    } else {
      router.push(`/edit/${job.id}`);
    }
  };

  return (
    <div
      onClick={() => onSelect(job)}
      className="group bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/90 overflow-hidden hover:shadow-xl dark:hover:shadow-zinc-950/60 hover:border-zinc-300 dark:hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer shadow-2xs"
    >
      {/* Top Image Container */}
      <div className="relative w-full h-44 sm:h-48 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        {job.mainImage ? (
          <Image
            src={job.mainImage}
            alt={job.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 text-sm">
            ไม่มีรูปภาพ
          </div>
        )}

        {/* Category Tag pill overlay */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md text-xs font-bold text-zinc-800 dark:text-zinc-200 shadow-2xs border border-white/60 dark:border-zinc-700">
          {job.categoryLabel}
        </span>

        {/* Status indicator and Owner badge on top right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {isOwner && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white backdrop-blur-md shadow-2xs">
              โพสต์ของคุณ
            </span>
          )}
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold backdrop-blur-md shadow-2xs ${
              job.status === 'open'
                ? 'bg-emerald-500/90 text-white'
                : 'bg-zinc-800/80 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-400'
            }`}
          >
            {job.status === 'open' ? 'เปิดรับ' : 'ปิดแล้ว'}
          </span>
        </div>
      </div>

      {/* Bottom Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
              {job.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
          </div>

          {/* Wage / Rate */}
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
              {job.salary}
            </span>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              บาท/{job.salaryUnit}
            </span>
          </div>

          {/* Location */}
          <div className="mt-3.5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
            <span className="truncate font-medium">{job.location}</span>
          </div>
        </div>

        {/* Action Button at Bottom */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          {isOwner ? (
            <button
              onClick={handleEditClick}
              className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 shadow-2xs hover:shadow-xs cursor-pointer active:scale-98 flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>แก้ไขโพสต์</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                if (onQuickApply && job.status === 'open') {
                  e.stopPropagation();
                  onQuickApply(job, e);
                }
              }}
              disabled={job.status !== 'open'}
              className={`w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                job.status === 'open'
                  ? 'bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 shadow-2xs hover:shadow-xs cursor-pointer active:scale-98'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed'
              }`}
            >
              {job.status === 'open' ? 'สมัครด่วน' : 'ปิดรับสมัคร'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
