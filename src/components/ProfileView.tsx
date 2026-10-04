'use client';

import React, { useEffect, useState } from 'react';
import {
  User,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  Briefcase,
  Layers,
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  PlusCircle,
  Pencil,
  Save,
  X
} from 'lucide-react';
import {
  mockUserProfile,
  initialMyPosts,
  mockCompletedWorks,
  mockOngoingJobs
} from '@/data/mockProfile';

interface ProfileViewProps {
  onBackToHome: () => void;
  onOpenCreateJob: () => void;
  onOpenEditJob: (postId: string) => void;
}

export default function ProfileView({
  onBackToHome,
  onOpenCreateJob,
  onOpenEditJob
}: ProfileViewProps) {
  // Tab state for the 3 works sections:
  // 1 = โพสต์ที่เราเป็นคนโพสต์เอง
  // 2 = ผลงานของงานที่เคยทำเสร็จไป
  // 3 = งานที่กำลังทำอยู่
  const [activeTab, setActiveTab] = useState<'my-posts' | 'completed' | 'ongoing'>('my-posts');

  // Profile data from centralized mock data source
  const [userProfile, setUserProfile] = useState(mockUserProfile);
  const [draftProfile, setDraftProfile] = useState(mockUserProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [myPosts, setMyPosts] = useState(initialMyPosts);
  const completedWorks = mockCompletedWorks;
  const ongoingJobs = mockOngoingJobs;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedOverrides = JSON.parse(localStorage.getItem('profile-post-overrides') || '{}') as Record<string, typeof initialMyPosts[number]>;
        setMyPosts((posts) => posts.map((post) => savedOverrides[post.id] || post));
      } catch {
        // Keep the mock posts when local storage is unavailable.
      }
    });

    return () => window.clearTimeout(timer);
  }, []);

  const handleTogglePostStatus = (postId: string) => {
    setMyPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: p.status === 'open' ? 'closed' : 'open' } : p))
    );
  };

  const handleEditProfile = () => {
    setDraftProfile(userProfile);
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setDraftProfile(userProfile);
    setIsEditingProfile(false);
  };

  const handleSaveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUserProfile(draftProfile);
    setIsEditingProfile(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้าหลัก</span>
        </button>

        <button
          type="button"
          onClick={handleEditProfile}
          className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 text-xs sm:text-sm font-semibold shadow-xs cursor-pointer transition-colors mr-2"
        >
          <Pencil className="w-4 h-4" />
          <span>แก้ไขข้อมูล</span>
        </button>
        <button
          onClick={onOpenCreateJob}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>โพสต์งานใหม่</span>
        </button>
      </div>

      {/* =========================================================================
          SECTION 1: ข้อมูลส่วนตัว (Personal Information Section)
      ========================================================================= */}
      <section className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8">
          {/* Avatar with Verified Badge */}
          <div className="relative shrink-0 mx-auto md:mx-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-300 border-4 border-white shadow-md flex items-center justify-center text-zinc-600 overflow-hidden">
              <User className="w-14 h-14 text-zinc-500" />
            </div>
            <span
              title="นิสิต ม.พะเยา ยืนยันตัวตนแล้ว"
              className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>

          {/* Core Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                  {userProfile.name}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-blue-600 mt-0.5">
                  รหัสนิสิต: {userProfile.studentId} • {userProfile.major}
                </p>
              </div>

              {/* Rating Badge */}
              <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-bold self-center md:self-auto">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{userProfile.rating}</span>
                <span className="text-zinc-400 font-normal">({userProfile.reviewCount} รีวิวการทำงาน)</span>
              </div>
            </div>

            {/* Faculty & Campus */}
            <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5 text-xs text-zinc-600">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                {userProfile.faculty}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                {userProfile.campus}
              </span>
            </div>

            {/* Bio */}
            <p className="mt-3 text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-2xl">
              {userProfile.bio}
            </p>

            {/* Contact Chips */}
            <div className="mt-4 pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 rounded-xl border border-zinc-200 text-zinc-700">
                <Phone className="w-3.5 h-3.5 text-zinc-500" />
                <span>{userProfile.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 rounded-xl border border-zinc-200 text-zinc-700">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>LINE: {userProfile.lineId}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 rounded-xl border border-zinc-200 text-zinc-700">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span>{userProfile.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-8 pt-6 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {isEditingProfile && (
            <form onSubmit={handleSaveProfile} className="col-span-2 sm:col-span-4 mb-3 text-left space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-zinc-900">แก้ไขข้อมูลส่วนตัว</h2>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-900 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  ยกเลิก
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="text-xs font-semibold text-zinc-600">
                  ชื่อ-นามสกุล
                  <input
                    value={draftProfile.name}
                    onChange={(event) => setDraftProfile((profile) => ({ ...profile, name: event.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm font-normal text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="text-xs font-semibold text-zinc-600">
                  เบอร์โทรศัพท์
                  <input
                    value={draftProfile.phone}
                    onChange={(event) => setDraftProfile((profile) => ({ ...profile, phone: event.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm font-normal text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="text-xs font-semibold text-zinc-600">
                  LINE ID
                  <input
                    value={draftProfile.lineId}
                    onChange={(event) => setDraftProfile((profile) => ({ ...profile, lineId: event.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm font-normal text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="text-xs font-semibold text-zinc-600">
                  อีเมล
                  <input
                    type="email"
                    value={draftProfile.email}
                    onChange={(event) => setDraftProfile((profile) => ({ ...profile, email: event.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm font-normal text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="text-xs font-semibold text-zinc-600 sm:col-span-2">
                  แนะนำตัว
                  <textarea
                    rows={3}
                    value={draftProfile.bio}
                    onChange={(event) => setDraftProfile((profile) => ({ ...profile, bio: event.target.value }))}
                    className="mt-1.5 w-full resize-y rounded-xl border border-zinc-300 px-3 py-2.5 text-sm font-normal text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  <Save className="w-4 h-4" />
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          )}
          <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-100">
            <span className="text-xs text-zinc-500 block">งานที่ทำสำเร็จ</span>
            <span className="text-xl sm:text-2xl font-black text-zinc-900 mt-0.5 block">{completedWorks.length} งาน</span>
          </div>
          <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-100">
            <span className="text-xs text-zinc-500 block">งานที่กำลังทำ</span>
            <span className="text-xl sm:text-2xl font-black text-blue-600 mt-0.5 block">{ongoingJobs.length} งาน</span>
          </div>
          <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-100">
            <span className="text-xs text-zinc-500 block">ประกาศของฉัน</span>
            <span className="text-xl sm:text-2xl font-black text-zinc-900 mt-0.5 block">{myPosts.length} ประกาศ</span>
          </div>
          <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-100">
            <span className="text-xs text-zinc-500 block">รายได้สะสมรวม</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5 block">7,800 บาท</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: หน้าผลงานต่อจากข้อมูลส่วนตัว (Portfolio / Works Section)
          มี 3 ส่วน: 1) โพสต์ที่เราเป็นคนโพสต์เอง, 2) ผลงานที่ทำเสร็จไป, 3) งานที่กำลังทำอยู่
      ========================================================================= */}
      <section className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4 text-zinc-700" />
              <span>ผลงานและประวัติงาน</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900">
              บันทึกกิจกรรมและผลงานของฉัน
            </h2>
          </div>

          {/* 3 Navigation Tabs matching user's exact specification */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-2xl self-start sm:self-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('my-posts')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'my-posts'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              ประกาศ ({myPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'completed'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              ผลงาน ({completedWorks.length})
            </button>
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'ongoing'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              งานที่ตอบรับ ({ongoingJobs.length})
            </button>
          </div>
        </div>

        {/* TAB 1: โพสต์ที่เราเป็นคนโพสต์เอง */}
        {activeTab === 'my-posts' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm text-zinc-500">
                รายการประกาศงานที่คุณลงรับสมัครคนช่วยงานในระบบ Job Wanted UP
              </p>
              <button
                onClick={onOpenCreateJob}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                + สร้างประกาศเพิ่ม
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative bg-zinc-50 rounded-2xl border border-zinc-200/80 p-5 flex flex-col justify-between hover:shadow-xs transition-shadow"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-200/70 text-zinc-700">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          post.status === 'open'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-zinc-200 text-zinc-600'
                          }`}
                        >
                        {post.status === 'open' ? 'เปิดรับสมัคร' : 'ปิดรับสมัครแล้ว'}
                        </span>
                        <span className="text-xs text-zinc-400">ประกาศของฉัน</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-zinc-900 mt-2.5 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                      {post.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-zinc-200/60 space-y-1.5 text-xs text-zinc-600">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">ค่าตอบแทน:</span>
                        <span className="font-bold text-zinc-900">{post.wage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">สถานที่:</span>
                        <span className="font-medium text-zinc-800 truncate max-w-[200px]">{post.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">ผู้สมัครที่รอพิจารณา:</span>
                        <span className="font-bold text-blue-600">{post.applicantsCount} คน</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-zinc-200/60 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-zinc-400">{post.date}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenEditJob(post.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        แก้ไขประกาศ
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTogglePostStatus(post.id)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                          post.status === 'open'
                            ? 'bg-zinc-200 hover:bg-zinc-300 text-zinc-700'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                        }`}
                      >
                        {post.status === 'open' ? 'ปิดรับสมัคร' : 'เปิดรับอีกครั้ง'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ผลงานของงานที่เคยทำเสร็จไป (Completed Portfolio) */}
        {activeTab === 'completed' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <p className="text-xs sm:text-sm text-zinc-500 mb-2">
              ประวัติผลงานที่นิสิตได้รับจ้างและปฏิบัติหน้าที่จนเสร็จสิ้นเรียบร้อยแล้ว ได้รับการยืนยันจากผู้ว่าจ้าง
            </p>

            <div className="space-y-4">
              {completedWorks.map((work) => (
                <div
                  key={work.id}
                  className="bg-zinc-50 rounded-2xl border border-zinc-200/80 p-5 sm:p-6 flex flex-col md:flex-row gap-5 items-start justify-between hover:shadow-xs transition-shadow"
                >
                  {/* Left Work Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> ทำงานสำเร็จแล้ว
                      </span>
                      <span className="text-xs text-zinc-400">• {work.period}</span>
                    </div>

                    <h3 className="text-lg font-bold text-zinc-900 mt-2">
                      {work.title}
                    </h3>
                    <p className="text-xs font-medium text-zinc-600 mt-0.5">
                      สถานที่: {work.workplace} (ผู้ว่าจ้าง: {work.employer})
                    </p>

                    {/* Review quote box */}
                    <div className="mt-3 p-3.5 bg-white rounded-xl border border-zinc-200/70 text-xs text-zinc-700 italic">
                      <div className="flex items-center gap-1 text-amber-500 font-bold not-italic mb-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{work.rating} / 5.0</span>
                      </div>
                      &ldquo;{work.reviewText}&rdquo;
                    </div>

                    {/* Skills acquired */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {work.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded-lg bg-zinc-200/60 text-zinc-700 text-[11px] font-medium"
                        >
                          #{skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Earnings summary badge */}
                  <div className="md:text-right shrink-0 bg-white p-4 rounded-xl border border-zinc-200 w-full md:w-auto">
                    <span className="text-xs text-zinc-400 block">ค่าตอบแทนที่ได้รับ</span>
                    <span className="text-xl font-extrabold text-emerald-600 block mt-0.5">{work.earnings}</span>
                    <span className="text-[11px] text-zinc-400 block mt-1">ชำระเรียบร้อย</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: งานที่กำลังทำอยู่ (Ongoing / Active Jobs) */}
        {activeTab === 'ongoing' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <p className="text-xs sm:text-sm text-zinc-500 mb-2">
              งานที่คุณได้รับการคัดเลือกและกำลังปฏิบัติหน้าที่อยู่ในช่วงนี้
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {ongoingJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-zinc-50 rounded-2xl border border-zinc-200/80 p-5 sm:p-6 flex flex-col justify-between hover:shadow-xs transition-shadow relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />

                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                        <Clock className="w-3.5 h-3.5" /> กำลังปฏิบัติงาน
                      </span>
                      <span className="text-xs font-semibold text-zinc-500">{job.startedDate}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 mt-2.5">
                      {job.title}
                    </h3>
                    <p className="text-xs font-medium text-zinc-600 mt-0.5">
                      {job.workplace}
                    </p>

                    <p className="mt-3 text-xs text-zinc-600 leading-relaxed bg-white p-3 rounded-xl border border-zinc-200/70">
                      {job.taskDescription}
                    </p>

                    {/* Duty schedule */}
                    <div className="mt-3 p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900">
                      <span className="font-bold">กะทำงาน: </span>
                      <span>{job.currentShift}</span>
                    </div>
                  </div>

                  {/* Actions & Employer Quick Contact */}
                  <div className="mt-5 pt-3 border-t border-zinc-200/60 flex items-center justify-between gap-2">
                    <div className="text-xs text-zinc-500">
                      <span>ผู้ว่าจ้าง: {job.employer}</span>
                    </div>
                    <a
                      href={`tel:${job.contact}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>โทรติดต่อ</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
