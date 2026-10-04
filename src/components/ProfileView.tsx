'use client';

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, updateProfile, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import {
  User,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  Briefcase,
  Layers,
  ArrowLeft,
  LogOut,
  Pencil,
  Phone,
  Mail,
  MessageCircle,
  PlusCircle,
  Save,
  X
} from 'lucide-react';
import type { CompletedWork, MyPostedJob, OngoingJob } from '@/data/mockProfile';
import { getFirebaseAuth, getFirebaseFirestore } from '@/lib/firebase';

interface ProfileDetails {
  name: string;
  studentId: string;
  faculty: string;
  major: string;
  campus: string;
  phone: string;
  lineId: string;
  bio: string;
}

const emptyProfile: ProfileDetails = {
  name: '',
  studentId: '',
  faculty: '',
  major: '',
  campus: '',
  phone: '',
  lineId: '',
  bio: ''
};

interface ProfileViewProps {
  onBackToHome: () => void;
  onOpenCreateJob: () => void;
}

export default function ProfileView({
  onBackToHome,
  onOpenCreateJob
}: ProfileViewProps) {
  const router = useRouter();
  // Tab state for the 3 works sections:
  // 1 = โพสต์ที่เราเป็นคนโพสต์เอง
  // 2 = ผลงานของงานที่เคยทำเสร็จไป
  // 3 = งานที่กำลังทำอยู่
  const [activeTab, setActiveTab] = useState<'my-posts' | 'completed' | 'ongoing'>('my-posts');
  const [account, setAccount] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<ProfileDetails>(emptyProfile);
  const [draftProfile, setDraftProfile] = useState<ProfileDetails>(emptyProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [myPosts, setMyPosts] = useState<MyPostedJob[]>([]);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');
  const completedWorks: CompletedWork[] = [];
  const ongoingJobs: OngoingJob[] = [];

  useEffect(() => {
    let isMounted = true;
    let unsubscribe = () => {};

    try {
      unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (user) => {
        if (!isMounted) return;
        setAccount(user);

        if (!user) {
          setProfile(emptyProfile);
          return;
        }

        try {
          const snapshot = await getDoc(doc(getFirebaseFirestore(), 'users', user.uid));
          if (!isMounted) return;
          const data = snapshot.data();
          setProfile({
            name: typeof data?.name === 'string' ? data.name : user.displayName ?? '',
            studentId: typeof data?.studentId === 'string' ? data.studentId : '',
            faculty: typeof data?.faculty === 'string' ? data.faculty : '',
            major: typeof data?.major === 'string' ? data.major : '',
            campus: typeof data?.campus === 'string' ? data.campus : '',
            phone: typeof data?.phone === 'string' ? data.phone : '',
            lineId: typeof data?.lineId === 'string' ? data.lineId : '',
            bio: typeof data?.bio === 'string' ? data.bio : ''
          });
        } catch {
          if (isMounted) {
            setProfile({ ...emptyProfile, name: user.displayName ?? '' });
            setProfileMessage('โหลดข้อมูลโปรไฟล์ไม่ได้ กรุณาตรวจสอบการตั้งค่า Firestore');
          }
        }
      });
    } catch {
      return () => {
        isMounted = false;
      };
    }

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleTogglePostStatus = (postId: string) => {
    setMyPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: p.status === 'open' ? 'closed' : 'open' } : p))
    );
  };

  async function handleSignOut() {
    setIsSigningOut(true);
    setSignOutError('');
    try {
      await signOut(getFirebaseAuth());
      router.replace('/auth');
    } catch {
      setSignOutError('ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง');
      setIsSigningOut(false);
    }
  }

  async function handleSaveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!account) return;

    const nextProfile = {
      ...draftProfile,
      name: draftProfile.name.trim()
    };

    setIsSavingProfile(true);
    setProfileMessage('');
    try {
      await setDoc(
        doc(getFirebaseFirestore(), 'users', account.uid),
        { ...nextProfile, updatedAt: serverTimestamp() },
        { merge: true }
      );
      if (account.displayName !== nextProfile.name) {
        await updateProfile(account, { displayName: nextProfile.name });
      }
      setProfile(nextProfile);
      setIsEditingProfile(false);
      setProfileMessage('บันทึกข้อมูลโปรไฟล์แล้ว');
    } catch {
      setProfileMessage('บันทึกไม่ได้ กรุณาตรวจสอบว่าเปิด Firestore และตั้งค่า Security Rules แล้ว');
    } finally {
      setIsSavingProfile(false);
    }
  }

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

        <div className="flex items-center gap-2">
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 text-xs sm:text-sm font-semibold transition-colors disabled:opacity-60 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{isSigningOut ? 'กำลังออกจากระบบ...' : 'ออกจากระบบ / สลับบัญชี'}</span>
          </button>
          <button
            onClick={onOpenCreateJob}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>โพสต์งานใหม่</span>
          </button>
        </div>
      </div>

      {signOutError && (
        <p className="mb-4 text-right text-sm text-red-700" role="alert">{signOutError}</p>
      )}

      {/* =========================================================================
          SECTION 1: ข้อมูลส่วนตัว (Personal Information Section)
      ========================================================================= */}
      <section className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs mb-8">
        <div className="mb-5 flex justify-end">
          <button
            type="button"
            disabled={!account || isEditingProfile}
            onClick={() => {
              setDraftProfile(profile);
              setProfileMessage('');
              setIsEditingProfile(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          >
            <Pencil className="h-4 w-4" />
            <span>แก้ไขข้อมูล</span>
          </button>
        </div>
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
                  {profile.name || account?.displayName || 'สมาชิกใหม่'}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-blue-600 mt-0.5">
                  รหัสนิสิต: {profile.studentId || 'ยังไม่ได้ระบุ'} • {profile.major || 'ยังไม่ได้ระบุสาขา'}
                </p>
              </div>

              {/* Rating Badge */}
              <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-bold self-center md:self-auto">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>ยังไม่มีรีวิว</span>
              </div>
            </div>

            {/* Faculty & Campus */}
            <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5 text-xs text-zinc-600">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                {profile.faculty || 'ยังไม่ได้ระบุคณะ'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                {profile.campus || 'ยังไม่ได้ระบุวิทยาเขต'}
              </span>
            </div>

            {/* Bio */}
            <p className="mt-3 text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-2xl">
              {profile.bio || 'ยังไม่ได้เพิ่มข้อมูลแนะนำตัว'}
            </p>

            {/* Contact Chips */}
            <div className="mt-4 pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 rounded-xl border border-zinc-200 text-zinc-700">
                <Phone className="w-3.5 h-3.5 text-zinc-500" />
                <span>{profile.phone || 'ยังไม่ได้ระบุเบอร์โทร'}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 rounded-xl border border-zinc-200 text-zinc-700">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>LINE: {profile.lineId || 'ยังไม่ได้ระบุ'}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 rounded-xl border border-zinc-200 text-zinc-700">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span className="break-all">{account?.email || 'ยังไม่ได้ระบุอีเมล'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-8 pt-6 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
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
            <span className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5 block">0 บาท</span>
          </div>
        </div>

        {profileMessage && (
          <p className="mt-4 text-sm text-zinc-600" aria-live="polite">{profileMessage}</p>
        )}

        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="mt-6 grid min-w-0 grid-cols-1 gap-4 border-t border-zinc-100 pt-6 sm:grid-cols-2">
            {([
              ['name', 'ชื่อ-นามสกุล'],
              ['studentId', 'รหัสนิสิต'],
              ['faculty', 'คณะ'],
              ['major', 'สาขา / ชั้นปี'],
              ['campus', 'วิทยาเขต / ที่พัก'],
              ['phone', 'เบอร์โทรศัพท์'],
              ['lineId', 'LINE ID']
            ] as const).map(([field, label]) => (
              <label key={field} className="block min-w-0 text-sm font-medium text-zinc-700">
                <span>{label}</span>
                <input
                  value={draftProfile[field]}
                  onChange={(event) => setDraftProfile((current) => ({ ...current, [field]: event.target.value }))}
                  className="mt-1 w-full min-w-0 rounded-xl border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-700"
                  maxLength={120}
                  required={field === 'name'}
                />
              </label>
            ))}
            <label className="block min-w-0 text-sm font-medium text-zinc-700 sm:col-span-2">
              <span>แนะนำตัว</span>
              <textarea
                value={draftProfile.bio}
                onChange={(event) => setDraftProfile((current) => ({ ...current, bio: event.target.value }))}
                className="mt-1 min-h-24 w-full min-w-0 resize-y rounded-xl border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-700"
                maxLength={500}
              />
            </label>
            <p className="text-xs text-zinc-500 sm:col-span-2">
              อีเมลบัญชี: {account?.email || 'ไม่พบอีเมล'} (เปลี่ยนได้จากการตั้งค่าบัญชี Firebase เท่านั้น)
            </p>
            <div className="flex flex-wrap justify-end gap-2 sm:col-span-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                disabled={isSavingProfile}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
              >
                <X className="h-4 w-4" /> ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSavingProfile}
                className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSavingProfile ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
              </button>
            </div>
          </form>
        )}
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
          <div className="flex w-full min-w-0 max-w-full items-center gap-1.5 overflow-x-auto rounded-2xl bg-zinc-100 p-1 self-stretch sm:w-auto sm:self-auto">
            <button
              onClick={() => setActiveTab('my-posts')}
              className={`shrink-0 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer sm:px-4 sm:text-sm ${
                activeTab === 'my-posts'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              ประกาศ ({myPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`shrink-0 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer sm:px-4 sm:text-sm ${
                activeTab === 'completed'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              ผลงาน ({completedWorks.length})
            </button>
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`shrink-0 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer sm:px-4 sm:text-sm ${
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

            {myPosts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 px-5 py-10 text-center">
                <p className="text-sm font-semibold text-zinc-700">ยังไม่มีประกาศงาน</p>
                <button
                  onClick={onOpenCreateJob}
                  className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  สร้างประกาศแรก
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-zinc-50 rounded-2xl border border-zinc-200/80 p-5 flex flex-col justify-between hover:shadow-xs transition-shadow"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-200/70 text-zinc-700">
                        {post.category}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          post.status === 'open'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-zinc-200 text-zinc-600'
                        }`}
                      >
                        {post.status === 'open' ? 'เปิดรับสมัคร' : 'ปิดรับสมัครแล้ว'}
                      </span>
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

                  <div className="mt-5 pt-3 border-t border-zinc-200/60 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-zinc-400">{post.date}</span>
                    <button
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
              ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ผลงานของงานที่เคยทำเสร็จไป (Completed Portfolio) */}
        {activeTab === 'completed' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <p className="text-xs sm:text-sm text-zinc-500 mb-2">
              ประวัติผลงานที่นิสิตได้รับจ้างและปฏิบัติหน้าที่จนเสร็จสิ้นเรียบร้อยแล้ว ได้รับการยืนยันจากผู้ว่าจ้าง
            </p>

            {completedWorks.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-zinc-300 px-5 py-10 text-center text-sm text-zinc-500">
                ยังไม่มีผลงานที่ทำสำเร็จ
              </p>
            ) : <div className="space-y-4">
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
            </div>}
          </div>
        )}

        {/* TAB 3: งานที่กำลังทำอยู่ (Ongoing / Active Jobs) */}
        {activeTab === 'ongoing' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <p className="text-xs sm:text-sm text-zinc-500 mb-2">
              งานที่คุณได้รับการคัดเลือกและกำลังปฏิบัติหน้าที่อยู่ในช่วงนี้
            </p>

            {ongoingJobs.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-zinc-300 px-5 py-10 text-center text-sm text-zinc-500">
                ยังไม่มีงานที่กำลังดำเนินการ
              </p>
            ) : <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            </div>}
          </div>
        )}
      </section>
    </div>
  );
}
