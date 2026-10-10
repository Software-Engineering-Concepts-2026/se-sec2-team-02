'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  GeoPoint,
} from 'firebase/firestore';
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { getFirebaseAuth, getFirebaseFirestore } from '@/lib/firebase';

type AuthMode = 'login' | 'register';
type RegisterStep = 1 | 2;

interface FormState {
  name: string;
  identifier: string; // email หรือ username
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
}

const initialFormState: FormState = {
  name: '',
  identifier: '',
  password: '',
  confirmPassword: '',
  phone: '',
  address: '',
};

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [registerStep, setRegisterStep] = useState<RegisterStep>(1);
  const [formData, setFormData] = useState<FormState>(initialFormState);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegistering = mode === 'register';

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setRegisterStep(1);
    setMessage('');
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function getEmailForAuth(input: string): string {
    const trimmed = input.trim();
    if (!trimmed) return '';
    return trimmed.includes('@') ? trimmed : `${trimmed.toLowerCase()}@jobup.com`;
  }

  // ตรวจสอบข้อมูลส่วนที่ 1
  function handleNextStep(e?: React.MouseEvent | React.FormEvent) {
    if (e) e.preventDefault();

    const name = formData.name.trim();
    const identifier = formData.identifier.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name) {
      setMessage('กรุณากรอกชื่อ-นามสกุล');
      setMessageType('error');
      return;
    }
    if (!identifier) {
      setMessage('กรุณากรอกอีเมล หรือ ชื่อผู้ใช้');
      setMessageType('error');
      return;
    }
    if (password.length < 8) {
      setMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
      setMessageType('error');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      setMessageType('error');
      return;
    }

    setMessage('');
    setRegisterStep(2);
  }

  // ส่งข้อมูลเข้าสู่ระบบหรือสมัครสมาชิก
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isRegistering && registerStep === 1) {
      handleNextStep();
      return;
    }

    if (isRegistering && registerStep === 2) {
      if (!formData.phone.trim()) {
        setMessage('กรุณากรอกเบอร์โทรศัพท์');
        setMessageType('error');
        return;
      }
      if (!formData.address.trim()) {
        setMessage('กรุณากรอกที่อยู่สำหรับการติดต่อ');
        setMessageType('error');
        return;
      }
    }

    const emailToAuth = getEmailForAuth(formData.identifier);
    if (!emailToAuth) {
      setMessage('กรุณากรอกอีเมล หรือ ชื่อผู้ใช้');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const auth = getFirebaseAuth();

      if (isRegistering) {
        const credential = await createUserWithEmailAndPassword(
          auth,
          emailToAuth,
          formData.password
        );

        const displayName = formData.name.trim();
        if (displayName) {
          await updateProfile(credential.user, { displayName });
        }

        try {
          const db = getFirebaseFirestore();
          const profilePayload = {
            name: displayName,
            User_name: displayName,
            email: emailToAuth,
            username: formData.identifier.trim(),
            phone: formData.phone.trim(),
            tel: formData.phone.trim(),
            bio: formData.address.trim(),
            User_info: formData.address.trim(),
            address: formData.address.trim(),
            photoURL: '',
            user_picture_url: '',
            Doing_work: 0,
            Finished_work: 0,
            Income: 0,
            Own_work: 0,
            createdAt: serverTimestamp(),
            created_up: serverTimestamp(),
            updatedAt: serverTimestamp(),
            updated_up: serverTimestamp(),
          };

          await Promise.allSettled([
            setDoc(doc(db, 'USER', credential.user.uid), profilePayload, { merge: true }),
            setDoc(doc(db, 'USER', credential.user.uid, 'User_location', 'default'), {
              location: new GeoPoint(19.0284, 99.8970),
              location_detail: formData.address.trim(),
              location_name: 'พะเยา',
            }, { merge: true }),
          ]);
        } catch (dbError) {
          console.warn('Could not save user profile to Firestore:', dbError);
        }
      } else {
        await signInWithEmailAndPassword(auth, emailToAuth, formData.password);
      }

      router.push('/');
    } catch (error) {
      setMessage(getAuthErrorMessage(error));
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsSubmitting(true);
    setMessage('');
    try {
      const cred = await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());

      try {
        const db = getFirebaseFirestore();
        const userRef = doc(db, 'USER', cred.user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          const initialProfile = {
            name: cred.user.displayName || '',
            User_name: cred.user.displayName || '',
            email: cred.user.email || '',
            photoURL: cred.user.photoURL || '',
            user_picture_url: cred.user.photoURL || '',
            phone: '',
            tel: '',
            bio: '',
            User_info: '',
            address: '',
            Doing_work: 0,
            Finished_work: 0,
            Income: 0,
            Own_work: 0,
            createdAt: serverTimestamp(),
            created_up: serverTimestamp(),
            updatedAt: serverTimestamp(),
            updated_up: serverTimestamp(),
          };

          await Promise.allSettled([
            setDoc(doc(db, 'USER', cred.user.uid), initialProfile, { merge: true }),
            setDoc(doc(db, 'USER', cred.user.uid, 'User_location', 'default'), {
              location: new GeoPoint(19.0284, 99.8970),
              location_detail: 'พะเยา',
              location_name: 'พะเยา',
            }, { merge: true }),
          ]);
        }
      } catch (dbError) {
        console.warn('Could not check/create Google profile:', dbError);
      }

      router.push('/');
    } catch (error) {
      setMessage(getAuthErrorMessage(error));
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordReset() {
    const identifier = formData.identifier.trim();
    if (!identifier) {
      setMessage('กรุณากรอกอีเมลในช่องด้านบนก่อนขอรีเซ็ตรหัสผ่าน');
      setMessageType('error');
      return;
    }

    const emailToAuth = getEmailForAuth(identifier);
    setIsSubmitting(true);
    setMessage('');
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), emailToAuth);
      setMessage(`ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง ${emailToAuth} เรียบร้อยแล้ว`);
      setMessageType('success');
    } catch (error) {
      setMessage(getAuthErrorMessage(error));
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-zinc-100/70 to-zinc-200/50 flex flex-col justify-between font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Top Header Bar */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-zinc-900 hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-zinc-900 to-zinc-700 text-white flex items-center justify-center font-black text-sm shadow-2xs">
            JP
          </div>
          <div>
            <div className="font-extrabold text-xl tracking-tight leading-none text-zinc-900">
              JOB Phayao
            </div>
            <div className="text-[11px] font-medium text-zinc-500 mt-0.5">
              ศูนย์รวมงานพาร์ตไทม์ พะเยา
            </div>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 bg-white/80 hover:bg-white px-3.5 py-2 rounded-xl border border-zinc-200/80 shadow-2xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้าหลัก</span>
        </Link>
      </header>

      {/* Main Card Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-xl shadow-zinc-200/60 border border-zinc-200/90 p-6 sm:p-9 transition-all">
          {/* Mode Switcher Tabs */}
          <div className="bg-zinc-100/90 p-1 rounded-2xl flex items-center mb-6 text-sm font-medium">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                !isRegistering
                  ? 'bg-white text-zinc-900 font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              เข้าสู่ระบบ
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                isRegistering
                  ? 'bg-white text-zinc-900 font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              สมัครสมาชิก
            </button>
          </div>

          {/* Card Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              {!isRegistering ? 'เข้าสู่ระบบบัญชีของคุณ' : 'สร้างบัญชีผู้ใช้ใหม่'}
            </h1>
            <p className="text-sm text-zinc-500 mt-1.5">
              {!isRegistering
                ? 'เข้าสู่ระบบเพื่อค้นหางาน หรือจัดการประกาศรับสมัครงาน'
                : 'เริ่มต้นหางานพาร์ตไทม์ หรือโพสต์งานในรั้วพะเยา'}
            </p>
          </div>

          {/* Register Step Progress Indicator */}
          {isRegistering && (
            <div className="mb-6 bg-zinc-50 border border-zinc-200/70 rounded-2xl p-3.5">
              <div className="flex items-center justify-between text-xs font-semibold mb-2.5 px-1">
                <span
                  className={registerStep === 1 ? 'text-zinc-900' : 'text-emerald-600'}
                >
                  {registerStep === 1 ? 'ส่วนที่ 1: ข้อมูลบัญชี' : 'ส่วนที่ 1: เรียบร้อย ✓'}
                </span>
                <span
                  className={registerStep === 2 ? 'text-zinc-900' : 'text-zinc-400'}
                >
                  ส่วนที่ 2: ข้อมูลส่วนตัว
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden flex">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    registerStep === 1 ? 'w-1/2 bg-zinc-900' : 'w-full bg-emerald-500'
                  }`}
                />
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 mt-2.5">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-zinc-200 text-zinc-700 text-[10px] font-bold">
                  {registerStep}
                </span>
                <span>
                  ขั้นตอนที่ {registerStep} จาก 2 (
                  {registerStep === 1 ? 'ข้อมูลสำหรับการเข้าสู่ระบบ' : 'เบอร์โทรศัพท์และที่อยู่'})
                </span>
              </div>
            </div>
          )}

          {/* Status / Error Message Banner */}
          {message && (
            <div
              aria-live="polite"
              className={`mb-5 p-3.5 rounded-2xl text-sm flex items-start gap-2.5 animate-in fade-in duration-150 ${
                messageType === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {messageType === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="flex-1 font-medium leading-relaxed">{message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ======================================================== */}
            {/* PART 1: ACCOUNT CREDENTIALS (OR LOGIN VIEW) */}
            {/* ======================================================== */}
            {(!isRegistering || registerStep === 1) && (
              <>
                {/* Name Field (Register only) */}
                {isRegistering && (
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      ชื่อ-นามสกุล <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        autoComplete="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="ระบุชื่อและนามสกุลจริง"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Identifier (Email or Username) */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    อีเมล หรือ ชื่อผู้ใช้ (Email or Username){' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      autoComplete={isRegistering ? 'email' : 'username'}
                      name="identifier"
                      type="text"
                      value={formData.identifier}
                      onChange={handleInputChange}
                      placeholder="jobup@gmail.com หรือ username"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-zinc-700">
                      รหัสผ่าน <span className="text-rose-500">*</span>
                    </label>
                    {!isRegistering && (
                      <button
                        type="button"
                        onClick={handlePasswordReset}
                        disabled={isSubmitting}
                        className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                      >
                        ลืมรหัสผ่าน ?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      autoComplete={isRegistering ? 'new-password' : 'current-password'}
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="อย่างน้อย 8 ตัวอักษร"
                      minLength={8}
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-700 cursor-pointer"
                      tabIndex={-1}
                      aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Register only) */}
                {isRegistering && (
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      ยืนยันรหัสผ่าน <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        autoComplete="new-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="กรอกรหัสผ่านอีกครั้ง"
                        minLength={8}
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-700 cursor-pointer"
                        tabIndex={-1}
                        aria-label={
                          showConfirmPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit / Next Button */}
                <div className="pt-2">
                  {isRegistering ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                    >
                      <span>ถัดไป: กรอกข้อมูลส่วนตัว (1/2)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-semibold py-3 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>กำลังเข้าสู่ระบบ...</span>
                        </>
                      ) : (
                        <span>เข้าสู่ระบบ</span>
                      )}
                    </button>
                  )}
                </div>

                {/* Google Sign-In Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-zinc-400 font-medium">
                      หรือดำเนินการด้วย
                    </span>
                  </div>
                </div>

                {/* Google Sign-In Button with Full-Color SVG */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full border border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50/80 text-zinc-700 font-medium py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-3 cursor-pointer shadow-2xs active:scale-[0.99]"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="text-sm">
                    {isRegistering ? 'สมัครสมาชิกด้วย Google' : 'เข้าสู่ระบบด้วย Google'}
                  </span>
                </button>
              </>
            )}

            {/* ======================================================== */}
            {/* PART 2: PERSONAL INFORMATION (PHONE & ADDRESS) */}
            {/* ======================================================== */}
            {isRegistering && registerStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
                {/* Phone Field */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    เบอร์โทรศัพท์สำหรับการติดต่อ <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      autoComplete="tel"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="เช่น 081-234-5678"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    เบอร์โทรศัพท์จะถูกนำไปใช้สำหรับติดต่อประสานงาน
                  </p>
                </div>

                {/* Address Field */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    ที่อยู่ หรือ หอพักปัจจุบัน <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3.5 pointer-events-none text-zinc-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="เช่น หอพักหนองระบู หน้าพะเยา หรือ ระบุที่อยู่ของคุณ"
                      rows={3}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400 resize-none"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    ช่วยให้ผู้ว่าจ้างทราบโซนพื้นที่หรือหอพักที่คุณสะดวกเดินทาง
                  </p>
                </div>

                {/* Back and Submit Action Row */}
                <div className="pt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRegisterStep(1);
                      setMessage('');
                    }}
                    disabled={isSubmitting}
                    className="flex-1 border border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>ย้อนกลับ</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-semibold py-3 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>กำลังบันทึก...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>สมัครสมาชิก</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Bottom Switch Prompt */}
          <div className="mt-7 pt-5 border-t border-zinc-100 text-center text-xs text-zinc-500">
            {isRegistering ? (
              <span>
                มีบัญชี JOB Phayao อยู่แล้ว ?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-semibold text-zinc-900 hover:underline cursor-pointer ml-1"
                >
                  เข้าสู่ระบบ
                </button>
              </span>
            ) : (
              <span>
                ยังไม่มีบัญชีใช่หรือไม่ ?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="font-semibold text-zinc-900 hover:underline cursor-pointer ml-1"
                >
                  สมัครสมาชิกใหม่ที่นี่
                </button>
              </span>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-5 text-xs text-zinc-400">
        &copy; {new Date().getFullYear()} JOB Phayao — แพลตฟอร์มหางานพาร์ตไทม์ พะเยา
      </footer>
    </div>
  );
}

function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof Error) || !('code' in error)) {
    return error instanceof Error ? error.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
  }

  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'อีเมลหรือชื่อผู้ใช้นี้ถูกใช้งานแล้วในระบบ กรุณาใช้ชื่ออื่น';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'อีเมล/ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง';
    case 'auth/invalid-email':
      return 'รูปแบบอีเมลหรือชื่อผู้ใช้ไม่ถูกต้อง';
    case 'auth/weak-password':
      return 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร';
    case 'auth/popup-closed-by-user':
      return 'หน้าต่างการเข้าสู่ระบบ Google ถูกปิดก่อนดำเนินการสำเร็จ';
    case 'auth/operation-not-allowed':
      return 'ผู้ให้บริการนี้ยังไม่ได้เปิดใช้งานใน Firebase Console';
    case 'auth/unauthorized-domain':
      return 'กรุณาเพิ่มโดเมนนี้ในรายการ Authorized domains ของ Firebase';
    case 'auth/network-request-failed':
      return 'ไม่สามารถเชื่อมต่อกับ Firebase ได้ กรุณาตรวจสอบอินเทอร์เน็ต';
    default:
      return error.message;
  }
}