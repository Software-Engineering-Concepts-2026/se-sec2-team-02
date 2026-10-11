'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Share2, Star, User, MapPin, Clock, Calendar, CheckCircle2, Edit3 } from 'lucide-react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseFirestore } from '@/lib/firebase';
import { Job } from '@/types/job';
import LocationMapViewer from '@/components/LocationMapViewer';

interface WorkDetailViewProps {
  job: Job;
  isApplied: boolean;
  onOpenApplyModal: (job: Job) => void;
  onShare: (job: Job) => void;
  isOwner?: boolean;
}

export default function WorkDetailView({
  job,
  isApplied,
  onOpenApplyModal,
  onShare,
  isOwner: propIsOwner
}: WorkDetailViewProps) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [realRating, setRealRating] = useState<{ average: number; count: number } | null>(null);
  const [posterProfile, setPosterProfile] = useState<{ name: string; avatar: string } | null>(null);

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase Auth warning in WorkDetailView:', err);
    }
  }, []);

  // Fetch real Job Poster Profile & Rating_score from Firestore (No Mockup Data)
  useEffect(() => {
    let isMounted = true;
    const fetchEmployerRating = async () => {
      if (!job.userId) {
        setRealRating({ average: 0, count: 0 });
        return;
      }
      try {
        const db = getFirebaseFirestore();

        // Fetch actual user profile of the job poster
        try {
          const userSnap = await getDoc(doc(db, 'USER', job.userId));
          if (userSnap.exists() && isMounted) {
            const uData = userSnap.data();
            setPosterProfile({
              name: (uData.User_name as string) || (uData.name as string) || job.employer.name || 'ผู้โพสต์ประกาศงาน',
              avatar: (uData.user_picture_url as string) || (uData.photoURL as string) || '',
            });
          }
        } catch {
          // ignore profile fetch fallback
        }

        const ratingsCol = collection(db, 'USER', job.userId, 'Rating_score');
        const snap = await getDocs(ratingsCol);
        if (!isMounted) return;
        if (!snap.empty) {
          const scores = snap.docs.map((d) => Number(d.data().score) || 0);
          const sum = scores.reduce((a, b) => a + b, 0);
          const avg = Number((sum / scores.length).toFixed(1));
          setRealRating({ average: avg, count: scores.length });
        } else {
          setRealRating({ average: 0, count: 0 });
        }
      } catch (err) {
        console.warn('Could not load employer ratings in WorkDetailView:', err);
        if (isMounted) setRealRating({ average: 0, count: 0 });
      }
    };

    fetchEmployerRating();
    return () => {
      isMounted = false;
    };
  }, [job.userId, job.employer.name]);

  const isOwner = Boolean(
    propIsOwner || (currentUser && job.userId && currentUser.uid === job.userId)
  );

  // State for active preview image
  const [activeImage, setActiveImage] = useState<string>(job.mainImage || (job.images && job.images[0]) || '/images/coffee_barista.jpg');

  const imagesList = job.images && job.images.length > 0 ? job.images : [job.mainImage];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300">
      {/* Top Grid: Images + Overview Info + Employer Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Gallery Section (5 Cols on LG) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Main Large Image with Share icon */}
          <div className="relative w-full h-72 sm:h-80 bg-zinc-100 rounded-3xl overflow-hidden border border-zinc-200/80 shadow-xs">
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

            {/* Share button on top right of image */}
            <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
              <button
                onClick={() => onShare(job)}
                className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-zinc-700 hover:text-blue-600 shadow-sm transition-all cursor-pointer active:scale-95 border border-white/60"
                aria-label="แชร์ลิงก์งาน"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Category badge pill */}
            <span className="absolute bottom-3.5 left-3.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-zinc-800 shadow-2xs border border-white/60">
              {job.categoryLabel}
            </span>
          </div>

          {/* Thumbnails below main image */}
          {imagesList.length > 1 && (
            <div className="grid grid-cols-3 gap-2.5">
              {imagesList.slice(0, 3).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shadow-2xs ${
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
          )}
        </div>

        {/* Center: Job Meta Details (4 Cols on LG) */}
        <div className="lg:col-span-4 flex flex-col justify-start">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight leading-tight">
            {job.title}
          </h1>

          {/* Salary Highlight Box */}
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100/80 shadow-2xs">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
              อัตราค่าตอบแทน
            </span>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-0.5">
              {job.salary} <span className="text-sm font-semibold text-zinc-600">บาท/{job.salaryUnit}</span>
            </div>
          </div>

          {/* Overview List */}
          <div className="mt-5 space-y-3 text-sm text-zinc-700 bg-white/95 backdrop-blur-md p-5 rounded-3xl border border-zinc-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 font-medium">หมวดหมู่</span>
              <span className="font-bold text-zinc-900">{job.categoryLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 font-medium flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-zinc-400" /> วันที่เริ่ม
              </span>
              <span className="font-semibold text-zinc-800">{job.date || 'ทันที'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 font-medium flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-zinc-400" /> เวลาทำงาน
              </span>
              <span className="font-semibold text-zinc-800">{job.time || 'ตามตกลง'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 font-medium flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-zinc-400" /> สถานที่
              </span>
              <span className="font-semibold text-zinc-800 text-right truncate max-w-[160px]">{job.location}</span>
            </div>
          </div>
        </div>

        {/* Right: Job Poster Profile Card (3 Cols on LG) */}
        <div className="lg:col-span-3 bg-white/95 backdrop-blur-md rounded-3xl border border-zinc-200/80 p-6 shadow-xs flex flex-col items-center text-center">
          <div className="flex items-center justify-between w-full mb-3">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              ผู้โพสต์ประกาศงาน
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              ผู้ว่าจ้าง
            </span>
          </div>

          <div className="w-20 h-20 rounded-full bg-zinc-100 border-2 border-zinc-200 flex items-center justify-center text-zinc-600 my-1 overflow-hidden relative shadow-2xs">
            {posterProfile?.avatar ? (
              <Image
                src={posterProfile.avatar}
                alt={posterProfile.name || job.employer.name}
                width={80}
                height={80}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10" />
            )}
          </div>

          <h3 className="text-base sm:text-lg font-black text-zinc-900 mt-2 truncate max-w-full">
            {posterProfile?.name || job.employer.name}
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            สมาชิกตั้งแต่ {job.employer.memberSince}
          </p>

          {/* Rating Score Badge: Real Firestore data of the job poster */}
          {realRating && realRating.count > 0 ? (
            <div className="flex items-center justify-center gap-1.5 mt-2.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 text-amber-600 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{realRating.average.toFixed(1)}</span>
              <span className="text-zinc-400 font-normal">({realRating.count} รีวิวผู้โพสต์)</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5 mt-2.5 bg-zinc-50 px-3 py-1 rounded-full border border-zinc-200 text-zinc-500 text-xs font-medium">
              <Star className="w-3.5 h-3.5 text-zinc-300" />
              <span>ยังไม่มีรีวิวผู้โพสต์</span>
            </div>
          )}

          {isOwner && (
            <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              โพสต์ของคุณ
            </span>
          )}

          {isOwner ? (
            <Link
              href={`/edit/${job.id}`}
              className="w-full mt-4 py-2.5 px-4 rounded-2xl border border-zinc-900 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-white" />
              <span>แก้ไขโพสต์งานนี้</span>
            </Link>
          ) : (
            <Link
              href={`/review?userId=${job.userId || ''}&jobId=${job.id}`}
              className="w-full mt-4 py-2.5 px-4 rounded-2xl border border-amber-300 hover:border-amber-500 bg-amber-50/60 hover:bg-amber-100/70 text-amber-900 text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5 active:scale-95"
              title="ให้คะแนนและรีวิวผู้โพสต์ประกาศงาน (ไม่ใช่รีวิวร้าน)"
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>★ รีวิวผู้โพสต์งาน</span>
            </Link>
          )}
        </div>
      </div>

      {/* Bottom Section: Details & Requirements (Left) + Location Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Bottom Card: Description & Requirements (8 Cols) */}
        <div className="lg:col-span-8 bg-white/95 backdrop-blur-md rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h2 className="text-lg font-black text-zinc-900 mb-2.5 tracking-tight">
                รายละเอียดหน้าที่ความรับผิดชอบ
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Requirements & Openings */}
            <div className="pt-5 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-zinc-50/90 p-4 rounded-2xl border border-zinc-100">
                <span className="text-xs text-zinc-400 font-medium block">จำนวนที่เปิดรับ</span>
                <span className="text-base font-black text-zinc-900 mt-0.5 block">{job.qualifications.openings} คน</span>
              </div>
              <div className="bg-zinc-50/90 p-4 rounded-2xl border border-zinc-100">
                <span className="text-xs text-zinc-400 font-medium block">เพศที่รับ</span>
                <span className="text-base font-black text-zinc-900 mt-0.5 block">{job.qualifications.gender}</span>
              </div>
              <div className="bg-zinc-50/90 p-4 rounded-2xl border border-zinc-100">
                <span className="text-xs text-zinc-400 font-medium block">อายุที่รับ</span>
                <span className="text-base font-black text-zinc-900 mt-0.5 block">{job.qualifications.age}</span>
              </div>
            </div>

            {/* Contacts */}
            <div className="pt-5 border-t border-zinc-100">
              <h3 className="text-base font-black text-zinc-900 mb-3 tracking-tight">
                ช่องทางการติดต่อ
              </h3>
              <div className="space-y-2 text-sm text-zinc-700">
                <div className="flex items-center gap-2">
                  <span className="w-24 text-zinc-400 font-medium">Facebook :</span>
                  <span className="font-bold text-zinc-900">{job.contact.facebook || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-zinc-400 font-medium">เบอร์โทรศัพท์ :</span>
                  <span className="font-bold text-zinc-900">{job.contact.phone || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Application or Edit Button */}
          <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-zinc-500">
              {isOwner ? (
                <span className="inline-flex items-center gap-1.5 text-blue-600 font-bold bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
                  <User className="w-3.5 h-3.5" /> คุณเป็นผู้ประกาศงานนี้
                </span>
              ) : job.status === 'open' ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4" /> เปิดรับสมัครปกติ
                </span>
              ) : (
                <span className="text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full">ปิดรับสมัครตำแหน่งนี้แล้ว</span>
              )}
            </div>

            {isOwner ? (
              <Link
                href={`/edit/${job.id}`}
                className="w-full sm:w-60 py-3 px-6 rounded-2xl text-sm sm:text-base font-bold transition-all shadow-sm cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-white hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>แก้ไขโพสต์งาน</span>
              </Link>
            ) : (
              <button
                onClick={() => onOpenApplyModal(job)}
                disabled={job.status !== 'open' || isApplied}
                className={`w-full sm:w-60 py-3 px-6 rounded-2xl text-sm sm:text-base font-bold transition-all shadow-sm cursor-pointer ${
                  isApplied
                    ? 'bg-emerald-600 text-white cursor-default'
                    : job.status === 'open'
                    ? 'bg-zinc-900 hover:bg-zinc-800 text-white hover:shadow-md active:scale-95'
                    : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                }`}
              >
                {isApplied ? 'ยื่นสมัครแล้ว (รอพิจารณา)' : job.status === 'open' ? 'ยื่นใบสมัคร' : 'ปิดรับสมัคร'}
              </button>
            )}
          </div>
        </div>

        {/* Right Bottom Card: Map & Coordinates (4 Cols) */}
        <div className="lg:col-span-4 bg-white/95 backdrop-blur-md rounded-3xl border border-zinc-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-black text-zinc-900 mb-3 tracking-tight">
              ตำแหน่งสถานที่ทำงาน
            </h2>

            <LocationMapViewer
              coordinates={job.coordinates}
              locationName={job.location}
              mapQuery={job.mapQuery}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
