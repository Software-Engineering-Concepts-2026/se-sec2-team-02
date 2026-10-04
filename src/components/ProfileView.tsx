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
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Building2,
  IdCard,
  Edit3,
  Save,
  X,
  LogOut,
  FileText,
  CheckCircle2,
  Clock3,
  BriefcaseBusiness,
} from 'lucide-react';

import { getFirebaseAuth, getFirebaseFirestore, getFirebaseStorage } from '@/lib/firebase';

interface ProfileDetails {
  name: string;
  email: string;
  studentId: string;
  faculty: string;
  major: string;
  campus: string;
  phone: string;
  lineId: string;
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
  studentId: '',
  faculty: '',
  major: '',
  campus: '',
  phone: '',
  lineId: '',
  bio: '',
  photoURL: '',
};

type ProfileTab = 'profile' | 'my-posts' | 'completed' | 'ongoing';

export default function ProfileView() {
  const router = useRouter();

  const [account, setAccount] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<ProfileDetails>(emptyProfile);
  const [draftProfile, setDraftProfile] =
    useState<ProfileDetails>(emptyProfile);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [activeTab, setActiveTab] =
    useState<ProfileTab>('profile');

  const [message, setMessage] = useState('');

  const [myPosts, setMyPosts] = useState<ProfilePost[]>([]);
  const [completedWorks] = useState<ProfilePost[]>([]);
  const [ongoingJobs] = useState<ProfilePost[]>([]);

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

          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          const firestoreData = userSnap.exists()
            ? userSnap.data()
            : {};

          const loadedProfile: ProfileDetails = {
            name: firestoreData.name ?? user.displayName ?? '',
            email: user.email ?? '',
            studentId: firestoreData.studentId ?? '',
            faculty: firestoreData.faculty ?? '',
            major: firestoreData.major ?? '',
            campus: firestoreData.campus ?? '',
            phone: firestoreData.phone ?? '',
            lineId: firestoreData.lineId ?? '',
            bio: firestoreData.bio ?? '',
            photoURL: firestoreData.photoURL ?? user.photoURL ?? '',
          };

          setProfile(loadedProfile);
          setDraftProfile(loadedProfile);

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
    setAvatarFile(null);
    setAvatarPreview('');
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
    setAvatarFile(null);
    setAvatarPreview('');
    setEditing(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
    setAvatarFile(file);
    setMessage('');
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

      const nextProfile: ProfileDetails = {
        name: draftProfile.name?.trim() ?? '',
        email: account.email ?? '',
        studentId:
          draftProfile.studentId?.trim() ?? '',
        faculty:
          draftProfile.faculty?.trim() ?? '',
        major:
          draftProfile.major?.trim() ?? '',
        campus:
          draftProfile.campus?.trim() ?? '',
        phone:
          draftProfile.phone?.trim() ?? '',
        lineId:
          draftProfile.lineId?.trim() ?? '',
        bio:
          draftProfile.bio?.trim() ?? '',
        photoURL: profile.photoURL || account.photoURL || '',
      };

      // -----------------------------
      // ตรวจสอบชื่อ
      // -----------------------------
      if (!nextProfile.name) {
        setMessage(
          'กรุณากรอกชื่อ-นามสกุล'
        );
        setSaving(false);
        return;
      }

      let photoURL = nextProfile.photoURL;
      if (avatarFile) {
        const avatarRef = ref(
          getFirebaseStorage(),
          `users/${account.uid}/avatar/profile-image`
        );
        const uploadedImage = await uploadBytes(avatarRef, avatarFile, {
          contentType: avatarFile.type,
        });
        photoURL = await getDownloadURL(uploadedImage.ref);
      }

      const savedProfile: ProfileDetails = {
        ...nextProfile,
        photoURL,
      };

      await setDoc(
        doc(db, 'users', account.uid),
        {
          ...savedProfile,
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      // อัปเดตชื่อใน Firebase Authentication
      if (account.displayName !== savedProfile.name || avatarFile) {
        await updateProfile(account, {
          displayName: savedProfile.name,
          ...(avatarFile ? { photoURL } : {}),
        });
      }

      setProfile(savedProfile);
      setDraftProfile(savedProfile);
      setAvatarFile(null);
      setAvatarPreview('');

      setEditing(false);

      setMessage('บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว');
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
        case 'storage/unauthorized':
          setMessage('ไม่มีสิทธิ์อัปโหลดรูป กรุณาเผยแพร่ storage.rules แล้วลองใหม่');
          break;

        case 'storage/bucket-not-found':
          setMessage('ไม่พบ Firebase Storage bucket กรุณาเปิดใช้ Storage ใน Firebase Console');
          break;

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
      key: 'studentId',
      label: 'รหัสนิสิต',
      icon: <IdCard size={18} />,
    },
    {
      key: 'faculty',
      label: 'คณะ',
      icon: <GraduationCap size={18} />,
    },
    {
      key: 'major',
      label: 'สาขา / ชั้นปี',
      icon: <Building2 size={18} />,
    },
    {
      key: 'campus',
      label: 'วิทยาเขต / ที่พัก',
      icon: <MapPin size={18} />,
    },
    {
      key: 'phone',
      label: 'เบอร์โทรศัพท์',
      icon: <Phone size={18} />,
    },
    {
      key: 'lineId',
      label: 'LINE ID',
      icon: <MessageIcon />,
    },
  ];
  const displayPhotoURL =
    avatarPreview || profile.photoURL || account.photoURL || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* =========================================
            Header
        ========================================= */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              โปรไฟล์ของฉัน
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              จัดการข้อมูลส่วนตัวและกิจกรรมของคุณ
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={17} />
            ออกจากระบบ
          </button>
        </div>

        {/* =========================================
            Profile Header Card
        ========================================= */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
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
                <h2 className="truncate text-xl font-bold text-gray-900">
                  {profile.name ||
                    account.displayName ||
                    'ผู้ใช้งาน'}
                </h2>

                <p className="mt-1 truncate text-sm text-gray-500">
                  {profile.email ||
                    account.email ||
                    'ไม่พบอีเมล'}
                </p>

                {profile.studentId && (
                  <p className="mt-1 text-sm text-gray-500">
                    รหัสนิสิต: {profile.studentId}
                  </p>
                )}
              </div>

              {!editing && (
                <button
                  onClick={handleEditProfile}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  <Edit3 size={17} />
                  แก้ไขโปรไฟล์
                </button>
              )}
            </div>
          </div>

          {/* =========================================
              Tabs
          ========================================= */}
          <div className="border-t border-gray-100 px-4">
            <div className="flex gap-1 overflow-x-auto">
              <TabButton
                active={activeTab === 'profile'}
                onClick={() =>
                  setActiveTab('profile')
                }
                icon={<User size={17} />}
                label="ข้อมูลส่วนตัว"
              />

              <TabButton
                active={
                  activeTab === 'my-posts'
                }
                onClick={() =>
                  setActiveTab('my-posts')
                }
                icon={<FileText size={17} />}
                label="โพสต์ของฉัน"
              />

              <TabButton
                active={
                  activeTab === 'completed'
                }
                onClick={() =>
                  setActiveTab('completed')
                }
                icon={
                  <CheckCircle2 size={17} />
                }
                label="งานที่เสร็จแล้ว"
              />

              <TabButton
                active={
                  activeTab === 'ongoing'
                }
                onClick={() =>
                  setActiveTab('ongoing')
                }
                icon={<Clock3 size={17} />}
                label="งานที่กำลังทำ"
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
                  ข้อมูลสำหรับใช้ในระบบ JOB UP
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
                <div className="flex flex-col gap-4 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-blue-600">
                    {displayPhotoURL ? (
                      <div
                        aria-label="ตัวอย่างรูปโปรไฟล์"
                        className="h-full w-full rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url("${displayPhotoURL}")` }}
                      />
                    ) : (
                      <User size={34} />
                    )}
                  </div>
                  <label className="block min-w-0 text-sm font-medium text-gray-700">
                    <span className="mb-1 block">รูปโปรไฟล์</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarChange}
                      className="block w-full max-w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:font-medium file:text-gray-700 hover:file:bg-gray-100"
                    />
                    <span className="mt-1 block text-xs text-gray-500">
                      JPEG, PNG หรือ WebP ขนาดไม่เกิน 5 MB
                    </span>
                  </label>
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
            My Posts
        ========================================= */}
        {activeTab === 'my-posts' && (
          <ContentCard
            icon={<FileText size={30} />}
            title="โพสต์ของฉัน"
            description="รายการโพสต์หรือประกาศงานที่คุณสร้าง"
            empty={myPosts.length === 0}
            emptyText="ยังไม่มีโพสต์"
          >
            {myPosts.map(
              (post, index) => (
                <div
                  key={post.id ?? index}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <h4 className="font-medium text-gray-900">
                    {post.title ??
                      'ไม่มีชื่อโพสต์'}
                  </h4>

                  {post.description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {post.description}
                    </p>
                  )}
                </div>
              )
            )}
          </ContentCard>
        )}

        {/* =========================================
            Completed
        ========================================= */}
        {activeTab === 'completed' && (
          <ContentCard
            icon={
              <CheckCircle2 size={30} />
            }
            title="งานที่เสร็จแล้ว"
            description="งานที่คุณทำเสร็จเรียบร้อยแล้ว"
            empty={
              completedWorks.length === 0
            }
            emptyText="ยังไม่มีงานที่เสร็จแล้ว"
          >
            {completedWorks.map(
              (work, index) => (
                <div
                  key={work.id ?? index}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <h4 className="font-medium text-gray-900">
                    {work.title ??
                      'ไม่มีชื่องาน'}
                  </h4>
                </div>
              )
            )}
          </ContentCard>
        )}

        {/* =========================================
            Ongoing
        ========================================= */}
        {activeTab === 'ongoing' && (
          <ContentCard
            icon={<BriefcaseBusiness size={30} />}
            title="งานที่กำลังทำ"
            description="งานที่คุณกำลังดำเนินการอยู่"
            empty={
              ongoingJobs.length === 0
            }
            emptyText="ยังไม่มีงานที่กำลังทำ"
          >
            {ongoingJobs.map(
              (job, index) => (
                <div
                  key={job.id ?? index}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <h4 className="font-medium text-gray-900">
                    {job.title ??
                      'ไม่มีชื่องาน'}
                  </h4>
                </div>
              )
            )}
          </ContentCard>
        )}
      </div>
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
      className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'
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
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          {icon}
          {title}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      </div>

      {empty ? (
        <div className="flex min-h-40 flex-col items-center justify-center rounded-xl bg-gray-50 text-center">
          <div className="mb-3 text-gray-400">
            {icon}
          </div>

          <p className="text-sm text-gray-500">
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

// ไอคอน LINE แบบง่าย
function MessageIcon() {
  return (
    <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-current text-[9px] font-bold">
      L
    </span>
  );
}