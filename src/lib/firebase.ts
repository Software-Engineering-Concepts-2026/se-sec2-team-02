import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;

if (isFirebaseConfigured) {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    throw new Error('ตั้งค่า Firebase ไม่ครบ กรุณากำหนดค่าในไฟล์ .env.local');
  }

  return auth;
}

export function getFirebaseFirestore(): Firestore {
  if (!firestore) {
    throw new Error('ตั้งค่า Firebase ไม่ครบ กรุณากำหนดค่าในไฟล์ .env.local');
  }

  return firestore;
}