'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus, Image as ImageIcon, MapPin } from 'lucide-react';
import { Job, JobCategory, Coordinates } from '@/types/job';
import { CATEGORY_LABELS, COMPENSATION_UNIT_LIST } from '@/constants/categories';
import { getFirebaseAuth } from '@/lib/firebase';
import MapPickerModal from '@/components/MapPickerModal';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateJob: (newJob: Job) => void;
}

export default function CreateJobModal({
  isOpen,
  onClose,
  onCreateJob
}: CreateJobModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<JobCategory>('part-time');
  const [salary, setSalary] = useState<number | ''>('');
  const [salaryUnit, setSalaryUnit] = useState<Job['salaryUnit']>('ชั่วโมง');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState<Coordinates>({ lat: 19.0284, lng: 99.8970 });
  const [hasPinned, setHasPinned] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [openings, setOpenings] = useState(1);
  const [gender, setGender] = useState('ไม่จำกัดเพศ');
  const [age, setAge] = useState('18 ปีขึ้นไป');
  const [description, setDescription] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [facebook, setFacebook] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedImage, setSelectedImage] = useState('/images/coffee_barista.jpg');

  if (!isOpen) return null;

  const sampleImages = [
    { label: 'ร้านกาแฟ / บาริสต้า', path: '/images/coffee_barista.jpg' },
    { label: 'ฟรีแลนซ์ / วิชาการ / กราฟิก', path: '/images/tutor_math.jpg' },
    { label: 'ไรเดอร์ / ส่งของ', path: '/images/delivery_rider.jpg' },
    { label: 'คีย์ข้อมูล / เอกสาร', path: '/images/data_entry.jpg' },
    { label: 'ร้านอาหาร / หมูกระทะ', path: '/images/hotpot_server.jpg' },
    { label: 'ร้านหนังสือ / สื่อการเรียน', path: '/images/bookstore.jpg' },
    { label: 'สัตว์เลี้ยง / คลินิก', path: '/images/pet_care.jpg' }
  ];

  const handleSaveCoordinates = (coords: Coordinates, locName: string) => {
    setCoordinates(coords);
    setHasPinned(true);
    if (locName) {
      setLocation(locName);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !employerName || !phone) return;

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
      onClose();
      router.push('/auth');
      return;
    }

    const newJob: Job = {
      id: `job-${Date.now()}`,
      userId: currentUserId,
      title,
      category,
      categoryLabel: CATEGORY_LABELS[category] || 'พาร์ทไทม์',
      salary: Number(salary),
      salaryUnit,
      location,
      coordinates,
      status: 'open',
      date,
      time,
      mainImage: selectedImage,
      images: [selectedImage, '/images/bookstore.jpg', '/images/coffee_barista.jpg'],
      description,
      qualifications: {
        openings: Number(openings),
        gender,
        age
      },
      employer: {
        name: employerName,
        memberSince: '2569',
        rating: 0,
        reviewsCount: 0,
        verified: true
      },
      contact: {
        facebook: facebook || '-',
        phone
      },
      mapQuery: `${location} พะเยา`
    };

    onCreateJob(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      {/* Modal Container: Max width XL, max height 90vh, flex column with scrollable body */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-zinc-200/80 dark:border-zinc-800 animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Fixed Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-white dark:bg-zinc-900">
          <div>
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              JOB WANTED PHAYAO
            </span>
            <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100 leading-tight mt-0.5">
              สร้างประกาศรับสมัครงานใหม่
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="createJobForm" onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto space-y-4 flex-1 text-sm">
          {/* Job Title */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              หัวข้อประกาศ / ตำแหน่งงาน <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น พนักงานชงกาแฟพาร์ทไทม์ ช่วงเย็น"
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-400 focus:outline-hidden text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-50/50 dark:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-800 transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            />
          </div>

          {/* Category, Salary, Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                หมวดหมู่
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as JobCategory)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-400 focus:outline-hidden text-xs text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800"
              >
                <option value="part-time">พาร์ทไทม์</option>
                <option value="full-time">ประจำ</option>
                <option value="freelance">ฟรีแลนซ์</option>
                <option value="errand">รับหิ้ว/รับส่ง</option>
                <option value="other">ทั่วไป</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                ค่าตอบแทน <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-400 focus:outline-hidden text-xs text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                หน่วยคิดเงิน
              </label>
              <select
                value={salaryUnit}
                onChange={(e) => setSalaryUnit(e.target.value as Job['salaryUnit'])}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-400 focus:outline-hidden text-xs text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800"
              >
                {COMPENSATION_UNIT_LIST.map((unit) => (
                  <option key={unit.key} value={unit.key}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              สถานที่ปฏิบัติงาน <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1 flex items-center">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 absolute left-3" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="เช่น คาเฟ่หน้า ม.พะเยา"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-400 focus:outline-hidden text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsMapModalOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  hasPinned
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-bold'
                    : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${hasPinned ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-600 dark:text-zinc-400'}`} />
                <span>{hasPinned ? 'แก้ไขหมุด' : 'ปักหมุดแผนที่'}</span>
              </button>
            </div>
            {hasPinned && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                <span>✓ ปักหมุดพิกัดจริง:</span>
                <span className="font-mono bg-emerald-50 dark:bg-emerald-950/50 px-1 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/50">
                  {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                </span>
              </p>
            )}
          </div>

          {/* Time & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                ช่วงเวลาทำงาน
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="เช่น 18:00 น. - 22:00 น."
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-400 focus:outline-hidden text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                วันที่เริ่มงาน
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="เช่น 15 พ.ค. 2569 หรือ ทันที"
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-400 focus:outline-hidden text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
            </div>
          </div>

          {/* Qualifications: Openings, Gender, Age */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                จำนวนที่รับ (คน)
              </label>
              <input
                type="number"
                min={1}
                value={openings}
                onChange={(e) => setOpenings(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-400 focus:outline-hidden text-xs text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                เพศที่รับ
              </label>
              <input
                type="text"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                placeholder="เช่น ไม่จำกัดเพศ"
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-400 focus:outline-hidden text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                อายุที่รับ
              </label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="เช่น 18 ปีขึ้นไป"
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-400 focus:outline-hidden text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
            </div>
          </div>

          {/* Image Selection */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span>เลือกรูปภาพธีมงาน</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {sampleImages.map((img) => (
                <button
                  type="button"
                  key={img.path}
                  onClick={() => setSelectedImage(img.path)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                    selectedImage === img.path
                      ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                  }`}
                >
                  {img.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              รายละเอียดหน้าที่ความรับผิดชอบ <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="อธิบายลักษณะงาน คุณสมบัติผู้สมัคร และเงื่อนไขต่างๆ"
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-400 focus:outline-hidden text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 resize-none"
            />
          </div>

          {/* Employer & Contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                ชื่อผู้โพสต์ประกาศงาน (ผู้ว่าจ้าง) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={employerName}
                onChange={(e) => setEmployerName(e.target.value)}
                placeholder="เช่น พี่เอก หรือ อาจารย์สมชาย (ผู้ว่าจ้าง)"
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-400 focus:outline-hidden text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                เบอร์โทรศัพท์ติดต่อ <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="เช่น 089-xxx-xxxx"
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-400 focus:outline-hidden text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Facebook
            </label>
            <input
              type="text"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="เช่น Facebook Page"
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-400 focus:outline-hidden text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            />
          </div>
        </form>

        {/* Fixed Footer with Actions */}
        <div className="px-6 py-3.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-3 shrink-0 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            form="createJobForm"
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>เผยแพร่ประกาศ</span>
          </button>
        </div>

      </div>

      {/* Real Interactive Map Pinning Modal */}
      <MapPickerModal
        isOpen={isMapModalOpen}
        initialCoordinates={coordinates}
        initialLocationName={location}
        onClose={() => setIsMapModalOpen(false)}
        onSave={handleSaveCoordinates}
      />
    </div>
  );
}
