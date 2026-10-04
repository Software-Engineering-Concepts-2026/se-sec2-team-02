'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useJobs } from '@/context/JobContext';
import { Job, JobCategory } from '@/types/job';
import { CATEGORY_LABELS, CATEGORY_LIST, COMPENSATION_UNIT_LIST } from '@/constants/categories';
import { Upload, MapPin, Phone, MessageSquare, Globe, Clock, Calendar, Check, X, ArrowLeft } from 'lucide-react';

export default function CreateJobPage() {
  const router = useRouter();
  const { addJob } = useJobs();

  // Form states matching Yanathron's Prototype
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<JobCategory>('part-time');
  const [salary, setSalary] = useState<number>(45);
  const [salaryUnit, setSalaryUnit] = useState<Job['salaryUnit']>('ชั่วโมง');
  const [description, setDescription] = useState('');
  const [workTime, setWorkTime] = useState('17:00 - 22:00 น.');
  const [location, setLocation] = useState('หน้ามหาวิทยาลัยพะเยา');
  const [distance, setDistance] = useState<number>(800);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [openings, setOpenings] = useState<number>(2);

  // Employer & Contacts
  const [employerName, setEmployerName] = useState('');
  const [lineId, setLineId] = useState('');
  const [facebook, setFacebook] = useState('');
  const [phone, setPhone] = useState('');

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

  // Map modal simulation
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [pinnedCoordinates, setPinnedCoordinates] = useState<{ x: number; y: number } | null>(null);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setPinnedCoordinates({ x, y });
  };

  const handleSaveLocation = () => {
    setIsMapModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !employerName || !phone) return;

    const newJobId = `job-${Date.now()}`;
    const newJob: Job = {
      id: newJobId,
      title,
      category,
      categoryLabel: CATEGORY_LABELS[category] || 'พาร์ทไทม์',
      salary: Number(salary),
      salaryUnit,
      location,
      distance: Number(distance),
      status: 'open',
      date: startDate ? `เริ่ม ${startDate}` : 'เริ่มงานได้ทันที',
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
        rating: 5.0,
        reviewsCount: 1,
        verified: true
      },
      contact: {
        lineId: lineId || '@up_job',
        facebook: facebook || 'JOB UP Phayao',
        phone
      },
      mapQuery: location
    };

    addJob(newJob);
    router.push(`/jobs/${newJobId}`);
  };

  return (
    <div className="min-h-screen bg-zinc-100/60 flex flex-col font-sans text-zinc-900">
      <Header currentView="create" onBack={() => router.back()} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
              เพิ่มประกาศงานใหม่
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              ลงประกาศรับสมัครงานพาร์ตไทม์ ฟรีแลนซ์ หรืองานช่วยเหลือนิสิตรอบ ม.พะเยา
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 px-3 py-2 rounded-xl hover:bg-zinc-200/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ยกเลิก</span>
          </button>
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
                <img
                  src={selectedImage}
                  alt="Selected Preview"
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
                    <img
                      src={img.path}
                      alt={img.label}
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
                ระบุข้อมูลเพื่อให้นิสิตสามารถติดต่อสอบถามหรือสมัครงานได้
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
                    LINE ID
                  </label>
                  <div className="relative flex items-center">
                    <MessageSquare className="w-4 h-4 text-zinc-400 absolute left-3" />
                    <input
                      type="text"
                      value={lineId}
                      onChange={(e) => setLineId(e.target.value)}
                      placeholder="@line_id"
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

              {/* Location & Map Pin */}
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
                      placeholder="ระบุชื่อร้านค้า หรือตำแหน่งรอบ ม.พะเยา"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-300 focus:border-zinc-900 focus:outline-hidden text-xs text-zinc-900 bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMapModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer shrink-0"
                  >
                    <MapPin className="w-3.5 h-3.5 text-zinc-600" />
                    <span>{pinnedCoordinates ? 'แก้ไขหมุด' : 'ปักหมุดแผนที่'}</span>
                  </button>
                </div>
              </div>

              {/* Distance from UP */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  ระยะทางโดยประมาณจากหน้า ม.พะเยา (เมตร)
                </label>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:border-zinc-900 focus:outline-hidden text-xs text-zinc-900 bg-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-5 py-2.5 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>เผยแพร่ประกาศงาน</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Map Pinning Modal (Simulation matching Yanathron Prototype) */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
              <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-500" />
                <span>ปักหมุดตำแหน่งที่ตั้งร้าน / สถานที่ทำงาน</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsMapModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-500 mb-3">
              คลิกบนแผนที่จำลองบริเวณรอบมหาวิทยาลัยพะเยา เพื่อกำหนดพิกัดสถานที่
            </p>

            {/* Mock Map Canvas */}
            <div
              onClick={handleMapClick}
              className="relative w-full h-64 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 overflow-hidden cursor-crosshair flex items-center justify-center select-none"
            >
              <div className="text-center text-slate-400 pointer-events-none">
                <MapPin className="w-8 h-8 mx-auto mb-1 opacity-40 text-slate-500" />
                <p className="text-xs font-medium">คลิกเพื่อปักหมุดพิกัดรอบ ม.พะเยา</p>
                <p className="text-[10px] text-slate-400 mt-0.5">(จำลองพิกัดแผนที่เพื่อเชื่อมต่อ Google Maps)</p>
              </div>

              {pinnedCoordinates && (
                <div
                  className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all"
                  style={{ left: `${pinnedCoordinates.x}%`, top: `${pinnedCoordinates.y}%` }}
                >
                  <MapPin className="w-8 h-8 text-rose-600 fill-rose-600 filter drop-shadow-md animate-bounce" />
                </div>
              )}
            </div>

            {pinnedCoordinates && (
              <p className="text-xs text-emerald-600 font-semibold mt-2 text-center">
                ✓ บันทึกพิกัด: {pinnedCoordinates.x}%, {pinnedCoordinates.y}% เรียบร้อยแล้ว
              </p>
            )}

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsMapModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                ปิด
              </button>
              <button
                type="button"
                onClick={handleSaveLocation}
                className="px-5 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-xs"
              >
                บันทึกตำแหน่งนี้
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full bg-white border-t border-zinc-200 py-8 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4">
          <p className="font-semibold text-zinc-700">
            JOB UP — แพลตฟอร์มศูนย์กลางจับคู่งานนิสิต มหาวิทยาลัยพะเยา
          </p>
          <p className="mt-1">
            Software Engineering Concepts 2026 • Team 2 หาร (sec2-team-02)
          </p>
        </div>
      </footer>
    </div>
  );
}
