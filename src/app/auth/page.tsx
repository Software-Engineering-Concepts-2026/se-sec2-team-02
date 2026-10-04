'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import styles from './auth.module.css';

type AuthMode = 'login' | 'register';

export default function AuthPage() {
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<AuthMode>('login');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegistering = mode === 'register';

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setMessage('');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (isRegistering && formData.get('password') !== formData.get('confirmPassword')) {
      setMessage('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    const email = String(formData.get('identifier')).trim();
    const password = String(formData.get('password'));

    setIsSubmitting(true);
    setMessage('');

    try {
      const auth = getFirebaseAuth();
      if (isRegistering) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const name = String(formData.get('name')).trim();
        await updateProfile(credential.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/');
    } catch (error) {
      setMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsSubmitting(true);
    setMessage('');
    try {
      await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
      router.push('/');
    } catch (error) {
      setMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordReset() {
    const email = emailInputRef.current?.value.trim() ?? '';
    if (!email) {
      setMessage('กรุณากรอกอีเมลก่อนขอรีเซ็ตรหัสผ่าน');
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email);
      setMessage('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลแล้ว');
    } catch (error) {
      setMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel} aria-labelledby="auth-title">
        <h1 className={styles.brand} id="auth-title">JOB UP</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          {isRegistering && (
            <label className={styles.field}>
              <span>ชื่อ-นามสกุล</span>
              <input autoComplete="name" name="name" placeholder="ระบุชื่อ" required />
            </label>
          )}

          <label className={styles.field}>
            <span>อีเมล</span>
            <input
              autoComplete={isRegistering ? 'email' : 'username'}
              ref={emailInputRef}
              name="identifier"
              type="email"
              placeholder="job up@gmail.com"
              required
            />
          </label>

          <label className={styles.field}>
            <span>รหัสผ่าน</span>
            <input
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
              name="password"
              type="password"
              placeholder="********"
              minLength={8}
              required
            />
          </label>

          {isRegistering && (
            <label className={styles.field}>
              <span>ยืนยันรหัสผ่าน</span>
              <input
                autoComplete="new-password"
                name="confirmPassword"
                type="password"
                placeholder="********"
                minLength={8}
                required
              />
            </label>
          )}

          {!isRegistering && (
            <div className={styles.forgotRow}>
              <button
                className={styles.textButton}
                onClick={handlePasswordReset}
                type="button"
                disabled={isSubmitting}
              >
                ลืมรหัสผ่าน ?
              </button>
            </div>
          )}

          <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'กำลังดำเนินการ...' : isRegistering ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </button>

          <div className={styles.divider} aria-label="หรือ">
            <span />
            <span className={styles.dividerText}>หรือ</span>
            <span />
          </div>

          <button
            className={styles.googleButton}
            onClick={handleGoogleSignIn}
            type="button"
            disabled={isSubmitting}
          >
            <span className={styles.googleMark} aria-hidden="true">G</span>
            {isRegistering ? 'สมัครสมาชิกด้วย Google' : 'เข้าสู่ระบบด้วย Google'}
          </button>

          <p className={styles.status} aria-live="polite">{message}</p>
        </form>

        <p className={styles.switchPrompt}>
          {isRegistering ? 'มีบัญชีอยู่แล้ว ?' : 'ยังไม่มีบัญชี ?'}{' '}
          <button
            className={styles.switchButton}
            onClick={() => switchMode(isRegistering ? 'login' : 'register')}
            type="button"
          >
            {isRegistering ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
          </button>
        </p>
      </section>
    </main>
  );
}

function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof Error) || !('code' in error)) {
    return error instanceof Error ? error.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
  }

  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'อีเมลนี้มีบัญชีอยู่แล้ว';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
    case 'auth/invalid-email':
      return 'รูปแบบอีเมลไม่ถูกต้อง';
    case 'auth/weak-password':
      return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    case 'auth/popup-closed-by-user':
      return 'ยกเลิกการเข้าสู่ระบบด้วย Google แล้ว';
    case 'auth/operation-not-allowed':
      return 'ผู้ให้บริการนี้ยังไม่ได้เปิดใช้งานใน Firebase Console';
    case 'auth/unauthorized-domain':
      return 'กรุณาเพิ่มโดเมนนี้ในรายการ Authorized domains ของ Firebase';
    case 'auth/network-request-failed':
      return 'เชื่อมต่อ Firebase ไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่';
    default:
      return error.message;
  }
}