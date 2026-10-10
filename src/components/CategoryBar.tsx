'use client';

import React from 'react';
import { JobCategory } from '@/types/job';
import { CATEGORY_LIST } from '@/constants/categories';
import { ArrowRight } from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: JobCategory;
  onSelectCategory: (category: JobCategory) => void;
  onOpenCreateModal?: () => void;
  onShowAll: () => void;
}

export default function CategoryBar({
  selectedCategory,
  onSelectCategory,
  onShowAll
}: CategoryBarProps) {
  const categories = CATEGORY_LIST;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
            หมวดหมู่งาน
          </h2>
          <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
            {categories.length} หมวด
          </span>
        </div>
        <button
          onClick={onShowAll}
          className="inline-flex items-center gap-1 text-xs sm:text-sm text-zinc-500 hover:text-zinc-950 font-semibold transition-colors cursor-pointer group"
        >
          <span>ดูทั้งหมด</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Category Buttons Row */}
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => onSelectCategory(cat.key)}
              className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-zinc-900 text-white shadow-xs ring-2 ring-zinc-900/10'
                  : 'bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200/80 hover:border-zinc-300 shadow-2xs hover:shadow-xs'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
