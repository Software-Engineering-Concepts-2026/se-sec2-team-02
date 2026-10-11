'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { onAuthStateChanged } from 'firebase/auth';
import Header from '@/components/Header';
import { useJobs } from '@/context/JobContext';
import { Job, JobCategory, Coordinates } from '@/types/job';
import { CATEGORY_LABELS, COMPENSATION_UNIT_LIST } from '@/constants/categories';
import { MapPin, Phone, Globe, Clock, Check } from 'lucide-react';
import Footer from '@/components/Footer';
import MapPickerModal from '@/components/MapPickerModal';
import { getFirebaseAuth } from '@/lib/firebase';

export default function CreateJobPage() {
  const router = useRouter();
  const { addJob } = useJobs();

  // Auth Protection: If user is not logged in or registered, redirect to /auth
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

  // Form states matching Yanathron's Prototype
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<JobCategory>('part-time');
  const [salary, setSalary] = useState<number | ''>('');
  const [salaryUnit, setSalaryUnit] = useState<Job['salaryUnit']>('ชั่วโมง');
  const [description, setDescription] = useState('');
  const [workTime, setWorkTime] = useState('');
  const [location, setLocation] = useState('');
  const [openings, setOpenings] = useState<number>(1);

  // Employer & Contacts
  const [employerName, setEmployerName] = useState('');
  const [facebook, setFacebook] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image Selection / Upload
  const sampleImages = [
    { label: 'ร้านกาแฟ / บาริสต้า', path: '/images/coffee_barista.jpg' },
    { label: 'ฟรีแลนซ์ / กราฟิก / วิชาการ', path: '/images/tutor_math.jpg' },
    { label: 'ไรเดอร์ / ส่งของ', path: '/images/delivery_rider.jpg' },
    { label: 'คีย์ข้อมูล / ธุรการ', path: '/images/data_entry.jpg' },
    { label: 'ร้านอาหาร / หมูกระทะ', path: '/images/hotpot_server.jpg' },
    { label: 'ร้านหนังสือ / ศูนย์หนังสือ', path: '/images/bookstore.jpg' },
    { label: 'ดูแลสัตว์เลี้ยง / คลินิก', path: '/images/pet_care.jpg' }
  ];
  const [selectedImage, setSelectedImage] = useState('/images/coffee_barista.jpg');

  // Real Map Pinning State
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates>({ lat: 19.0284, lng: 99.8970 });
  const [hasPinned, setHasPinned] = useState(false);

  const handleSaveCoordinates = (coords: Coordinates, locName: string) => {
    setCoordinates(coords);
    setHasPinned(true);
    if (locName) {
      setLocation(locName);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !employerName || !phone) return;
    if (isSubmitting) return;

    let currentUserId = '';
    try {
      const auth = getFirebaseAuth();
      if (auth.currentUser) {
        currentUserId = auth.currentUser.uid;
      }
    } catch {
      // offline or not logged in
    }

    if (!currentUserId) {
      router.push('/auth');
      return;
    }

    setIsSubmitting(true);

    const newJobId = `job-${Date.now()}`;
    const newJob: Job = {
      id: newJobId,
      userId: currentUserId,
      title,
      category,
      categoryLabel: CATEGORY_LABELS[category] || 'พาร์ทไทม์',
      salary: Number(salary),
      salaryUnit,
      location,
      coordinates,
      status: 'open',
      date: 'เริ่มงานได้ทันที',
      time: workTime || 'ตามตกลง',
      mainImage: selectedImage,
      images: [selectedImage, '/images/hotpot_server.jpg', '/images/bookstore.jpg'],
      description,
      qualifications: {
        openings: Number(openings),
        gender: 'ไม่จำกัดเพศ',
        age: '18 ปีขึ้นไป',
        experience: 'ยินดีรับผู้ไม่มีประสบการณ์',
        skills: ['ตรงต่อเวลา', 'มีความรับผิดชอบ', 'มีใจรักบริการ']
      },
      employer: {
        name: employerName,
        memberSince: '2569',
        rating: 0,
        reviewsCount: 0,
        verified: true
      },
      contact: {
        facebook: facebook || 'JOB Phayao',
        phone
      },
      mapQuery: location
    };

    try {
      await addJob(newJob);
      router.push(`/jobs/${newJobId}`);
    } catch (err) {
      console.error('Failed to submit job:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-zinc-900">
      <Header currentView="create" onBack={() => router.back()} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            เพิ่มประกาศงานใหม่
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            ลงประกาศรับสมัครงานพาร์ตไทม์ ฟรีแลนซ์ หรืองานทั่วไปในจังหวัดพะเยา
          </p>
        </div>

        {/* Form Container (2-Column Layout matching Yanathron Prototype) */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Images & Contacts (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Image Selection Card */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs">
              <h2 className="text-sm font-bold text-zinc-900 mb-1 flex items-center gap-2">
                <span>รูปภาพประกอบประกาศ</span>
              </h2>
              <p className="text-xs text-zinc-500 mb-3">
                เลือกธีมรูปภาพที่ตรงกับลักษณะงานของคุณ
              </p>

              {/* Main Preview Image */}
              <div className="relative w-full h-48 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100 mb-3">
                <Image
                  src={selectedImage}
                  alt="Selected Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  unoptimized
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs">
                  รูปภาพหลัก
                </span>
              </div>

              {/* Image Options Grid */}
              <div className="grid grid-cols-2 gap-2">
                {sampleImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img.path)}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                      selectedImage === img.path
                        ? 'border-zinc-900 bg-zinc-50 ring-2 ring-zinc-900/10'
                        : 'border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <Image
                      src={img.path}
                      alt={img.label}
                      width={32}
                      height={32}
                      unoptimized
                      className="w-8 h-8 rounded-md object-cover shrink-0"
                    />
                    <span className="text-[11px] font-medium text-zinc-800 line-clamp-1">
                      {img.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs">
              <h2 className="text-sm font-bold text-zinc-900 mb-1">
                ข้อมูลผู้ประกาศและช่องทางติดต่อ
              </h2>
              <p className="text-xs text-zinc-500 mb-4">
                ระบุข้อมูลเพื่อให้ผู้สมัครสามารถติดต่อสอบถามหรือสมัครงานได้
              </p>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    ชื่อผู้ประกาศ / ร้านค้า <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                    placeholder="เช่น พี่เอก (Slow Life Cafe)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:border-zinc-900 focus:outline-hidden text-xs text-zinc-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    เบอร์โทรศัพท์ <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08X-XXX-XXXX"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-300 focus:border-zinc-900 focus:outline-hidden text-xs text-zinc-900 bg-white"
                    />
                  </div>
                </div>


                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Facebook / เพจร้านค้า
                  </label>
                  <div className="relative flex items-center">
                    <Globe className="w-4 h-4 text-zinc-400 absolute left-3" />
                    <input
                      type="text"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="ชื่อเพจ หรือ Facebook ส่วนตัว"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-300 focus:border-zinc-900 focus:outline-hidden text-xs text-zinc-900 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Job Details Form (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs flex flex-col gap-4">
              <h2 className="text-base font-bold text-zinc-900 pb-2 border-b border-zinc-100">
                รายละเอียดงาน
              </h2>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  หัวข้อประกาศงาน <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="เช่น พนักงานร้านกาแฟ (Barista), ติวเตอร์คณิตศาสตร์ ม.ปลาย"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:border-zinc-900 focus:outline-hidden text-sm text-zinc-900 bg-white"
                />
              </div>

              {/* Category, Salary, Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    หมวดหมู่งาน
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as JobCategory)}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 focus:border-zinc-900 focus:outline-hidden text-xs text-zinc-900 bg-white cursor-pointer"
                  >
                    <option value="part-time">พาร์ทไทม์</option>
                    <option value="full-time">ประจำ</option>
                    <option value="freelance">ฟรีแลนซ์</option>
                    <option value="errand">รับหิ้ว/รับส่ง</option>
                    <option value="other">ทั่วไป</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    ค่าตอบแทน <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 focus:border-zinc-900 focus:outline-hidden text-xs text-zinc-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    หน่วยคิดเงิน
                  </label>
                  <select
                    value={salaryUnit}
                    onChange={(e) => setSalaryUnit(e.target.value as Job['salaryUnit'])}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 focus:border-zinc-900 focus:outline-hidden text-xs text-zinc-900 bg-white cursor-pointer"
                  >
                    {COMPENSATION_UNIT_LIST.map((unit) => (
                      <option key={unit.key} value={unit.key}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  รายละเอียดของงานและหน้าที่ความรับผิดชอบ <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="อธิบายรายละเอียดลักษณะงาน หน้าที่ความรับผิดชอบ คุณสมบัติผู้สมัคร และสิ่งที่ต้องเตรียม..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:border-zinc-900 focus:outline-hidden text-xs text-zinc-900 bg-white"
                />
              </div>

              {/* Work Hours & Openings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    เวลาทำงาน / กะ
                  </label>
                  <div className="relative flex items-center">
                    <Clock className="w-4 h-4 text-zinc-400 absolute left-3" />
                    <input
                      type="text"
                      value={workTime}
                      onChange={(e) => setWorkTime(e.target.value)}
                      placeholder="เช่น 18:00 - 22:00 น."
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-300 focus:border-zinc-900 focus:outline-hidden text-xs text-zinc-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    จำนวนที่เปิดรับ (คน)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={openings}
                    onChange={(e) => setOpenings(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:border-zinc-900 focus:outline-hidden text-xs text-zinc-900 bg-white"
                  />
                </div>
              </div>

              {/* Location & Real Map Pinning */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  สถานที่ทำงาน <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1 flex items-center">
                    <MapPin className="w-4 h-4 text-zinc-400 absolute left-3" />
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="ระบุชื่อร้านค้า หรือตำแหน่งรอบพะเยา"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-300 focus:border-zinc-900 focus:outline-hidden text-xs text-zinc-900 bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMapModalOpen(true)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 shadow-2xs active:scale-95 ${
                      hasPinned
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 ${hasPinned ? 'text-rose-600' : 'text-zinc-600'}`} />
                    <span>{hasPinned ? 'แก้ไขหมุดแผนที่' : 'ปักหมุดแผนที่'}</span>
                  </button>
                </div>
                {hasPinned && (
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                    <span>✓ ปักหมุดพิกัดจริงแล้ว:</span>
                    <span className="font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                      {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                    </span>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'กำลังบันทึกและเผยแพร่...' : 'เผยแพร่ประกาศงาน'}</span>
                </button>
              </div>
            </div>
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

      {/* Unified Footer */}
      <Footer />
    </div>
  );
}
