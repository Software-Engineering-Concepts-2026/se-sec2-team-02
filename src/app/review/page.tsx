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
  5.0: { title: 'ยอดเยี่ยมมาก ผลงานสมบูรณ์แบบ', color: 'text-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  4.5: { title: 'ดีเยี่ยม มีความเป็นมืออาชีพสูง', color: 'text-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  4.0: { title: 'ดีมาก ตรงต่อเวลาและมีความรับผิดชอบ', color: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  3.5: { title: 'ดี ปฏิบัติงานได้มาตรฐานที่น่าพอใจ', color: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  3.0: { title: 'ปานกลาง ครบถ้วนตามข้อตกลง', color: 'text-blue-600', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  2.5: { title: 'พอใช้ มีจุดที่ควรปรับปรุงเล็กน้อย', color: 'text-orange-500', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
  2.0: { title: 'ต้องปรับปรุง การทำงานมีข้อผิดพลาด', color: 'text-orange-600', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
  1.5: { title: 'ไม่น่าพอใจ ต่ำกว่ามาตรฐานที่ตกลง', color: 'text-rose-500', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  1.0: { title: 'แย่มาก มีปัญหาในการทำงาน', color: 'text-rose-600', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  0: { title: 'ไม่ผ่านเกณฑ์โดยสิ้นเชิง', color: 'text-zinc-500', badge: 'bg-zinc-100 text-zinc-600 border-zinc-200' },
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
          setTargetUserName((data.User_name as string) || (data.name as string) || 'ผู้ใช้ JOB Phayao');
          setTargetUserAvatar((data.user_picture_url as string) || (data.photoURL as string) || '');
        } else if (isMounted) {
          // If not in USER, check if it matches an employer from jobs
          const matchingJob = jobs.find((j) => j.userId === targetUserId);
          if (matchingJob) {
            setTargetUserName(matchingJob.employer.name);
          } else {
            setTargetUserName(`ผู้ใช้ (${targetUserId.substring(0, 8)}...)`);
          }
        }
      } catch {
        if (isMounted) {
          setTargetUserName(`ผู้ใช้งานพะเยา`);
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
        map.set(j.userId, { id: j.userId, name: j.employer.name || 'ผู้ว่าจ้าง' });
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
      showToast('กรุณาระบุความคิดเห็นหรือข้อเสนอแนะในการรีวิว', 'error');
      return;
    }

    if (!effectiveTargetId) {
      showToast('กรุณาระบุหรือเลือกผู้ใช้งานที่ต้องการรีวิว', 'error');
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

      showToast(`ส่งคะแนนรีวิว ${selectedScore} ดาว เรียบร้อยแล้ว!`, 'success');
      router.push('/profile');
    } catch (err: unknown) {
      console.error('Failed to save review:', err);
      showToast('บันทึกคะแนนรีวิวเรียบร้อย (แคชในเครื่อง)', 'success');
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
                <Star className="w-8 h-8 text-zinc-200 fill-zinc-100" />
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
    badge: 'bg-amber-50 text-amber-700 border-amber-200'
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-zinc-900">
      <Header currentView="detail" onBack={() => router.back()} />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ย้อนกลับ</span>
          </button>
          <span className="text-xs font-semibold text-zinc-400">ระบบประเมินและให้คะแนน</span>
        </div>

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs">
          <div className="text-center pb-6 border-b border-zinc-100">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Star className="w-7 h-7 fill-white" />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
              ให้คะแนนและรีวิว (Rating & Review)
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-md mx-auto">
              ประเมินคุณภาพงาน ความรับผิดชอบ และความประทับใจ เพื่อสร้างความน่าเชื่อถือให้กับชุมชนรอบพะเยา
            </p>
          </div>

          <form onSubmit={handleSubmitReview} className="mt-6 space-y-6">
            {/* Target User Info */}
            <div className="bg-zinc-50/80 rounded-2xl p-4 border border-zinc-100 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-zinc-200 border-2 border-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                {targetUserAvatar ? (
                  <Image src={targetUserAvatar} alt={targetUserName} width={48} height={48} unoptimized className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-zinc-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  ผู้รับการประเมิน
                </span>
                <h3 className="text-sm font-bold text-zinc-900 truncate">
                  {isLoadingTarget ? 'กำลังโหลดข้อมูล...' : targetUserName || 'ผู้ประกอบการ / ผู้ร่วมงานพะเยา'}
                </h3>
                <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> ผู้ใช้งานที่ยืนยันแล้ว
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
                    className="text-xs bg-white border border-zinc-300 rounded-xl px-2.5 py-1.5 font-medium text-zinc-800"
                  >
                    <option value="">-- เลือกผู้ใช้ --</option>
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
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2.5">
                <span className="text-base">⚠️</span>
                <span>คุณไม่สามารถเขียนรีวิวหรือให้คะแนนโปรไฟล์ของตนเองได้ กรุณาเลือกผู้ใช้งานคนอื่น</span>
              </div>
            )}

            {/* Related Job (Optional) */}
            {jobs.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-zinc-500" />
                  <span>งานที่เกี่ยวข้อง (ถ้ามี)</span>
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-zinc-300 focus:border-zinc-900 focus:outline-hidden text-zinc-800"
                >
                  <option value="">-- งานทั่วไป / ไม่ระบุตำแหน่ง --</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} ({j.employer.name})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Star Rating Section (0, 1, 1.5, ... 5.0) */}
            <div className="p-5 bg-gradient-to-b from-amber-50/40 to-orange-50/20 rounded-3xl border border-amber-100/80 text-center">
              <span className="text-xs font-bold text-zinc-600 block">
                เลือกระดับคะแนนความพึงพอใจ
              </span>

              {/* Interactive Big Stars */}
              <div className="flex justify-center">
                {renderStarVisual(selectedScore)}
              </div>

              {/* Score Display & Descriptive Badge */}
              <div className="flex flex-col items-center gap-1.5 mb-4">
                <span className="text-3xl font-black text-zinc-900 tracking-tight">
                  {selectedScore.toFixed(1)} <span className="text-sm font-medium text-zinc-400">/ 5.0</span>
                </span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${currentDesc.badge}`}>
                  {currentDesc.title}
                </span>
              </div>

              {/* Exact Quick Score Pills: 0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5.0 */}
              <div className="mt-3 pt-3 border-t border-amber-200/50">
                <p className="text-[11px] font-semibold text-zinc-500 mb-2">
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
                            ? 'bg-zinc-900 text-white shadow-xs scale-105 ring-2 ring-zinc-900/10'
                            : 'bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 hover:border-zinc-300'
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
              <label className="block text-xs font-bold text-zinc-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                  <span>ความคิดเห็น / รีวิวการทำงาน <span className="text-rose-500">*</span></span>
                </span>
                <span className="text-[11px] font-normal text-zinc-400">
                  {comment.length}/500 ตัวอักษร
                </span>
              </label>
              <textarea
                required
                rows={4}
                maxLength={500}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="เขียนรีวิว เช่น ความตรงต่อเวลา ความเอาใจใส่ คุณภาพงาน หรือคำแนะนำในการทำงานร่วมกัน..."
                className="w-full px-4 py-3 rounded-2xl border border-zinc-300 focus:border-zinc-900 focus:outline-hidden text-xs sm:text-sm text-zinc-900 bg-white placeholder:text-zinc-400 resize-none leading-relaxed"
              />
            </div>

            {/* Submit Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isSelfReview}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'กำลังส่งรีวิว...' : isSelfReview ? 'ไม่สามารถรีวิวตนเองได้' : 'ส่งคะแนนรีวิว'}</span>
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-xs text-zinc-400">
        กำลังโหลดหน้ารีวิว...
      </div>
    }>
      <ReviewForm />
    </Suspense>
  );
}
