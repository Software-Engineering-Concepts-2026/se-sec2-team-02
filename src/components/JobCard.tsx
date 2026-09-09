'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, MapPin, Navigation2 } from 'lucide-react';
import { Job } from '@/types/job';
import { formatDistance } from '@/utils/format';

interface JobCardProps {
  job: Job;
  isFavorite: boolean;
  onToggleFavorite: (jobId: string, e: React.MouseEvent) => void;
  onSelect: (job: Job) => void;
  onQuickApply?: (job: Job, e: React.MouseEvent) => void;
}

export default function JobCard({
  job,
  isFavorite,
  onToggleFavorite,
  onSelect,
  onQuickApply
}: JobCardProps) {

  return (
    <div
      onClick={() => onSelect(job)}
      className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-lg hover:border-zinc-300 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Top Image Container matching Homepage.png */}
      <div className="relative w-full h-44 sm:h-48 bg-zinc-100 overflow-hidden">
        {job.mainImage ? (
          <Image
            src={job.mainImage}
            alt={job.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-200 text-zinc-400 text-sm">
            ไม่มีรูปภาพ
          </div>
        )}

        {/* Category Tag pill overlay */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-xs font-semibold text-zinc-800 shadow-xs">
          {job.categoryLabel}
        </span>
      </div>

      {/* Bottom Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Heart Button */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {job.title}
            </h3>
            <button
              onClick={(e) => onToggleFavorite(job.id, e)}
              className="p-1 text-zinc-400 hover:text-rose-500 transition-colors shrink-0 cursor-pointer"
              title={isFavorite ? 'นำออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
              aria-label="ถูกใจ"
            >
              <Heart
                className={`w-5 h-5 transition-transform active:scale-125 ${
                  isFavorite
                    ? 'fill-rose-500 text-rose-500'
                    : 'stroke-zinc-400 hover:stroke-rose-500'
                }`}
              />
            </button>
          </div>

          {/* Wage / Rate */}
          <div className="mt-2 text-sm font-semibold text-zinc-900">
            {job.salary} บาท/{job.salaryUnit}
          </div>

          {/* Location & Distance matching Homepage.png */}
          <div className="mt-3 space-y-1.5 text-xs text-zinc-500">
            <div className="flex items-center gap-1.5 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Navigation2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>{formatDistance(job.distance)}</span>
            </div>
          </div>
        </div>

        {/* Status Button at Bottom */}
        <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between">
          <button
            onClick={(e) => {
              if (onQuickApply && job.status === 'open') {
                e.stopPropagation();
                onQuickApply(job, e);
              }
            }}
            disabled={job.status !== 'open'}
            className={`w-full py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
              job.status === 'open'
                ? 'bg-zinc-200/90 hover:bg-zinc-300 text-zinc-800 font-semibold cursor-pointer'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
            }`}
          >
            {job.status === 'open' ? 'เปิดรับ' : 'ปิดรับสมัคร'}
          </button>
        </div>
      </div>
    </div>
  );
}
