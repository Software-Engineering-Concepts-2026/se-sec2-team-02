'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, Share2, Star, User, ExternalLink, MapPin, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { Job } from '@/types/job';
import { formatDistance } from '@/utils/format';

interface WorkDetailViewProps {
  job: Job;
  isFavorite: boolean;
  isApplied: boolean;
  onToggleFavorite: (jobId: string, e: React.MouseEvent) => void;
  onOpenApplyModal: (job: Job) => void;
  onShare: (job: Job) => void;
}

export default function WorkDetailView({
  job,
  isFavorite,
  isApplied,
  onToggleFavorite,
  onOpenApplyModal,
  onShare
}: WorkDetailViewProps) {
  // State for active preview image
  const [activeImage, setActiveImage] = useState<string>(job.mainImage || (job.images && job.images[0]) || '/images/coffee_barista.jpg');
  const [showProfileModal, setShowProfileModal] = useState(false);

  const imagesList = job.images && job.images.length > 0 ? job.images : [job.mainImage];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300">
      {/* Top Grid: Images + Overview Info + Employer Card matching WorkDetail.png */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Gallery Section (5 Cols on LG) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Main Large Image with Heart & Share icons */}
          <div className="relative w-full h-72 sm:h-80 bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={job.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                ไม่มีรูปภาพ
              </div>
            )}

            {/* Heart and Share buttons on top right of image */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                onClick={(e) => onToggleFavorite(job.id, e)}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-zinc-700 hover:text-rose-500 shadow-sm transition-all cursor-pointer active:scale-95"
                aria-label="ถูกใจ"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite
                      ? 'fill-rose-500 text-rose-500'
                      : 'stroke-zinc-500 hover:stroke-rose-500'
                  }`}
                />
              </button>
              <button
                onClick={() => onShare(job)}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-zinc-700 hover:text-blue-600 shadow-sm transition-all cursor-pointer active:scale-95"
                aria-label="แชร์ลิงก์งาน"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 3 Thumbnails below main image */}
          <div className="grid grid-cols-3 gap-2.5">
            {imagesList.slice(0, 3).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImage === img ? 'border-zinc-900 ring-2 ring-zinc-900/10' : 'border-zinc-200 opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Center: Job Meta Details (4 Cols on LG) */}
        <div className="lg:col-span-4 flex flex-col justify-start">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            {job.title}
          </h1>

          <div className="mt-3">
            <span className="text-sm font-medium text-zinc-500">ค่าตอบแทน</span>
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 mt-0.5">
              {job.salary} บาท/{job.salaryUnit}
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm text-zinc-700 bg-zinc-50 p-4 rounded-2xl border border-zinc-200/80">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">ประเภทงาน</span>
              <span className="font-semibold text-zinc-900">{job.categoryLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-zinc-400" /> วันที่
              </span>
              <span className="font-medium text-zinc-800">{job.date}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-zinc-400" /> เวลา
              </span>
              <span className="font-medium text-zinc-800">{job.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-zinc-400" /> สถานที่
              </span>
              <span className="font-medium text-zinc-800 text-right">{job.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">ระยะทาง</span>
              <span className="font-semibold text-blue-600">{formatDistance(job.distance)}</span>
            </div>
          </div>
        </div>

        {/* Right: Employer Profile Card (3 Cols on LG) matching WorkDetail.png */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs flex flex-col items-center text-center">
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 self-start">
            ข้อมูลผู้ประกาศ
          </h2>

          <div className="w-20 h-20 rounded-full bg-zinc-200 border-4 border-zinc-100 flex items-center justify-center text-zinc-600 my-2 overflow-hidden relative shadow-inner">
            <User className="w-10 h-10" />
          </div>

          <h3 className="text-lg font-bold text-zinc-900 mt-2">
            {job.employer.name}
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            สมาชิกตั้งแต่ {job.employer.memberSince}
          </p>

          <div className="flex items-center justify-center gap-1 mt-2 text-amber-500 text-sm font-semibold">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{job.employer.rating}</span>
            <span className="text-zinc-400 font-normal">({job.employer.reviewsCount} รีวิว)</span>
          </div>

          <button
            onClick={() => setShowProfileModal(true)}
            className="w-full mt-5 py-2 px-4 rounded-xl border border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50 text-zinc-800 text-sm font-semibold transition-all cursor-pointer"
          >
            ดูโปรไฟล์
          </button>
        </div>
      </div>

      {/* Bottom Section: Details & Requirements (Left) + Location Map (Right) matching WorkDetail.png */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        {/* Left Bottom Card: Description & Requirements (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">
                รายละเอียดงาน
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Requirements & Openings */}
            <div className="pt-4 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
                <span className="text-xs text-zinc-400 font-medium block">จำนวนที่รับ</span>
                <span className="text-sm font-bold text-zinc-800 mt-0.5 block">{job.qualifications.openings} คน</span>
              </div>
              <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
                <span className="text-xs text-zinc-400 font-medium block">เพศ</span>
                <span className="text-sm font-bold text-zinc-800 mt-0.5 block">{job.qualifications.gender}</span>
              </div>
              <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
                <span className="text-xs text-zinc-400 font-medium block">อายุ</span>
                <span className="text-sm font-bold text-zinc-800 mt-0.5 block">{job.qualifications.age}</span>
              </div>
            </div>

            {/* Contacts matching WorkDetail.png */}
            <div className="pt-4 border-t border-zinc-100">
              <h3 className="text-base font-bold text-zinc-900 mb-3">
                ช่องทางการติดต่อ
              </h3>
              <div className="space-y-2 text-sm text-zinc-700">
                <div className="flex items-center gap-2">
                  <span className="w-24 text-zinc-500 font-medium">LINE ID :</span>
                  <span className="font-semibold text-zinc-900">{job.contact.lineId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-zinc-500 font-medium">Facebook :</span>
                  <span className="font-semibold text-zinc-900">{job.contact.facebook}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-zinc-500 font-medium">เบอร์โทร :</span>
                  <span className="font-semibold text-zinc-900">{job.contact.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Application Button */}
          <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-zinc-500">
              {job.status === 'open' ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> เปิดรับสมัครปกติ
                </span>
              ) : (
                <span className="text-zinc-400">ปิดรับสมัครตำแหน่งนี้แล้ว</span>
              )}
            </div>

            <button
              onClick={() => onOpenApplyModal(job)}
              disabled={job.status !== 'open' || isApplied}
              className={`w-full sm:w-60 py-3.5 px-6 rounded-2xl text-base font-bold transition-all shadow-sm cursor-pointer ${
                isApplied
                  ? 'bg-emerald-600 text-white cursor-default'
                  : job.status === 'open'
                  ? 'bg-zinc-900 hover:bg-zinc-800 text-white hover:shadow-md active:scale-95'
                  : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
              }`}
            >
              {isApplied ? 'ยื่นสมัครแล้ว (รอพิจารณา)' : job.status === 'open' ? 'สมัครงาน' : 'ปิดรับสมัคร'}
            </button>
          </div>
        </div>

        {/* Right Bottom Card: Map & Coordinates (4 Cols) matching WorkDetail.png */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-900 mb-3">
              ตำแหน่งที่ตั้ง
            </h2>

            {/* Map Visual Container */}
            <div className="relative w-full h-52 bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2 animate-bounce">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-zinc-800">
                {job.location}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                ห่างจากจุดศูนย์กลาง ม.พะเยา {formatDistance(job.distance)}
              </p>
            </div>
          </div>

          {/* Button: ดูแผนที่ Google Map */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.mapQuery || job.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 w-full py-3 rounded-xl border border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50 text-zinc-800 text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <ExternalLink className="w-4 h-4" />
            <span>ดูแผนที่ Google Map</span>
          </a>
        </div>
      </div>

      {/* Employer Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl text-center animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-zinc-100 border-2 border-zinc-200 flex items-center justify-center mx-auto mb-3">
              <User className="w-10 h-10 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">{job.employer.name}</h3>
            <p className="text-xs text-zinc-500">ผู้ประกอบการรอบมหาวิทยาลัยพะเยา</p>
            <div className="my-4 py-3 bg-zinc-50 rounded-2xl flex items-center justify-around text-xs">
              <div>
                <span className="block text-zinc-400">สถานะ</span>
                <span className="font-semibold text-emerald-600">ยืนยันตัวตนแล้ว</span>
              </div>
              <div>
                <span className="block text-zinc-400">คะแนน</span>
                <span className="font-semibold text-amber-600">★ {job.employer.rating}</span>
              </div>
              <div>
                <span className="block text-zinc-400">รีวิว</span>
                <span className="font-semibold text-zinc-800">{job.employer.reviewsCount} รีวิว</span>
              </div>
            </div>
            <button
              onClick={() => setShowProfileModal(false)}
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-semibold cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
