'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { initialMyPosts } from '@/data/mockProfile';
import { CATEGORY_LABELS, CATEGORY_LIST, COMPENSATION_UNIT_LIST } from '@/constants/categories';
import { Job, JobCategory } from '@/types/job';
import { Check, Clock, MapPin } from 'lucide-react';

type SavedPostOverrides = Record<string, (typeof initialMyPosts)[number]>;

export default function EditJobPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const originalPost = useMemo(() => initialMyPosts.find((post) => post.id === id), [id]);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<JobCategory>('part-time');
  const [salary, setSalary] = useState(45);
  const [salaryUnit, setSalaryUnit] = useState<Job['salaryUnit']>(COMPENSATION_UNIT_LIST[0].key);
  const [description, setDescription] = useState('');
  const [workTime, setWorkTime] = useState('17:00 - 22:00 น.');
  const [openings, setOpenings] = useState(2);
  const [location, setLocation] = useState('หน้ามหาวิทยาลัยพะเยา');
  const [distance, setDistance] = useState(800);

  useEffect(() => {
    if (!originalPost) return;

    const timer = window.setTimeout(() => {
      let savedPost = originalPost;
      try {
        const savedOverrides = JSON.parse(localStorage.getItem('profile-post-overrides') || '{}') as SavedPostOverrides;
        savedPost = savedOverrides[id] || originalPost;
      } catch {
        savedPost = originalPost;
      }

      const categoryOption = CATEGORY_LIST.find((option) => savedPost.category.includes(option.label));
      const salaryMatch = savedPost.wage.match(/\d+/);

      setTitle(savedPost.title);
      setCategory(categoryOption?.key || 'part-time');
      setSalary(salaryMatch ? Number(salaryMatch[0]) : 45);
      setDescription(savedPost.description);
      setLocation(savedPost.location);
    });

    return () => window.clearTimeout(timer);
  }, [id, originalPost]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!originalPost) return;

    const updatedPost = {
      ...originalPost,
      title,
      category: CATEGORY_LABELS[category],
      wage: `${salary} ${COMPENSATION_UNIT_LIST.find((unit) => unit.key === salaryUnit)?.label || ''}`,
      location,
      description
    };

    try {
      const savedOverrides = JSON.parse(localStorage.getItem('profile-post-overrides') || '{}') as SavedPostOverrides;
      localStorage.setItem(
        'profile-post-overrides',
        JSON.stringify({ ...savedOverrides, [originalPost.id]: updatedPost })
      );
    } catch {
      // Continue to the profile page even when local storage is unavailable.
    }

    router.push('/profile');
  };

  if (!originalPost) {
    return (
      <div className="min-h-screen bg-zinc-100/60 flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-sm text-zinc-600">ไม่พบประกาศงานที่ต้องการแก้ไข</p>
          <button
            type="button"
            onClick={() => router.push('/profile')}
            className="mt-4 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white cursor-pointer"
          >
            กลับหน้าโปรไฟล์
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100/60 flex flex-col font-sans text-zinc-900">
      <Header currentView="create" onBack={() => router.push('/profile')} />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">แก้ไขประกาศงาน</h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500">แก้ไขรายละเอียดประกาศงานของคุณแล้วกดบันทึกการแก้ไข</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-xs">
          <h2 className="border-b border-zinc-100 pb-3 text-base font-bold">รายละเอียดงาน</h2>

          <div className="mt-4 space-y-4">
            <label className="block text-xs font-bold text-zinc-700">
              หัวข้อประกาศงาน <span className="text-rose-500">*</span>
              <input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="เช่น พนักงานร้านกาแฟ (Barista), ติวเตอร์คณิตศาสตร์ ม.ปลาย"
                className="mt-1.5 w-full rounded-xl border border-zinc-300 px-3.5 py-3 text-sm font-normal text-zinc-900 outline-none focus:border-zinc-900"
              />
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="block text-xs font-bold text-zinc-700">
                หมวดหมู่งาน
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value as JobCategory)}
                  className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3 py-3 text-xs font-normal text-zinc-900 outline-none focus:border-zinc-900"
                >
                  {CATEGORY_LIST.filter((option) => option.key !== 'all').map((option) => (
                    <option key={option.key} value={option.key}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-bold text-zinc-700">
                ค่าตอบแทน <span className="text-rose-500">*</span>
                <input
                  required
                  min={1}
                  type="number"
                  value={salary}
                  onChange={(event) => setSalary(Number(event.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-zinc-300 px-3 py-3 text-xs font-normal text-zinc-900 outline-none focus:border-zinc-900"
                />
              </label>
              <label className="block text-xs font-bold text-zinc-700">
                หน่วยคิดเงิน
                <select
                  value={salaryUnit}
                  onChange={(event) => setSalaryUnit(event.target.value as Job['salaryUnit'])}
                  className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3 py-3 text-xs font-normal text-zinc-900 outline-none focus:border-zinc-900"
                >
                  {COMPENSATION_UNIT_LIST.map((unit) => (
                    <option key={unit.key} value={unit.key}>{unit.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block text-xs font-bold text-zinc-700">
              รายละเอียดของงานและหน้าที่ความรับผิดชอบ <span className="text-rose-500">*</span>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="อธิบายรายละเอียดลักษณะงาน หน้าที่ความรับผิดชอบ คุณสมบัติผู้สมัคร และสิ่งที่ต้องเตรียม..."
                className="mt-1.5 w-full resize-y rounded-xl border border-zinc-300 px-3.5 py-3 text-xs font-normal text-zinc-900 outline-none focus:border-zinc-900"
              />
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block text-xs font-bold text-zinc-700">
                เวลาทำงาน / กะ
                <span className="relative mt-1.5 flex items-center">
                  <Clock className="absolute left-3 h-4 w-4 text-zinc-400" />
                  <input
                    value={workTime}
                    onChange={(event) => setWorkTime(event.target.value)}
                    className="w-full rounded-xl border border-zinc-300 py-3 pl-9 pr-3 text-xs font-normal text-zinc-900 outline-none focus:border-zinc-900"
                  />
                </span>
              </label>
              <label className="block text-xs font-bold text-zinc-700">
                จำนวนที่เปิดรับ (คน)
                <input
                  min={1}
                  type="number"
                  value={openings}
                  onChange={(event) => setOpenings(Number(event.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-zinc-300 px-3 py-3 text-xs font-normal text-zinc-900 outline-none focus:border-zinc-900"
                />
              </label>
            </div>

            <label className="block text-xs font-bold text-zinc-700">
              สถานที่ทำงาน <span className="text-rose-500">*</span>
              <span className="mt-1.5 flex gap-2">
                <span className="relative flex-1 flex items-center">
                  <MapPin className="absolute left-3 h-4 w-4 text-zinc-400" />
                  <input
                    required
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="w-full rounded-xl border border-zinc-300 py-3 pl-9 pr-3 text-xs font-normal text-zinc-900 outline-none focus:border-zinc-900"
                  />
                </span>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-zinc-100 px-4 py-2.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-200 cursor-pointer"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  ปักหมุดแผนที่
                </button>
              </span>
            </label>

            <label className="block text-xs font-bold text-zinc-700">
              ระยะทางโดยประมาณจากหน้า ม.พะเยา (เมตร)
              <input
                min={0}
                step={50}
                type="number"
                value={distance}
                onChange={(event) => setDistance(Number(event.target.value))}
                className="mt-1.5 w-full rounded-xl border border-zinc-300 px-3 py-3 text-xs font-normal text-zinc-900 outline-none focus:border-zinc-900"
              />
            </label>
          </div>

          <div className="mt-5 flex items-center justify-end gap-3 border-t border-zinc-100 pt-4">
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="rounded-xl border border-zinc-300 px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 cursor-pointer"
            >
              <Check className="h-4 w-4" />
              บันทึกการแก้ไข
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
