'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { JobCategory } from '@/types/job';
import { CATEGORY_LIST } from '@/constants/categories';

interface CategoryBarProps {
  selectedCategory: JobCategory;
  onSelectCategory: (category: JobCategory) => void;
  onOpenCreateModal: () => void;
  onShowAll: () => void;
}

export default function CategoryBar({
  selectedCategory,
  onSelectCategory,
  onOpenCreateModal,
  onShowAll
}: CategoryBarProps) {
  const categories = CATEGORY_LIST;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
          หมวดหมู่
        </h2>
        <button
          onClick={onShowAll}
          className="text-xs sm:text-sm text-zinc-500 hover:text-zinc-900 font-medium transition-colors cursor-pointer"
        >
          ดูทั้งหมด &gt;
        </button>
      </div>

      {/* Category Buttons Row matching Homepage.png */}
      <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
        {/* "+ เพิ่มงาน" button */}
        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 text-sm font-semibold whitespace-nowrap shadow-2xs transition-all cursor-pointer hover:border-zinc-400"
        >
          <Plus className="w-4 h-4 text-zinc-600" />
          <span>+ เพิ่มงาน</span>
        </button>

        {/* Dynamic Category Pills */}
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => onSelectCategory(cat.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-zinc-900 text-white shadow-xs font-semibold'
                  : 'bg-zinc-200/80 hover:bg-zinc-300/80 text-zinc-700'
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
