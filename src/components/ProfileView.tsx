'use client';

import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  collection,
  getDocs,
  GeoPoint,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  Mail,
  Phone,
  Edit3,
  Save,
  X,
  LogOut,
  FileText,
  CheckCircle2,
  Clock3,
  BriefcaseBusiness,
  Trash2,
  ExternalLink,
  Star,
  StarHalf,
  ShieldCheck,
  Link as LinkIcon,
  Upload,
  Sparkles,
} from 'lucide-react';

import { getFirebaseAuth, getFirebaseFirestore } from '@/lib/firebase';
import { useJobs } from '@/context/JobContext';
import { ReviewItem } from '@/types/job';

const PRESET_AVATARS = [
  { label: 'นักศึกษาหญิง', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80' },
  { label: 'นักศึกษาชาย', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80' },
  { label: 'พนักงานบริการ', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80' },
  { label: 'บาริสต้า', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80' },
  { label: 'ฟรีแลนซ์', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80' },
  { label: 'ไรเดอร์', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80' },
];

/**
 * แปลงไฟล์รูปภาพ JPEG, PNG, WebP ให้เป็น Data URL พร้อมบีบอัดและปรับขนาดล่วงหน้า
 * เพื่อให้สามารถเก็บเป็นข้อความลิงก์ URL ใน Firebase ได้ทันทีและมีขนาดเบามาก (~20-40 KB)
 */
const convertFileToCompressedDataUrl = (
  file: File,
  maxWidth = 400,
  quality = 0.85
): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result;
      if (typeof src !== 'string') {
        resolve('');
        return;
      }
      if (typeof window === 'undefined') {
        resolve(src);
        return;
      }
      const img = new window.Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const size = Math.min(img.width, img.height);
          const startX = (img.width - size) / 2;
          const startY = (img.height - size) / 2;

          const targetSize = Math.min(size, maxWidth);
          canvas.width = targetSize;
          canvas.height = targetSize;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(src);
            return;
          }

          ctx.drawImage(img, startX, startY, size, size, 0, 0, targetSize, targetSize);
          const compressedDataUrl = canvas.toDataURL('image/webp', quality);
          resolve(compressedDataUrl);
        } catch {
          resolve(src);
        }
      };
      img.onerror = () => {
        resolve(src);
      };
      img.src = src;
    };
    reader.onerror = () => {
      resolve('');
    };
    reader.readAsDataURL(file);
  });
};

interface ProfileDetails {
  name: string;
  email: string;
  phone: string;
  lineId?: string;
  bio: string;
  photoURL: string;
}

interface ProfilePost {
  id?: string;
  title?: string;
  description?: string;
}

const emptyProfile: ProfileDetails = {
  name: '',
  email: '',
  phone: '',
  bio: '',
  photoURL: '',
};

type ProfileTab = 'profile' | 'my-posts' | 'pending-approval' | 'ongoing' | 'completed' | 'reviews';

