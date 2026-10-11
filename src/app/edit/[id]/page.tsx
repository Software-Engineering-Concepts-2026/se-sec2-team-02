'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import Header from '@/components/Header';
import { useJobs } from '@/context/JobContext';
import { CATEGORY_LABELS, CATEGORY_LIST, COMPENSATION_UNIT_LIST } from '@/constants/categories';
import { Job, JobCategory, Coordinates } from '@/types/job';
import { Check, Clock, MapPin } from 'lucide-react';
import Footer from '@/components/Footer';
import MapPickerModal from '@/components/MapPickerModal';

export default function EditJobPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { getJobById } = useJobs();

  // Redirect to /auth if unauthenticated
  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.replace('/auth');
        }
      });
      return () => unsubscribe();
    } catch {
      router.replace('/auth');
    }
  }, [router]);

  const originalJob = useMemo(() => getJobById(id), [getJobById, id]);

  if (!originalJob) {
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

  return <EditJobForm key={originalJob.id} originalJob={originalJob} />;
}

function EditJobForm({ originalJob }: { originalJob: Job }) {
  const router = useRouter();
  const { updateJob } = useJobs();

  const [title, setTitle] = useState(originalJob.title);
  const [category, setCategory] = useState<JobCategory>(originalJob.category);
  const [salary, setSalary] = useState<number>(originalJob.salary);
  const [salaryUnit, setSalaryUnit] = useState<Job['salaryUnit']>(originalJob.salaryUnit);
  const [description, setDescription] = useState(originalJob.description);
  const [workTime, setWorkTime] = useState(originalJob.time || '');
  const [openings, setOpenings] = useState<number>(originalJob.qualifications?.openings || 1);
  const [location, setLocation] = useState(originalJob.location);

  // Real Map Pinning State
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates>(
    originalJob.coordinates && originalJob.coordinates.lat
      ? originalJob.coordinates
      : { lat: 19.0284, lng: 99.8970 }
  );
  const [hasPinned, setHasPinned] = useState(
    Boolean(originalJob.coordinates && originalJob.coordinates.lat)
  );

  const handleSaveCoordinates = (coords: Coordinates, locName: string) => {
    setCoordinates(coords);
    setHasPinned(true);
    if (locName) {
      setLocation(locName);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedJob: Job = {
      ...originalJob,
      title,
      category,
      categoryLabel: CATEGORY_LABELS[category] || 'พาร์ทไทม์',
      salary: Number(salary),
      salaryUnit,
      location,
      coordinates,
      time: workTime || 'ตามตกลง',
      description,
      qualifications: {
        ...originalJob.qualifications,
        openings: Number(openings) || 1,
      },
    };

    updateJob(updatedJob);
    router.push(`/jobs/${originalJob.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-zinc-900">
      <Header currentView="create" onBack={() => router.back()} />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">แก้ไขประกาศงาน</h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500">แก้ไขรายละเอียดประกาศงานของคุณแล้วกดบันทึกการแก้ไข</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-zinc-200/80 bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-xs">
          <h2 className="border-b border-zinc-100 pb-3 text-base font-bold">รายละเอียดงาน</h2>

          <div className="mt-4 space-y-4">
            <label className="block text-xs font-bold text-zinc-700">
              หัวข้อประกาศงาน <span className="text-rose-500">*</span>
              <input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="เช่น พนักงานร้านกาแฟ (Barista), ฟรีแลนซ์กราฟิก"
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
                    placeholder="เช่น 17:00 - 22:00 น."
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

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                สถานที่ทำงาน <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1 flex items-center">
                  <MapPin className="absolute left-3 h-4 w-4 text-zinc-400" />
                  <input
                    required
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="ระบุสถานที่ทำงานรอบพะเยา"
                    className="w-full rounded-xl border border-zinc-300 py-3 pl-9 pr-3 text-xs font-normal text-zinc-900 outline-none focus:border-zinc-900 bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsMapModalOpen(true)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold cursor-pointer transition-all shadow-2xs active:scale-95 ${
                    hasPinned
                      ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold'
                      : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                  }`}
                >
                  <MapPin className={`h-3.5 w-3.5 ${hasPinned ? 'text-rose-600' : 'text-zinc-600'}`} />
                  <span>{hasPinned ? 'แก้ไขหมุดแผนที่' : 'ปักหมุดแผนที่'}</span>
                </button>
              </div>
              {hasPinned && (
                <p className="text-[11px] text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                  <span>✓ พิกัดจริงบนแผนที่:</span>
                  <span className="font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                    {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                  </span>
                </p>
              )}
            </div>

          </div>

          <div className="mt-5 flex items-center justify-end border-t border-zinc-100 pt-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 cursor-pointer shadow-xs hover:shadow-sm transition-all"
            >
              <Check className="h-4 w-4" />
              บันทึกการแก้ไข
            </button>
          </div>
        </form>
      </main>

      {/* Real Interactive Map Pinning Modal */}
      <MapPickerModal
        isOpen={isMapModalOpen}
        initialCoordinates={coordinates}
        initialLocationName={location}
        onClose={() => setIsMapModalOpen(false)}
        onSave={handleSaveCoordinates}
      />

      <Footer />
    </div>
  );
}
