import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;
let storage: FirebaseStorage | undefined;

if (isFirebaseConfigured) {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
  if (firebaseConfig.storageBucket) {
    storage = getStorage(app);
  }
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

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    throw new Error('กรุณากำหนด NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ในไฟล์ .env.local');
  }

  return storage;
}