export default function ProfileView() {
  const router = useRouter();
  const {
    jobs,
    appliedJobs,
    applications,
    deleteJob,
    approveApplication,
    rejectApplication,
    cancelApplication,
  } = useJobs();

  const [account, setAccount] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<ProfileDetails>(emptyProfile);
  const [draftProfile, setDraftProfile] =
    useState<ProfileDetails>(emptyProfile);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarInputMode, setAvatarInputMode] = useState<'url' | 'preset' | 'upload'>('url');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [userStats, setUserStats] = useState({
    doingWork: 0,
    finishedWork: 0,
    ownWork: 0,
    income: 0,
  });

  const [activeTab, setActiveTab] =
    useState<ProfileTab>('profile');
  const [pendingSubTab, setPendingSubTab] =
    useState<'all' | 'mine' | 'incoming'>('all');

  const [message, setMessage] = useState('');

  const [myPosts, setMyPosts] = useState<ProfilePost[]>([]);
  const [completedWorks] = useState<ProfilePost[]>([]);
  const [ongoingJobs] = useState<ProfilePost[]>([]);

  // Rating & Review state (ForNeed/Rating_score.png)
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [ratingStats, setRatingStats] = useState<{
    average: number;
    total: number;
    distribution: Record<number, number>;
  }>({
    average: 5.0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 },
  });

  // -----------------------------
  // โหลดข้อมูลผู้ใช้
  // -----------------------------
  useEffect(() => {
    const auth = getFirebaseAuth();
    const db = getFirebaseFirestore();

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) {
          setAccount(null);
          setLoading(false);
          router.replace('/auth');
          return;
        }

        try {
          setAccount(user);

          let firestoreData: Record<string, unknown> = {};
          try {
            const userSnap = await getDoc(doc(db, 'USER', user.uid));
            if (userSnap.exists()) {
              firestoreData = userSnap.data();
            } else {
              const fallbackSnap = await getDoc(doc(db, 'users', user.uid));
              if (fallbackSnap.exists()) {
                firestoreData = fallbackSnap.data();
              }
            }
          } catch (e) {
            console.warn('Error reading USER document:', e);
          }

          const loadedProfile: ProfileDetails = {
            name: (firestoreData.User_name as string) ?? (firestoreData.name as string) ?? user.displayName ?? '',
            email: (firestoreData.email as string) ?? user.email ?? '',
            phone: (firestoreData.tel as string) ?? (firestoreData.phone as string) ?? '',
            bio: (firestoreData.User_info as string) ?? (firestoreData.bio as string) ?? (firestoreData.address as string) ?? '',
            photoURL: (firestoreData.user_picture_url as string) ?? (firestoreData.photoURL as string) ?? user.photoURL ?? '',
          };

          setProfile(loadedProfile);
          setDraftProfile(loadedProfile);

          setUserStats({
            doingWork: Number(firestoreData.Doing_work ?? 0),
            finishedWork: Number(firestoreData.Finished_work ?? 0),
            ownWork: Number(firestoreData.Own_work ?? 0),
            income: Number(firestoreData.Income ?? 0),
          });

          // โหลดข้อมูลการรีวิว (Rating_score Subcollection per ForNeed/Rating_score.png)
          try {
            const ratingsCol = collection(db, 'USER', user.uid, 'Rating_score');
            const ratingsSnap = await getDocs(ratingsCol);
            const loadedRatings: ReviewItem[] = ratingsSnap.docs.map((docSnap) => {
              const rData = docSnap.data();
              return {
                id: docSnap.id,
                score: Number(rData.score ?? 5.0),
                comment: (rData.comment as string) || '',
                jobId: typeof rData.Job_id === 'object' && rData.Job_id !== null ? (rData.Job_id as { id?: string }).id : (rData.Job_id as string) || '',
                reviewerId: typeof rData.User_id === 'object' && rData.User_id !== null ? (rData.User_id as { id?: string }).id : (rData.User_id as string) || '',
                reviewerName: (rData.reviewer_name as string) || 'ผู้ประเมิน',
                createdAt: rData.created_up ? 'เร็วๆ นี้' : undefined,
              };
            });

            setReviews(loadedRatings);

            if (loadedRatings.length > 0) {
              const sum = loadedRatings.reduce((acc, curr) => acc + curr.score, 0);
              const avg = Number((sum / loadedRatings.length).toFixed(1));
              const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 };
              loadedRatings.forEach((r) => {
                const rounded = Math.floor(r.score);
                if (dist[rounded] !== undefined) dist[rounded]++;
              });
              setRatingStats({
                average: avg,
                total: loadedRatings.length,
                distribution: dist,
              });
            } else {
              setRatingStats({
                average: 0,
                total: 0,
                distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 },
              });
            }
          } catch (rErr) {
            console.warn('Error fetching Rating_score:', rErr);
          }

          if (Array.isArray(firestoreData.myPosts)) {
            setMyPosts(firestoreData.myPosts as ProfilePost[]);
          } else {
            setMyPosts([]);
          }
        } catch (error) {
          console.error(
            'Error loading profile:',
            error
          );

          const errorCode =
            typeof error === 'object' && error !== null && 'code' in error
              ? error.code
              : undefined;

          setMessage(
            errorCode === 'permission-denied'
              ? 'Firestore ปฏิเสธสิทธิ์ กรุณาเผยแพร่ firestore.rules ใน Firebase Console แล้วลองใหม่'
              : 'ไม่สามารถโหลดข้อมูลโปรไฟล์ได้'
          );
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [router]);

  // -----------------------------
  // เปิดโหมดแก้ไข
  // -----------------------------
  const handleEditProfile = () => {
    setDraftProfile({
      ...profile,
    });

    setMessage('');
    setAvatarPreview('');
    setAvatarInputMode('url');
    setEditing(true);
  };

  // -----------------------------
  // ยกเลิกแก้ไข
  // -----------------------------
  const handleCancelEdit = () => {
    setDraftProfile({
      ...profile,
    });

    setMessage('');
    setAvatarPreview('');
    setAvatarInputMode('url');
    setEditing(false);
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setMessage('เลือกรูปภาพ JPEG, PNG หรือ WebP เท่านั้น');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('รูปโปรไฟล์ต้องมีขนาดไม่เกิน 5 MB');
      event.target.value = '';
      return;
    }

    try {
      setMessage('กำลังประมวลผลและแปลงไฟล์รูปภาพเป็น URL...');
      const dataUrl = await convertFileToCompressedDataUrl(file);
      if (dataUrl) {
        setAvatarPreview(dataUrl);
        setDraftProfile((prev) => ({ ...prev, photoURL: dataUrl }));
        setMessage('แปลงไฟล์รูปภาพเป็น URL สำเร็จแล้ว พร้อมสำหรับบันทึก!');
      }
    } catch (err) {
      console.warn('Error converting file to Data URL:', err);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarPreview(reader.result);
          setDraftProfile((prev) => ({ ...prev, photoURL: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
      setMessage('แปลงไฟล์รูปภาพเป็น URL เรียบร้อย');
    }
  };

  // -----------------------------
  // บันทึกโปรไฟล์
  // -----------------------------
  const handleSaveProfile = async () => {
    if (!account) {
      setMessage('ไม่พบข้อมูลบัญชีผู้ใช้');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const db = getFirebaseFirestore();

      // ดึง URL รูปโปรไฟล์: ลำดับความสำคัญ avatarPreview (ถ้าแปลงไฟล์เสร็จแล้ว) -> draftProfile.photoURL -> profile.photoURL -> account.photoURL
      const finalPhotoURL = (avatarPreview || draftProfile.photoURL?.trim() || profile.photoURL || account.photoURL || '').trim();

      const nextProfile: ProfileDetails = {
        name: draftProfile.name?.trim() ?? '',
        email: account.email ?? '',
        phone: draftProfile.phone?.trim() ?? '',
        bio: draftProfile.bio?.trim() ?? '',
        photoURL: finalPhotoURL,
      };

      // -----------------------------
      // ตรวจสอบชื่อ
      // -----------------------------
      if (!nextProfile.name) {
        setMessage('กรุณากรอกชื่อ-นามสกุล');
        setSaving(false);
        return;
      }

      const savedProfile: ProfileDetails = {
        ...nextProfile,
        photoURL: finalPhotoURL,
      };

      const profilePayload = {
        ...savedProfile,
        User_name: savedProfile.name,
        tel: savedProfile.phone,
        User_info: savedProfile.bio,
        user_picture_url: finalPhotoURL,
        photoURL: finalPhotoURL,
        updatedAt: serverTimestamp(),
        updated_up: serverTimestamp(),
      };

      await Promise.allSettled([
        setDoc(doc(db, 'USER', account.uid), profilePayload, { merge: true }),
        setDoc(doc(db, 'USER', account.uid, 'User_location', 'default'), {
          location: new GeoPoint(19.0284, 99.8970),
          location_detail: savedProfile.bio || 'พะเยา',
          location_name: 'พะเยา',
        }, { merge: true }),
      ]);

      // อัปเดตใน Firebase Authentication (ทั้ง displayName และ photoURL เฉพาะกรณีเป็น HTTP URL มาตรฐาน)
      try {
        const authPayload: { displayName: string; photoURL?: string } = {
          displayName: savedProfile.name,
        };
        if (finalPhotoURL && /^https?:\/\//i.test(finalPhotoURL) && finalPhotoURL.length <= 2048) {
          authPayload.photoURL = finalPhotoURL;
        }
        await updateProfile(account, authPayload);
      } catch (authErr) {
        console.warn('Auth updateProfile error:', authErr);
      }

      setProfile(savedProfile);
      setDraftProfile(savedProfile);
      setAvatarPreview('');

      setEditing(false);

      setMessage('บันทึกข้อมูลโปรไฟล์และรูปภาพเรียบร้อยแล้ว');
    } catch (error: unknown) {
      console.error(
        'Error saving profile:',
        error
      );

      const errorCode =
        typeof error === 'object' && error !== null && 'code' in error
          ? error.code
          : undefined;

      switch (errorCode) {
        case 'permission-denied':
          setMessage(
            'Firestore ปฏิเสธสิทธิ์ กรุณาเผยแพร่ firestore.rules ใน Firebase Console แล้วลองใหม่'
          );
          break;

        default:
          setMessage(
            error instanceof Error
              ? error.message
              : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
          );
      }
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // ออกจากระบบ
  // -----------------------------
  const handleSignOut = async () => {
    try {
      const auth = getFirebaseAuth();

      await signOut(auth);

      router.replace('/auth');
    } catch (error) {
      console.error(
        'Error signing out:',
        error
      );

      setMessage(
        'ไม่สามารถออกจากระบบได้'
      );
    }
  };

  // -----------------------------
  // Loading
  // -----------------------------
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">
          กำลังโหลดข้อมูล...
        </div>
      </div>
    );
  }

  if (!account) {
    return null;
  }

  // -----------------------------
  // ข้อมูลช่อง Profile
  // -----------------------------
  const profileFields: {
    key: keyof ProfileDetails;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'name',
      label: 'ชื่อ-นามสกุล',
      icon: <User size={18} />,
    },
    {
      key: 'email',
      label: 'อีเมล',
      icon: <Mail size={18} />,
    },
    {
      key: 'phone',
      label: 'เบอร์โทรศัพท์',
      icon: <Phone size={18} />,
    },
  ];
  const displayPhotoURL =
    avatarPreview || (editing ? draftProfile.photoURL : profile.photoURL) || account?.photoURL || '';

  // User's posted jobs
  const userPostedJobs = jobs.filter(
    (j) =>
      (account && j.userId && j.userId === account.uid) ||
      (profile.name && j.employer?.name === profile.name) ||
      (profile.phone && j.contact?.phone === profile.phone)
  );
  const userPostedJobIds = new Set(userPostedJobs.map((j) => j.id));

  // 1. Applications submitted by the user
  const myApplications = applications.filter(
    (app) => (account && app.applicantUserId === account.uid) || appliedJobs.has(app.jobId)
  );
  const myPendingApplications = myApplications.filter((app) => app.status === 0);
  const myAcceptedApplications = myApplications.filter((app) => app.status === 1);

  // 2. Applications incoming on jobs posted by the user
  const incomingApplications = applications.filter((app) => userPostedJobIds.has(app.jobId));
  const incomingPendingApplications = incomingApplications.filter((app) => app.status === 0);

  // Total pending count for tab badge
  const totalPendingCount = myPendingApplications.length + incomingPendingApplications.length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in duration-300">
      {/* =========================================
          Header
      ========================================= */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            โปรไฟล์ของฉัน
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-zinc-500">
            จัดการข้อมูลส่วนตัวและกิจกรรมของคุณ
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white/90 px-4 py-2 text-xs sm:text-sm font-bold text-rose-600 transition hover:bg-rose-50 shadow-2xs cursor-pointer active:scale-95"
        >
          <LogOut size={16} />
          ออกจากระบบ
        </button>
      </div>

      {/* =========================================
          Derived Application Lists per status config
      ========================================= */}
      {(() => {
        return null;
      })()}

      {/* =========================================
          Profile Header Card
      ========================================= */}
      <div className="mb-6 overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              {displayPhotoURL ? (
                <div
                  aria-label="รูปโปรไฟล์"
                  className="h-full w-full rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url("${displayPhotoURL}")` }}
                />
              ) : (
                <User size={38} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xl font-bold text-zinc-900">
                {profile.name ||
                  account.displayName ||
                  'ผู้ใช้งาน'}
              </h2>

              <p className="mt-1 truncate text-sm text-zinc-500">
                {profile.email ||
                  account.email ||
                  'ไม่พบอีเมล'}
              </p>
            </div>

            {!editing && (
              <button
                onClick={handleEditProfile}
                className="flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 hover:bg-zinc-800 px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition shadow-xs cursor-pointer active:scale-95"
              >
                <Edit3 size={16} />
                แก้ไขโปรไฟล์
              </button>
            )}
          </div>

          {/* 4 Stats matching ForNeed/USER collection schema */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 mt-4 border-t border-zinc-100">
            <div className="bg-zinc-50/80 rounded-2xl p-3 text-center border border-zinc-100">
              <span className="text-[11px] font-medium text-zinc-500 block">งานที่กำลังทำ (Doing)</span>
              <span className="text-base sm:text-lg font-black text-blue-600 mt-0.5 block">{myAcceptedApplications.length || userStats.doingWork}</span>
            </div>
            <div className="bg-zinc-50/80 rounded-2xl p-3 text-center border border-zinc-100">
              <span className="text-[11px] font-medium text-zinc-500 block">งานที่เสร็จแล้ว (Finished)</span>
              <span className="text-base sm:text-lg font-black text-emerald-600 mt-0.5 block">{userStats.finishedWork}</span>
            </div>
            <div className="bg-zinc-50/80 rounded-2xl p-3 text-center border border-zinc-100">
              <span className="text-[11px] font-medium text-zinc-500 block">ประกาศงานของฉัน (Own)</span>
              <span className="text-base sm:text-lg font-black text-zinc-900 mt-0.5 block">
                {userPostedJobs.length || userStats.ownWork}
              </span>
            </div>
            <div className="bg-zinc-50/80 rounded-2xl p-3 text-center border border-zinc-100">
              <span className="text-[11px] font-medium text-zinc-500 block">รายได้สะสม (Income)</span>
              <span className="text-base sm:text-lg font-black text-amber-600 mt-0.5 block">{userStats.income} ฿</span>
            </div>
          </div>

          {/* =========================================
              Container คะแนนรีวิว (Review & Rating Container)
          ========================================= */}
          <div className="mt-4 pt-4 border-t border-zinc-100 bg-gradient-to-br from-amber-50/40 via-white to-zinc-50/60 rounded-2xl p-4 sm:p-5 border border-amber-100/70 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100/60">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center shadow-xs">
                  <Star className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-zinc-900 flex items-center gap-2">
                    <span>คะแนนรีวิวและความน่าเชื่อถือ</span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200/60">
                      Rating Score
                    </span>
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    ประเมินจากผู้ว่าจ้างและผู้ร่วมงานในจังหวัดพะเยา
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 font-semibold bg-zinc-100 px-3 py-1.5 rounded-xl border border-zinc-200/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>โปรไฟล์ของคุณ</span>
                </span>
                {reviews.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('reviews')}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    <span>ดูรีวิวทั้งหมด ({reviews.length})</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4 items-center">
              {/* Score Highlight Box */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-white rounded-2xl border border-amber-100 shadow-2xs">
                <span className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
                  {ratingStats.total > 0 ? ratingStats.average.toFixed(1) : '-'}
                </span>
                {/* 5 Stars representation */}
                <div className="flex items-center gap-1 my-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const score = ratingStats.total > 0 ? ratingStats.average : 0;
                    const isFull = score >= star;
                    const isHalf = score >= star - 0.5 && score < star;
                    return isFull ? (
                      <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400 filter drop-shadow-2xs" />
                    ) : isHalf ? (
                      <StarHalf key={star} className="w-4 h-4 fill-amber-400 text-amber-400 filter drop-shadow-2xs" />
                    ) : (
                      <Star key={star} className="w-4 h-4 text-zinc-200 fill-zinc-100" />
                    );
                  })}
                </div>
                <span className="text-xs font-semibold text-zinc-500">
                  {ratingStats.total > 0 ? `จากทั้งหมด ${ratingStats.total} รีวิว` : 'ยังไม่มีรีวิว'}
                </span>
              </div>

              {/* Score Breakdown Bar */}
              <div className="sm:col-span-8 space-y-1.5 bg-white/70 p-3.5 rounded-2xl border border-amber-100/50">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = ratingStats.distribution[stars] || 0;
                  const pct = ratingStats.total > 0 ? Math.round((count / ratingStats.total) * 100) : 0;
                  return (
                    <div key={stars} className="flex items-center gap-2 text-xs">
                      <span className="w-10 text-right font-bold text-zinc-600 shrink-0 flex items-center justify-end gap-1">
                        {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                      </span>
                      <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-7 text-[10px] text-zinc-400 font-semibold text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

          {/* =========================================
              Tabs
          ========================================= */}
          <div className="border-t border-gray-100 px-4">
            <div className="flex gap-1 overflow-x-auto">
              <TabButton
                active={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
                icon={<User size={17} />}
                label="ข้อมูลส่วนตัว"
              />

              <TabButton
                active={activeTab === 'my-posts'}
                onClick={() => setActiveTab('my-posts')}
                icon={<FileText size={17} />}
                label={`โพสต์ของฉัน (${userPostedJobs.length})`}
              />

              <TabButton
                active={activeTab === 'pending-approval'}
                onClick={() => setActiveTab('pending-approval')}
                icon={<Clock3 size={17} className={activeTab === 'pending-approval' ? 'text-amber-500' : ''} />}
                label={`กำลังรอ approve ใบสมัคร${totalPendingCount > 0 ? ` (${totalPendingCount})` : ''}`}
              />

              <TabButton
                active={activeTab === 'ongoing'}
                onClick={() => setActiveTab('ongoing')}
                icon={<BriefcaseBusiness size={17} />}
                label={`งานที่กำลังทำ (${myAcceptedApplications.length})`}
              />

              <TabButton
                active={activeTab === 'completed'}
                onClick={() => setActiveTab('completed')}
                icon={<CheckCircle2 size={17} />}
                label="งานที่เสร็จแล้ว"
              />

              <TabButton
                active={activeTab === 'reviews'}
                onClick={() => setActiveTab('reviews')}
                icon={<Star size={17} className={activeTab === 'reviews' ? 'fill-amber-400 text-amber-400' : ''} />}
                label={`คะแนนและรีวิว (${reviews.length})`}
              />
            </div>
          </div>
        </div>

        {/* =========================================
            Message
        ========================================= */}
        {message && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {message}
          </div>
        )}

        {/* =========================================
            Profile Tab
        ========================================= */}
        {activeTab === 'profile' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  ข้อมูลส่วนตัว
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  ข้อมูลสำหรับใช้ในระบบ JOB Phayao
                </p>
              </div>

              {editing && (
                <button
                  onClick={
                    handleCancelEdit
                  }
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
                >
                  <X size={16} />
                  ยกเลิก
                </button>
              )}
            </div>

            {/* =====================================
                Edit Form
            ===================================== */}
            {editing ? (
              <div className="space-y-5">
                {/* Avatar Change Section: URL Link, Presets, or File Upload */}
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 sm:p-5 space-y-4 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Avatar Preview */}
                    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white shadow-sm bg-blue-100 text-blue-600">
                      {displayPhotoURL ? (
                        <div
                          aria-label="ตัวอย่างรูปโปรไฟล์"
                          className="h-full w-full rounded-full bg-cover bg-center"
                          style={{ backgroundImage: `url("${displayPhotoURL}")` }}
                        />
                      ) : (
                        <User size={36} />
                      )}
                      {displayPhotoURL && (
                        <button
                          type="button"
                          onClick={() => {
                            setAvatarPreview('');
                            setDraftProfile((prev) => ({ ...prev, photoURL: '' }));
                          }}
                          title="ล้างรูปโปรไฟล์"
                          className="absolute bottom-0 right-0 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow-xs cursor-pointer transition-transform hover:scale-110"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-zinc-900">รูปโปรไฟล์ (Profile Picture)</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          รองรับข้อความลิงก์ URL
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        เลือกวิธีเปลี่ยนรูป: ใส่ลิงก์ URL รูปภาพโดยตรง, เลือกรูปสำเร็จรูป, หรืออัปโหลดจากเครื่อง
                      </p>

                      {/* Mode Switcher Buttons */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() => setAvatarInputMode('url')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            avatarInputMode === 'url'
                              ? 'bg-zinc-900 text-white shadow-xs'
                              : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'
                          }`}
                        >
                          <LinkIcon size={13} />
                          <span>ใส่ลิงก์ URL รูปภาพ</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAvatarInputMode('preset')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            avatarInputMode === 'preset'
                              ? 'bg-zinc-900 text-white shadow-xs'
                              : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'
                          }`}
                        >
                          <Sparkles size={13} />
                          <span>เลือกรูปสำเร็จรูป</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAvatarInputMode('upload')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            avatarInputMode === 'upload'
                              ? 'bg-zinc-900 text-white shadow-xs'
                              : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'
                          }`}
                        >
                          <Upload size={13} />
                          <span>อัปโหลดจากเครื่อง</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mode 1: URL Input */}
                  {avatarInputMode === 'url' && (
                    <div className="pt-3 border-t border-zinc-200/70 animate-in fade-in duration-200">
                      <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                        วางลิงก์ URL ของรูปภาพ (Direct Image Link URL)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={draftProfile.photoURL || ''}
                          onChange={(e) => {
                            setAvatarPreview('');
                            setDraftProfile((prev) => ({ ...prev, photoURL: e.target.value.trim() }));
                          }}
                          placeholder="เช่น https://images.unsplash.com/... หรือ https://i.imgur.com/..."
                          className="flex-1 px-3 py-2 rounded-xl border border-zinc-300 focus:border-zinc-900 focus:outline-hidden text-xs text-zinc-900 bg-white shadow-2xs"
                        />
                        {draftProfile.photoURL && (
                          <button
                            type="button"
                            onClick={() => setDraftProfile((prev) => ({ ...prev, photoURL: '' }))}
                            className="px-3 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-xs font-semibold text-zinc-600 transition-colors cursor-pointer"
                          >
                            ล้าง URL
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1.5">
                        💡 สามารถคลิกขวาที่รูปภาพใดๆ บนอินเทอร์เน็ตแล้วเลือก &quot;คัดลอกที่อยู่รูปภาพ&quot; (Copy image address) มาวางที่นี่ได้ทันที
                      </p>
                    </div>
                  )}

                  {/* Mode 2: Presets */}
                  {avatarInputMode === 'preset' && (
                    <div className="pt-3 border-t border-zinc-200/70 animate-in fade-in duration-200">
                      <label className="block text-xs font-bold text-zinc-700 mb-2">
                        เลือกรูปโปรไฟล์ตัวอย่างสำเร็จรูป (Preset Avatars)
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                        {PRESET_AVATARS.map((preset, idx) => {
                          const isSelected = draftProfile.photoURL === preset.url && !avatarPreview;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setAvatarPreview('');
                                setDraftProfile((prev) => ({ ...prev, photoURL: preset.url }));
                              }}
                              className={`group flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs ring-2 ring-zinc-900/10'
                                  : 'border-zinc-200 bg-white hover:border-zinc-400 text-zinc-700'
                              }`}
                            >
                              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-zinc-200 shadow-2xs">
                                <Image
                                  src={preset.url}
                                  alt={preset.label}
                                  fill
                                  sizes="48px"
                                  unoptimized
                                  className="object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>
                              <span className="text-[10px] font-semibold text-center truncate max-w-full">
                                {preset.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Mode 3: File Upload */}
                  {avatarInputMode === 'upload' && (
                    <div className="pt-3 border-t border-zinc-200/70 animate-in fade-in duration-200">
                      <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                        อัปโหลดไฟล์รูปภาพจากอุปกรณ์
                      </label>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleAvatarChange}
                        className="block w-full text-xs text-zinc-600 file:mr-3 file:rounded-xl file:border-0 file:bg-zinc-900 file:px-3 py-1 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-zinc-800 cursor-pointer"
                      />
                      <span className="mt-1.5 block text-[11px] text-zinc-500">
                        JPEG, PNG หรือ WebP ขนาดไม่เกิน 5 MB (ระบบจะแปลงไฟล์เป็น URL และบีบอัดให้อัตโนมัติทันทีที่เลือกไฟล์)
                      </span>

                      {/* Display converted URL preview box */}
                      {avatarPreview && (
                        <div className="mt-3 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
                          <div className="flex items-center justify-between text-emerald-800 font-bold mb-1">
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 size={15} className="text-emerald-600" />
                              แปลงไฟล์เป็น URL สำเร็จแล้ว!
                            </span>
                            <button
                              type="button"
                              onClick={() => setAvatarInputMode('url')}
                              className="text-blue-600 hover:text-blue-800 text-[11px] font-semibold underline cursor-pointer"
                            >
                              สลับไปดูในช่อง URL &rarr;
                            </button>
                          </div>
                          <p className="text-[11px] text-emerald-700 leading-relaxed">
                            ไฟล์รูปภาพของคุณถูกแปลงเป็น Data URL (Base64) ที่ปรับขนาดและบีบอัดเพื่อความคมชัดเรียบร้อย พร้อมสำหรับบันทึกลง Firebase ได้ทันที
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <input
                              type="text"
                              readOnly
                              value={draftProfile.photoURL || avatarPreview}
                              className="flex-1 p-2 bg-white rounded-xl border border-emerald-200/80 font-mono text-[10px] text-zinc-600 truncate select-all cursor-text"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (typeof window !== 'undefined' && navigator.clipboard) {
                                  navigator.clipboard.writeText(draftProfile.photoURL || avatarPreview);
                                  setMessage('คัดลอก Data URL เรียบร้อยแล้ว');
                                }
                              }}
                              className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] shrink-0 cursor-pointer transition-colors"
                            >
                              คัดลอก URL
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {profileFields.filter(({ key }) => key !== 'email').map(
                    ({ key, label, icon }) => {
                      return (
                        <div
                          key={key}
                          className="space-y-2"
                        >
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            {icon}
                            {label}
                          </label>

                          <input
                            type="text"
                            value={
                              draftProfile[key] ??
                              ''
                            }
                            onChange={(e) =>
                              setDraftProfile(
                                (prev) => ({
                                  ...prev,
                                  [key]:
                                    e.target.value,
                                })
                              )
                            }
                            required={key === 'name'}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      );
                    }
                  )}
                </div>

                <p className="text-sm text-gray-500">
                  อีเมลบัญชี: {account.email || 'ไม่พบอีเมล'}
                </p>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    แนะนำตัว
                  </label>

                  <textarea
                    value={
                      draftProfile.bio ?? ''
                    }
                    onChange={(e) =>
                      setDraftProfile(
                        (prev) => ({
                          ...prev,
                          bio: e.target.value,
                        })
                      )
                    }
                    rows={4}
                    placeholder="เขียนแนะนำตัวสั้น ๆ..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Save */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={
                      handleSaveProfile
                    }
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={17} />

                    {saving
                      ? 'กำลังบันทึก...'
                      : 'บันทึกข้อมูล'}
                  </button>
                </div>
              </div>
            ) : (
              /* ===================================
                 View Profile
              =================================== */
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {profileFields.map(
                    ({ key, label, icon }) => (
                      <div
                        key={key}
                        className="rounded-xl bg-gray-50 p-4"
                      >
                        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500">
                          {icon}
                          {label}
                        </div>

                        <p className="break-words text-sm font-medium text-gray-900">
                          {profile[key] ||
                            'ไม่ได้ระบุ'}
                        </p>
                      </div>
                    )
                  )}
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="mb-2 text-xs font-medium text-gray-500">
                    แนะนำตัว
                  </p>

                  <p className="whitespace-pre-wrap break-words text-sm text-gray-900">
                    {profile.bio ||
                      'ยังไม่ได้เขียนแนะนำตัว'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================
        {/* =========================================
            My Posts
        ========================================= */}
        {activeTab === 'my-posts' && (() => {
          const userPostedJobs = jobs.filter(
            (j) =>
              (j.userId && j.userId === account.uid) ||
              (profile.name && j.employer?.name === profile.name) ||
              (profile.phone && j.contact?.phone === profile.phone)
          );

          const hasUserJobs = userPostedJobs.length > 0;
          const displayList = hasUserJobs ? userPostedJobs : myPosts;

          return (
            <ContentCard
              icon={<FileText size={30} />}
              title="โพสต์ของฉัน"
              description="รายการประกาศรับสมัครงานที่คุณสร้างบนระบบ"
              empty={displayList.length === 0}
              emptyText="ยังไม่มีประกาศงานที่คุณสร้าง คลิกปุ่มเพิ่มงานเพื่อเริ่มสร้างประกาศแรกของคุณ"
            >
              {hasUserJobs ? (
                <div className="space-y-3">
                  {userPostedJobs.map((job) => {
                    const jobPendingCount = incomingPendingApplications.filter(a => a.jobId === job.id).length;
                    return (
                      <div
                        key={job.id}
                        className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs hover:shadow-sm transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                              {job.categoryLabel}
                            </span>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              job.status === 'open' ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                            }`}>
                              {job.status === 'open' ? 'เปิดรับสมัคร' : 'ปิดรับแล้ว'}
                            </span>
                            {jobPendingCount > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setPendingSubTab('incoming');
                                  setActiveTab('pending-approval');
                                }}
                                className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200 transition-all cursor-pointer flex items-center gap-1 shadow-2xs animate-pulse"
                              >
                                <Clock3 className="w-3 h-3 text-amber-700" /> มี {jobPendingCount} คนรอ Approve
                              </button>
                            )}
                          </div>
                        <h4 className="font-bold text-zinc-900 text-sm sm:text-base truncate">
                          {job.title}
                        </h4>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          ค่าตอบแทน {job.salary} บาท/{job.salaryUnit} • {job.location}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="px-3 py-1.5 rounded-xl border border-zinc-200 hover:border-zinc-300 text-zinc-700 text-xs font-semibold hover:bg-zinc-50 transition-colors flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>ดูประกาศ</span>
                        </Link>
                        <Link
                          href={`/edit/${job.id}`}
                          className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>แก้ไข</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบประกาศ "${job.title}"?`)) {
                              deleteJob(job.id);
                            }
                          }}
                          className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="ลบประกาศงาน"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              ) : (
                myPosts.map((post, index) => (
                  <div
                    key={post.id ?? index}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <h4 className="font-medium text-gray-900">
                      {post.title ?? 'ไม่มีชื่อโพสต์'}
                    </h4>
                    {post.description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {post.description}
                      </p>
                    )}
                  </div>
                ))
              )}
            </ContentCard>
          );
        })()}

        {/* =========================================
            Pending Approval Tab (กำลังรอ approve ใบสมัคร)
        ========================================= */}
        {activeTab === 'pending-approval' && (
          <ContentCard
            icon={<Clock3 size={30} className="text-amber-500" />}
            title="กำลังรอ approve ใบสมัคร"
            description="ติดตามสถานะใบสมัครงานที่กำลังรอการอนุมัติ (Status: 0 Pending) ทั้งงานที่คุณยื่นสมัคร และใบสมัครที่ส่งเข้ามาในประกาศงานของคุณ"
            empty={myPendingApplications.length === 0 && incomingPendingApplications.length === 0}
            emptyText="ขณะนี้ไม่มีใบสมัครที่กำลังรอ approve คุณสามารถค้นหาและยื่นสมัครงานใหม่ หรือสร้างประกาศงานเพื่อเปิดรับสมัครได้"
          >
            {/* Filter Pills if user has pending items */}
            {(myPendingApplications.length > 0 || incomingPendingApplications.length > 0) && (
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-zinc-100">
                <div className="flex items-center gap-1.5 p-1 bg-zinc-100/80 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setPendingSubTab('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      pendingSubTab === 'all'
                        ? 'bg-white text-zinc-900 shadow-2xs'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    ทั้งหมด ({totalPendingCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingSubTab('mine')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      pendingSubTab === 'mine'
                        ? 'bg-white text-zinc-900 shadow-2xs'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    ใบสมัครของฉันที่รอผล ({myPendingApplications.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingSubTab('incoming')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      pendingSubTab === 'incoming'
                        ? 'bg-white text-zinc-900 shadow-2xs'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    ใบสมัครที่ส่งเข้ามา ({incomingPendingApplications.length})
                  </button>
                </div>

                <span className="text-[11px] text-zinc-400 font-medium">
                  * อ้างอิงสถานะตาม ForNeed/status config (0 == pending)
                </span>
              </div>
            )}

            {/* Part 1: Incoming Applications for jobs posted by this user */}
            {(pendingSubTab === 'all' || pendingSubTab === 'incoming') && incomingPendingApplications.length > 0 && (
              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span>ใบสมัครที่ส่งเข้ามาในประกาศของคุณ (รอคุณ Approve)</span>
                  </h4>
                  <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                    {incomingPendingApplications.length} รายการ
                  </span>
                </div>

                <div className="space-y-3">
                  {incomingPendingApplications.map((app) => {
                    const job = jobs.find((j) => j.id === app.jobId);
                    return (
                      <div
                        key={app.id}
                        className="rounded-2xl border border-blue-200/80 bg-blue-50/20 p-4 sm:p-5 hover:bg-white transition-all shadow-2xs flex flex-col gap-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-zinc-100">
                          <div>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 mr-2">
                              ตำแหน่งงาน: {job?.title || 'ประกาศงานของคุณ'}
                            </span>
                            <span className="text-[11px] text-zinc-400">
                              ยื่นเมื่อ {app.createdAt || 'เร็วๆ นี้'}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            <Clock3 className="w-3 h-3" /> รอการอนุมัติ (Status: 0)
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-zinc-600">
                          <div className="bg-white p-2.5 rounded-xl border border-zinc-100">
                            <span className="text-[10px] text-zinc-400 block font-medium">ชื่อผู้สมัคร</span>
                            <span className="font-bold text-zinc-900 text-sm mt-0.5 block">{app.applicantName}</span>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-zinc-100">
                            <span className="text-[10px] text-zinc-400 block font-medium">เบอร์โทรติดต่อ</span>
                            <a href={`tel:${app.phone}`} className="font-bold text-blue-600 text-sm mt-0.5 block hover:underline">
                              {app.phone}
                            </a>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-zinc-100">
                            <span className="text-[10px] text-zinc-400 block font-medium">เวลาที่สะดวก/หมายเหตุ</span>
                            <span className="font-semibold text-zinc-700 mt-0.5 block truncate" title={app.freeScheduleNote}>
                              {app.freeScheduleNote || 'ไม่มีระบุ'}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-100/80">
                          {job && (
                            <Link
                              href={`/jobs/${job.id}`}
                              className="text-xs text-zinc-500 hover:text-zinc-800 font-semibold flex items-center gap-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>ดูหน้าประกาศงาน</span>
                            </Link>
                          )}

                          <div className="flex items-center gap-2 ml-auto">
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`ยืนยันการปฏิเสธใบสมัครของ "${app.applicantName}"?`)) {
                                  rejectApplication(app.id);
                                }
                              }}
                              className="px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-zinc-600 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>ปฏิเสธ (Reject)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`ยืนยันการอนุมัติรับ "${app.applicantName}" เข้าทำงานในตำแหน่ง "${job?.title || 'งานนี้'}"?`)) {
                                  approveApplication(app.id, app.jobId);
                                }
                              }}
                              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer flex items-center gap-1 active:scale-95"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>อนุมัติรับเข้าทำงาน (Approve)</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Part 2: Applications submitted by the user */}
            {(pendingSubTab === 'all' || pendingSubTab === 'mine') && myPendingApplications.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock3 className="w-3.5 h-3.5 text-amber-500" />
                    <span>ใบสมัครงานของคุณที่รอผู้ว่าจ้างอนุมัติ</span>
                  </h4>
                  <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                    {myPendingApplications.length} รายการ
                  </span>
                </div>

                <div className="space-y-3">
                  {myPendingApplications.map((app) => {
                    const job = jobs.find((j) => j.id === app.jobId);
                    return (
                      <div
                        key={app.id}
                        className="rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col gap-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-100">
                          <div className="flex items-center gap-2">
                            {job?.categoryLabel && (
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                                {job.categoryLabel}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80">
                              <Clock3 className="w-3 h-3 text-amber-600 animate-spin-slow" />
                              <span>กำลังรอ approve ใบสมัคร (Status: 0 Pending)</span>
                            </span>
                          </div>

                          <span className="text-[11px] text-zinc-400">
                            ยื่นเมื่อ {app.createdAt || 'เร็วๆ นี้'}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-zinc-900">
                            {job?.title || `งานรหัส #${app.jobId}`}
                          </h4>
                          <p className="text-xs text-zinc-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                            {job?.employer?.name && (
                              <span>ผู้ว่าจ้าง: <strong className="text-zinc-700">{job.employer.name}</strong></span>
                            )}
                            {job?.salary && (
                              <span>ค่าตอบแทน: <strong className="text-blue-600">{job.salary} บาท/{job.salaryUnit}</strong></span>
                            )}
                            {job?.location && (
                              <span>สถานที่: <strong>{job.location}</strong></span>
                            )}
                          </p>
                        </div>

                        {/* Submission note box */}
                        <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100/70 text-xs text-zinc-600 flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
                          <div>
                            <span className="font-semibold text-amber-900">ข้อมูลที่คุณกรอก: </span>
                            <span>{app.applicantName} (โทร {app.phone})</span>
                            {app.freeScheduleNote && (
                              <span className="text-zinc-500 block sm:inline sm:ml-2">• เวลาที่สะดวก: &quot;{app.freeScheduleNote}&quot;</span>
                            )}
                          </div>
                          <span className="text-[11px] text-amber-700 font-medium shrink-0">
                            รอผู้ว่าจ้างพิจารณา
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`คุณต้องการยกเลิกใบสมัครงาน "${job?.title || 'นี้'}" หรือไม่?`)) {
                                cancelApplication(app.id, app.jobId);
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>ยกเลิกใบสมัคร</span>
                          </button>

                          {job && (
                            <Link
                              href={`/jobs/${job.id}`}
                              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all text-center flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>ดูรายละเอียดงาน</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </ContentCard>
        )}

        {/* =========================================
            Completed
        ========================================= */}
        {activeTab === 'completed' && (
          <ContentCard
            icon={<CheckCircle2 size={30} />}
            title="งานที่เสร็จแล้ว"
            description="ประวัติงานที่คุณทำเสร็จเรียบร้อยแล้ว"
            empty={completedWorks.length === 0}
            emptyText="ยังไม่มีงานที่เสร็จสิ้น"
          >
            {completedWorks.map((work, index) => (
              <div
                key={work.id ?? index}
                className="rounded-xl border border-gray-200 p-4"
              >
                <h4 className="font-medium text-gray-900">
                  {work.title ?? 'ไม่มีชื่องาน'}
                </h4>
              </div>
            ))}
          </ContentCard>
        )}

        {/* =========================================
            Ongoing / Applied
        ========================================= */}
        {activeTab === 'ongoing' && (() => {
          const acceptedJobIds = new Set(myAcceptedApplications.map((a) => a.jobId));
          const acceptedJobsList = jobs.filter((j) => acceptedJobIds.has(j.id));
          const myAppliedJobs = jobs.filter((j) => appliedJobs.has(j.id));
          const hasDoing = acceptedJobsList.length > 0;
          const hasAnyApplied = myAppliedJobs.length > 0;

          return (
            <ContentCard
              icon={<BriefcaseBusiness size={30} />}
              title="งานที่กำลังทำ (Doing Work)"
              description="งานที่ได้รับการอนุมัติใบสมัครเรียบร้อยแล้วและกำลังปฏิบัติงานอยู่ (Status: 1 Accepted)"
              empty={!hasDoing && !hasAnyApplied && ongoingJobs.length === 0}
              emptyText="ยังไม่มีงานที่คุณได้รับการอนุมัติให้เริ่มทำในขณะนี้"
            >
              {/* Notice banner if user has pending applications */}
              {myPendingApplications.length > 0 && (
                <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <Clock3 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-xs font-semibold text-amber-900">
                      คุณมี {myPendingApplications.length} ใบสมัครที่กำลังรอการอนุมัติ (Status: 0 Pending)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('pending-approval')}
                    className="text-xs font-bold text-amber-800 bg-white hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition-colors cursor-pointer shrink-0 shadow-2xs"
                  >
                    ดูที่แท็บรอ Approve →
                  </button>
                </div>
              )}

              {hasDoing ? (
                <div className="space-y-3">
                  {acceptedJobsList.map((job) => (
                    <div
                      key={job.id}
                      className="rounded-2xl border border-emerald-200/80 bg-emerald-50/20 p-4 sm:p-5 shadow-2xs hover:shadow-sm transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                            {job.categoryLabel}
                          </span>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> อนุมัติแล้ว (กำลังทำ / Accepted)
                          </span>
                        </div>
                        <h4 className="font-bold text-zinc-900 text-sm sm:text-base truncate">
                          {job.title}
                        </h4>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          ผู้ว่าจ้าง: {job.employer.name} • {job.salary} บาท/{job.salaryUnit} • {job.location}
                        </p>
                      </div>

                      <Link
                        href={`/jobs/${job.id}`}
                        className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all text-center shrink-0 cursor-pointer"
                      >
                        ดูรายละเอียดงาน
                      </Link>
                    </div>
                  ))}
                </div>
              ) : hasAnyApplied ? (
                <div className="space-y-3">
                  {myAppliedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs hover:shadow-sm transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                            {job.categoryLabel}
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 flex items-center gap-1 border border-amber-200/60">
                            <Clock3 className="w-3 h-3 text-amber-600" /> ยื่นใบสมัครแล้ว (รอผล Approve)
                          </span>
                        </div>
                        <h4 className="font-bold text-zinc-900 text-sm sm:text-base truncate">
                          {job.title}
                        </h4>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          ผู้ว่าจ้าง: {job.employer.name} • {job.salary} บาท/{job.salaryUnit}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setActiveTab('pending-approval')}
                          className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          ติดตามผลอนุมัติ
                        </button>
                        <Link
                          href={`/jobs/${job.id}`}
                          className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all text-center cursor-pointer"
                        >
                          ดูประกาศ
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                ongoingJobs.map((job, index) => (
                  <div
                    key={job.id ?? index}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <h4 className="font-medium text-gray-900">
                      {job.title ?? 'ไม่มีชื่องาน'}
                    </h4>
                  </div>
                ))
              )}
            </ContentCard>
          );
        })()}

        {/* =========================================
            Reviews Tab (ForNeed/Rating_score.png)
        ========================================= */}
        {activeTab === 'reviews' && (
          <ContentCard
            icon={<Star size={30} className="fill-amber-400 text-amber-400" />}
            title="คะแนนและความคิดเห็นรีวิว"
            description="ความคิดเห็นและคะแนนความพึงพอใจจากผู้ว่าจ้างและผู้ร่วมงานจริงในระบบ"
            empty={reviews.length === 0}
            emptyText="ยังไม่มีผู้ให้คะแนนรีวิวสำหรับโปรไฟล์นี้ เป็นคนแรกที่ให้คะแนนเลย!"
          >
            <div className="flex justify-end mb-3">
              <span className="text-[11px] text-zinc-400 font-medium">
                * คะแนนและรีวิวทั้งหมดได้รับจากผู้ว่าจ้างหรือผู้ร่วมงานในระบบ
              </span>
            </div>

            <div className="space-y-3">
              {reviews.map((r, idx) => (
                <div
                  key={r.id || idx}
                  className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-4 sm:p-5 hover:bg-white transition-all shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 font-bold text-sm shrink-0">
                        {r.reviewerName ? r.reviewerName.charAt(0) : 'U'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900">
                          {r.reviewerName || 'ผู้ประเมิน'}
                        </h4>
                        <span className="text-[11px] text-zinc-400">
                          {r.createdAt || 'รีวิวล่าสุด'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/60 text-amber-700 text-xs font-black">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{r.score.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-zinc-700 leading-relaxed whitespace-pre-line pl-2.5 border-l-2 border-amber-300">
                    &quot;{r.comment}&quot;
                  </p>
                </div>
              ))}
            </div>
          </ContentCard>
        )}
      </div>
  );
}

// =====================================================
// Components
// =====================================================

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
        active
          ? 'border-zinc-900 text-zinc-900'
          : 'border-transparent text-zinc-400 hover:text-zinc-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ContentCard({
  icon,
  title,
  description,
  empty,
  emptyText,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  empty: boolean;
  emptyText: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-zinc-200/80 bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <h3 className="flex items-center gap-2 text-lg font-black text-zinc-900">
          {icon}
          {title}
        </h3>

        <p className="mt-1 text-xs sm:text-sm text-zinc-500">
          {description}
        </p>
      </div>

      {empty ? (
        <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl bg-zinc-50 text-center border border-dashed border-zinc-200 p-6">
          <div className="mb-3 text-zinc-400">
            {icon}
          </div>

          <p className="text-xs sm:text-sm font-medium text-zinc-500">
            {emptyText}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}