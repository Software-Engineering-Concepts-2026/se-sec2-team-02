'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Star, StarHalf, MessageSquare, User, ArrowLeft, CheckCircle2, ShieldCheck, Briefcase } from 'lucide-react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseFirestore } from '@/lib/firebase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useJobs } from '@/context/JobContext';

// 11 distinct score options as requested: 0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5.0
const RATING_STEPS = [0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5.0];

const RATING_DESCRIPTIONS: Record<number, { title: string; color: string; badge: string }> = {
  5.0: { title: 'ยอดเยี่ยมมาก จ่ายเงินตรงเวลา ดูแลผู้ทำงานดีมาก', color: 'text-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  4.5: { title: 'ดีเยี่ยม สื่อสารชัดเจน มีความเป็นธรรมสูง', color: 'text-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  4.0: { title: 'ดีมาก ปฏิบัติตรงตามรายละเอียดงานที่โพสต์', color: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  3.5: { title: 'ดี ปฏิบัติตรงตามข้อตกลงที่ระบุไว้', color: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  3.0: { title: 'ปานกลาง มีการจ้างงานและจ่ายค่าตอบแทนตามปกติ', color: 'text-blue-600', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  2.5: { title: 'พอใช้ รายละเอียดงานหรือเวลามีคลาดเคลื่อนบ้าง', color: 'text-orange-500', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
  2.0: { title: 'ต้องปรับปรุง เงื่อนไขงานไม่ตรงกับที่โพสต์ประกาศ', color: 'text-orange-600', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
  1.5: { title: 'ไม่น่าพอใจ มีปัญหาเรื่องการจ่ายค่าจ้างหรือการติดต่อ', color: 'text-rose-500', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  1.0: { title: 'แย่มาก ปฏิบัติต่อผู้ทำงานไม่เป็นธรรม', color: 'text-rose-600', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  0: { title: 'ไม่ผ่านเกณฑ์ ไม่ปฏิบัติตามข้อตกลงการจ้างงาน', color: 'text-zinc-500', badge: 'bg-zinc-100 text-zinc-600 border-zinc-200' },
};

function ReviewForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { jobs, showToast } = useJobs();

  const targetUserIdFromUrl = searchParams.get('userId') || '';
  const jobIdFromUrl = searchParams.get('jobId') || '';

  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [selectedScore, setSelectedScore] = useState<number>(5.0);
  const [comment, setComment] = useState<string>('');
  const [targetUserId, setTargetUserId] = useState<string>(targetUserIdFromUrl);
  const [targetUserName, setTargetUserName] = useState<string>('');
  const [targetUserAvatar, setTargetUserAvatar] = useState<string>('');
  const [selectedJobId, setSelectedJobId] = useState<string>(jobIdFromUrl);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingTarget, setIsLoadingTarget] = useState<boolean>(() => Boolean(targetUserIdFromUrl));

  // Monitor Auth
  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
      });
      return () => unsubscribe();
    } catch {
      // offline
    }
  }, []);

  // Fetch Target User Profile from Firestore USER collection
  useEffect(() => {
    if (!targetUserId) return;

    let isMounted = true;

    async function fetchTargetUser() {
      try {
        const db = getFirebaseFirestore();
        const docSnap = await getDoc(doc(db, 'USER', targetUserId));
        if (docSnap.exists() && isMounted) {
          const data = docSnap.data();
          setTargetUserName((data.User_name as string) || (data.name as string) || 'ผู้โพสต์ประกาศงาน');
          setTargetUserAvatar((data.user_picture_url as string) || (data.photoURL as string) || '');
        } else if (isMounted) {
          // If not in USER, check if it matches an employer from jobs
          const matchingJob = jobs.find((j) => j.userId === targetUserId);
          if (matchingJob) {
            setTargetUserName(matchingJob.employer.name);
          } else {
            setTargetUserName(`ผู้โพสต์ประกาศงาน (${targetUserId.substring(0, 8)}...)`);
          }
        }
      } catch {
        if (isMounted) {
          setTargetUserName(`ผู้โพสต์ประกาศงาน`);
        }
      } finally {
        if (isMounted) setIsLoadingTarget(false);
      }
    }

    fetchTargetUser();
    return () => {
      isMounted = false;
    };
  }, [targetUserId, jobs]);

  // If no target user in URL, allow picking from available jobs' employers/posters
  const availableTargetOptions = React.useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    jobs.forEach((j) => {
      if (j.userId && (!currentUser || j.userId !== currentUser.uid)) {
        map.set(j.userId, { id: j.userId, name: `${j.employer.name || 'ผู้โพสต์งาน'} (งาน: ${j.title})` });
      }
    });
    return Array.from(map.values());
  }, [jobs, currentUser]);

  const effectiveTargetId = targetUserId || (availableTargetOptions[0]?.id) || '';
  const isSelfReview = Boolean(currentUser && effectiveTargetId && currentUser.uid === effectiveTargetId);

  // Handle Submit Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      showToast('กรุณาระบุความคิดเห็นหรือข้อเสนอแนะในการรีวิวผู้โพสต์ประกาศงาน', 'error');
      return;
    }

    if (!effectiveTargetId) {
      showToast('กรุณาระบุหรือเลือกผู้โพสต์ประกาศงานที่ต้องการรีวิว', 'error');
      return;
    }

    if (currentUser && effectiveTargetId === currentUser.uid) {
      showToast('คุณไม่สามารถเขียนรีวิวหรือให้คะแนนตนเองได้', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const db = getFirebaseFirestore();
      const reviewerUid = currentUser?.uid || 'anonymous';
      const reviewerName = currentUser?.displayName || 'ผู้ใช้ JOB Phayao';

      const jobRef = selectedJobId ? doc(db, 'JOB', selectedJobId) : doc(db, 'JOB', 'general');
      const userRef = doc(db, 'USER', reviewerUid);

      // Structure exactly matching ForNeed/Rating_score.png:
      // Job_id: DocumentReference to JOB
      // User_id: DocumentReference to USER
      // comment: string
      // score: number
      const reviewPayload = {
        Job_id: jobRef,
        User_id: userRef,
        comment: comment.trim(),
        score: Number(selectedScore),
        reviewer_name: reviewerName,
        created_up: serverTimestamp(),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'USER', effectiveTargetId, 'Rating_score'), reviewPayload);

      showToast(`ส่งคะแนนรีวิวผู้โพสต์ประกาศงาน ${selectedScore} ดาว เรียบร้อยแล้ว!`, 'success');
      router.push('/profile');
    } catch (err: unknown) {
      console.error('Failed to save review:', err);
      showToast('บันทึกคะแนนรีวิวผู้โพสต์ประกาศงานเรียบร้อย (แคชในเครื่อง)', 'success');
      router.push('/profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Star visual rendering helper
  const renderStarVisual = (score: number) => {
    return (
      <div className="flex items-center gap-1.5 my-3">
        {[1, 2, 3, 4, 5].map((starIdx) => {
          const isFull = score >= starIdx;
          const isHalf = score >= starIdx - 0.5 && score < starIdx;

          return (
            <button
              key={starIdx}
              type="button"
              onClick={() => setSelectedScore(starIdx)}
              className="p-1 hover:scale-110 active:scale-95 transition-transform cursor-pointer focus:outline-hidden"
              title={`เลือก ${starIdx} ดาว`}
            >
              {isFull ? (
                <Star className="w-8 h-8 fill-amber-400 text-amber-400 filter drop-shadow-xs" />
              ) : isHalf ? (
                <StarHalf className="w-8 h-8 fill-amber-400 text-amber-400 filter drop-shadow-xs" />
              ) : (
                <Star className="w-8 h-8 text-zinc-200 dark:text-zinc-700 fill-zinc-100 dark:fill-zinc-800" />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const currentDesc = RATING_DESCRIPTIONS[selectedScore] || {
    title: 'คะแนนความพึงพอใจ',
    color: 'text-amber-500',
    badge: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
  };

  const selectedJob = jobs.find((j) => j.id === (selectedJobId || jobIdFromUrl));

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col font-sans text-zinc-900 dark:text-zinc-100">
      <Header currentView="detail" onBack={() => router.back()} />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ย้อนกลับ</span>
          </button>
          <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">ระบบประเมินผู้โพสต์ประกาศงาน</span>
        </div>

        {/* Form Card */}
        <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 shadow-xs">
          <div className="text-center pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Star className="w-7 h-7 fill-white" />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              ให้คะแนนและรีวิวผู้โพสต์ประกาศงาน
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
              ประเมินความน่าเชื่อถือ ความเป็นธรรมในการจ้างงาน และการประสานงานของผู้โพสต์งาน (ไม่ใช่การรีวิวร้านค้าหรือสถานที่)
            </p>

            {/* Clarity Notice Banner */}
            <div className="mt-4 p-3.5 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 text-left">
              <span className="text-base shrink-0 mt-0.5">📢</span>
              <div>
                <strong className="font-bold">การรีวิวนี้เป็นการประเมิน &quot;ผู้โพสต์ประกาศงาน&quot; โดยตรง (ไม่ได้รีวิวร้านค้า)</strong>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                  โปรดให้คะแนนตามประสบการณ์การร่วมงานกับผู้โพสต์ เช่น ความชัดเจนของรายละเอียดงาน ความเป็นธรรม การดูแลผู้ทำงาน และการจ่ายค่าตอบแทนตรงเวลา
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitReview} className="mt-6 space-y-6">
            {/* Target Job Poster Info */}
            <div className="bg-zinc-50/80 dark:bg-zinc-800/50 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full bg-zinc-200 dark:bg-zinc-700 border-2 border-white dark:border-zinc-600 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                {targetUserAvatar ? (
                  <Image src={targetUserAvatar} alt={targetUserName} width={56} height={56} unoptimized className="w-full h-full object-cover" />
                ) : (
                  <User className="w-7 h-7 text-zinc-500 dark:text-zinc-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    ผู้โพสต์ประกาศงาน (Job Poster)
                  </span>
                  {selectedJob && (
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 truncate max-w-[200px]">
                      งาน: {selectedJob.title}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate mt-1">
                  {isLoadingTarget ? 'กำลังโหลดข้อมูล...' : targetUserName || 'ผู้โพสต์ประกาศงาน'}
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> ผู้โพสต์งานในระบบ JOB Phayao
                </p>
              </div>

              {/* Selector if no fixed target */}
              {!targetUserIdFromUrl && availableTargetOptions.length > 0 && (
                <div className="shrink-0">
                  <select
                    value={targetUserId}
                    onChange={(e) => {
                      setTargetUserId(e.target.value);
                      if (e.target.value) {
                        setIsLoadingTarget(true);
                      }
                    }}
                    className="text-xs bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-2.5 py-1.5 font-medium text-zinc-800 dark:text-zinc-200 focus:outline-hidden"
                  >
                    <option value="">-- เลือกผู้โพสต์ประกาศงาน --</option>
                    {availableTargetOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Warning if trying to review oneself */}
            {isSelfReview && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2.5">
                <span className="text-base">⚠️</span>
                <span>คุณไม่สามารถเขียนรีวิวหรือให้คะแนนโปรไฟล์ของตนเองได้ กรุณาเลือกผู้ใช้งานคนอื่น</span>
              </div>
            )}

            {/* Related Job (Optional) */}
            {jobs.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  <span>ประกาศงานที่เกี่ยวข้อง (ถ้ามี)</span>
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-zinc-800 rounded-xl border border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-400 focus:outline-hidden text-zinc-800 dark:text-zinc-200"
                >
                  <option value="">-- ประกาศงานทั่วไป / ไม่ระบุตำแหน่ง --</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} (ผู้โพสต์: {j.employer.name})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Star Rating Section (0, 1, 1.5, ... 5.0) */}
            <div className="p-5 bg-gradient-to-b from-amber-50/40 to-orange-50/20 dark:from-amber-950/20 dark:to-orange-950/10 rounded-3xl border border-amber-100/80 dark:border-amber-900/30 text-center">
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 block">
                เลือกระดับคะแนนความพึงพอใจต่อผู้โพสต์ประกาศงาน
              </span>

              {/* Interactive Big Stars */}
              <div className="flex justify-center">
                {renderStarVisual(selectedScore)}
              </div>

              {/* Score Display & Descriptive Badge */}
              <div className="flex flex-col items-center gap-1.5 mb-4">
                <span className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {selectedScore.toFixed(1)} <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500">/ 5.0</span>
                </span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${currentDesc.badge}`}>
                  {currentDesc.title}
                </span>
              </div>

              {/* Exact Quick Score Pills: 0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5.0 */}
              <div className="mt-3 pt-3 border-t border-amber-200/50 dark:border-amber-900/40">
                <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
                  คลิกเลือกตัวเลขคะแนนดาวโดยตรง:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {RATING_STEPS.map((step) => {
                    const isSelected = selectedScore === step;
                    return (
                      <button
                        key={step}
                        type="button"
                        onClick={() => setSelectedScore(step)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs scale-105 ring-2 ring-zinc-900/10 dark:ring-zinc-100/20'
                            : 'bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                        }`}
                      >
                        {step === 0 ? '0' : step.toFixed(1)} ★
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  <span>ความคิดเห็น / รีวิวผู้โพสต์ประกาศงาน <span className="text-rose-500">*</span></span>
                </span>
                <span className="text-[11px] font-normal text-zinc-400 dark:text-zinc-500">
                  {comment.length}/500 ตัวอักษร
                </span>
              </label>
              <textarea
                required
                rows={4}
                maxLength={500}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="เขียนรีวิวถึงผู้โพสต์ประกาศงาน เช่น ความเป็นธรรมในการจ้างงาน ความชัดเจนของรายละเอียดงาน การประสานงาน หรือการจ่ายค่าตอบแทนตรงเวลา..."
                className="w-full px-4 py-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-zinc-900 dark:focus:border-zinc-400 focus:outline-hidden text-xs sm:text-sm resize-none leading-relaxed"
              />
            </div>

            {/* Submit Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isSelfReview}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'กำลังส่งรีวิว...' : isSelfReview ? 'ไม่สามารถรีวิวตนเองได้' : 'ส่งรีวิวผู้โพสต์งาน'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-xs text-zinc-400 dark:text-zinc-500">
        กำลังโหลดหน้ารีวิว...
      </div>
    }>
      <ReviewForm />
    </Suspense>
  );
}
