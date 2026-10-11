'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, JobApplication, ApplicationItem, JobCategory, Coordinates } from '@/types/job';
import { CATEGORY_LABELS } from '@/constants/categories';
import { getFirebaseAuth, getFirebaseFirestore } from '@/lib/firebase';
import { collection, doc, setDoc, addDoc, deleteDoc, onSnapshot, serverTimestamp, GeoPoint } from 'firebase/firestore';

interface JobContextType {
  jobs: Job[];
  appliedJobs: Set<string>;
  applications: ApplicationItem[];
  addJob: (newJob: Job) => Promise<void>;
  updateJob: (updatedJob: Job) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  applyForJob: (application: JobApplication) => Promise<void>;
  approveApplication: (applicationId: string, jobId: string) => Promise<void>;
  rejectApplication: (applicationId: string) => Promise<void>;
  cancelApplication: (applicationId: string, jobId: string) => Promise<void>;
  getJobById: (id: string) => Job | undefined;
  toast: { message: string; type?: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  hideToast: () => void;
  loading: boolean;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

// Helper to safely extract Document ID from a Firestore DocumentReference or string path
function extractDocId(refOrId: unknown): string {
  if (!refOrId) return '';
  if (typeof refOrId === 'string') {
    const parts = refOrId.split('/');
    return parts[parts.length - 1];
  }
  if (typeof refOrId === 'object' && refOrId !== null && 'id' in refOrId) {
    return String((refOrId as { id: string }).id);
  }
  return String(refOrId);
}

// Helper to safely extract coordinates from GeoPoint or object
function extractCoordinates(loc: unknown, coords: unknown): Coordinates | undefined {
  if (coords && typeof coords === 'object' && 'lat' in coords && 'lng' in coords) {
    const c = coords as { lat: number; lng: number };
    if (!isNaN(Number(c.lat)) && !isNaN(Number(c.lng))) {
      return { lat: Number(c.lat), lng: Number(c.lng) };
    }
  }
  if (loc && typeof loc === 'object' && loc !== null && 'latitude' in loc && 'longitude' in loc) {
    const gp = loc as { latitude: number; longitude: number };
    if (!isNaN(Number(gp.latitude)) && !isNaN(Number(gp.longitude))) {
      return { lat: Number(gp.latitude), lng: Number(gp.longitude) };
    }
  }
  return undefined;
}

// Helper to safely extract location string from a GeoPoint or text
function extractLocationString(loc: unknown): string {
  if (!loc) return 'เมืองพะเยา';
  if (typeof loc === 'string') return loc;
  if (typeof loc === 'object' && loc !== null && 'latitude' in loc && 'longitude' in loc) {
    const gp = loc as { latitude: number; longitude: number };
    return `พิกัด [${gp.latitude.toFixed(4)}° N, ${gp.longitude.toFixed(4)}° E]`;
  }
  return 'เมืองพะเยา';
}

// Map Firestore record matching ForNeed/JOB collection.png & status config.png into client Job
function normalizeFirestoreJob(docId: string, data: Record<string, unknown>): Job {
  const rawCat = String(data.category || '').toLowerCase();
  let category: JobCategory = 'other';
  if (rawCat === 'part-time' || rawCat.includes('พาร์ต') || rawCat.includes('พาร์ท')) {
    category = 'part-time';
  } else if (rawCat === 'full-time' || rawCat.includes('เต็มเวลา')) {
    category = 'full-time';
  } else if (rawCat === 'freelance' || rawCat.includes('ฟรีแลนซ์')) {
    category = 'freelance';
  } else if (rawCat === 'errand' || rawCat.includes('จิปาถะ') || rawCat.includes('ช่วย')) {
    category = 'errand';
  }

  const categoryLabel = (data.categoryLabel as string) || (data.category as string) || CATEGORY_LABELS[category] || 'พาร์ตไทม์';

  // Normalize salary & unit per ForNeed/JOB collection.png
  const salary = Number(data.compensation ?? data.salary ?? 0);
  let salaryUnit: Job['salaryUnit'] = 'วัน';
  const rawUnit = String(data.compensation_unit || data.salaryUnit || '');
  if (rawUnit.includes('ชั่วโมง')) salaryUnit = 'ชั่วโมง';
  else if (rawUnit.includes('เดือน')) salaryUnit = 'เดือน';
  else if (rawUnit.includes('งาน')) salaryUnit = 'งาน';
  else if (rawUnit.includes('วัน')) salaryUnit = 'วัน';

  const title = (data.Job_name as string) || (data.title as string) || 'ประกาศรับสมัครงานทั่วไป';
  const coordinates = extractCoordinates(data.job_location, data.coordinates) || { lat: 19.0284, lng: 99.8970 };
  const location = (data.location as string) || (typeof data.job_location === 'string' ? data.job_location : '') || extractLocationString(data.job_location);
  const mainImage = (data.job_picture_url as string) || (data.mainImage as string) || '/images/coffee_barista.jpg';
  const time = (data.work_time as string) || (data.time as string) || 'ตามตกลง';
  const description = (data.job_detail as string) || (data.description as string) || 'ไม่มีรายละเอียดเพิ่มเติม';

  const qualifications = (typeof data.qualifications === 'object' && data.qualifications !== null ? data.qualifications : {}) as Record<string, unknown>;
  const openings = Number(data.openings_number ?? qualifications.openings ?? 1);
  const gender = (data.gender as string) || (qualifications.gender as string) || 'ไม่จำกัดเพศ';
  const age = (data.age as string) || (qualifications.age as string) || '18 ปีขึ้นไป';

  const employer = (typeof data.employer === 'object' && data.employer !== null ? data.employer : {}) as Record<string, unknown>;
  const contact = (typeof data.contact === 'object' && data.contact !== null ? data.contact : {}) as Record<string, unknown>;

  // Per ForNeed/status config.png:
  // JOB: 0 == waiting for worker (open), 1 == doing, 2 == done
  const rawStatus = data.status;
  const isOpen = rawStatus === 0 || rawStatus === '0' || rawStatus === 'waiting for worker' || rawStatus === 'open' || rawStatus === undefined;

  const userId = extractDocId(data.User_ID || data.userId);

  return {
    id: docId,
    userId,
    title,
    category,
    categoryLabel,
    salary,
    salaryUnit,
    location,
    coordinates,
    status: isOpen ? 'open' : 'closed',
    date: (data.date as string) || 'เริ่มงานได้ทันที',
    time,
    images: Array.isArray(data.images) && data.images.length > 0 ? (data.images as string[]) : [mainImage],
    mainImage,
    description,
    qualifications: {
      openings,
      gender,
      age,
      experience: (qualifications.experience as string) || 'ยินดีรับผู้ไม่มีประสบการณ์',
      skills: Array.isArray(qualifications.skills) ? (qualifications.skills as string[]) : ['มีความรับผิดชอบ', 'ตรงต่อเวลา'],
    },
    employer: {
      name: (employer.name as string) || (data.employerName as string) || 'ผู้ประกอบการพะเยา',
      avatar: (employer.avatar as string) || '',
      memberSince: (employer.memberSince as string) || '2569',
      rating: Number(employer.rating ?? 0),
      reviewsCount: Number(employer.reviewsCount ?? 0),
      verified: employer.verified !== false,
    },
    contact: {
      facebook: (contact.facebook as string) || (data.facebook as string) || 'JOB Phayao',
      phone: (contact.phone as string) || (data.tel as string) || (data.phone as string) || '-',
      lineId: (contact.lineId as string) || (data.lineId as string) || '',
    },
    mapQuery: (data.mapQuery as string) || `${location} พะเยา`,
  };
}

export function JobProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);

  // Real-time synchronization with Firestore collection 'JOB' and 'JOB_APPLICATIONS'
  useEffect(() => {
    let unsubscribeJobs: (() => void) | undefined;
    let unsubscribeApps: (() => void) | undefined;

    // Helper to read cached jobs
    const getLocalCachedJobs = (): Job[] => {
      if (typeof window === 'undefined') return [];
      try {
        const stored = localStorage.getItem('job_wanted_local_jobs');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    };

    // Helper to read cached applications
    const getLocalCachedApps = (): ApplicationItem[] => {
      if (typeof window === 'undefined') return [];
      try {
        const stored = localStorage.getItem('job_wanted_applications');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    };

    // Populate local cached jobs and applications asynchronously to avoid cascading renders
    const timer = setTimeout(() => {
      const initialLocalJobs = getLocalCachedJobs();
      if (initialLocalJobs.length > 0) {
        setJobs(initialLocalJobs);
      }
      const initialLocalApps = getLocalCachedApps();
      if (initialLocalApps.length > 0) {
        setApplications(initialLocalApps);
        setAppliedJobs(new Set(initialLocalApps.map((a) => a.jobId)));
      }
    }, 0);

    try {
      const db = getFirebaseFirestore();

      // 1. Real-time listener for 'JOB' collection
      unsubscribeJobs = onSnapshot(
        collection(db, 'JOB'),
        (snapshot) => {
          const loadedJobs: Job[] = snapshot.docs.map((docSnap) =>
            normalizeFirestoreJob(docSnap.id, docSnap.data())
          );
          
          const localFallback = getLocalCachedJobs();
          const remoteIds = new Set(loadedJobs.map((j) => j.id));
          const uncommitted = localFallback.filter((j) => !remoteIds.has(j.id));

          setJobs([...uncommitted, ...loadedJobs]);
          setLoading(false);
        },
        (err) => {
          console.warn('Firestore onSnapshot listener error or offline:', err);
          const localFallback = getLocalCachedJobs();
          if (localFallback.length > 0) {
            setJobs(localFallback);
          }
          setLoading(false);
        }
      );

      // 2. Real-time listener for 'JOB_APPLICATIONS' collection
      unsubscribeApps = onSnapshot(
        collection(db, 'JOB_APPLICATIONS'),
        (snapshot) => {
          const loadedApps: ApplicationItem[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            const jobId = (data.jobId as string) || extractDocId(data.Job_ID);
            const applicantUserId = (data.applicantUserId as string) || extractDocId(data.User_ID);
            const rawCreatedAt = data.created_up || data.createdAt;
            let formattedDate = 'เร็วๆ นี้';
            if (rawCreatedAt && typeof (rawCreatedAt as { toDate?: () => Date }).toDate === 'function') {
              formattedDate = (rawCreatedAt as { toDate: () => Date }).toDate().toLocaleDateString('th-TH');
            }
            return {
              id: docSnap.id,
              jobId,
              applicantUserId,
              applicantName: (data.applicantName as string) || 'ผู้สมัครงาน',
              phone: (data.phone as string) || (data.tel as string) || '-',
              freeScheduleNote: (data.freeScheduleNote as string) || '',
              status: Number(data.status ?? 0),
              createdAt: formattedDate,
            };
          });

          // Sync appliedJobs Set from user's applications
          try {
            const auth = getFirebaseAuth();
            const currentUid = auth.currentUser?.uid;
            if (currentUid) {
              const userJobIds = loadedApps
                .filter((app) => app.applicantUserId === currentUid)
                .map((app) => app.jobId);
              setAppliedJobs(new Set(userJobIds));
            } else {
              setAppliedJobs((prev) => {
                const combined = new Set(prev);
                loadedApps.forEach((a) => combined.add(a.jobId));
                return combined;
              });
            }
          } catch {
            // ignore
          }

          setApplications(loadedApps);
        },
        (err) => {
          console.warn('JOB_APPLICATIONS onSnapshot error or offline:', err);
          const localApps = getLocalCachedApps();
          if (localApps.length > 0) {
            setApplications(localApps);
          }
        }
      );
    } catch (err) {
      console.warn('Firestore initialization skipped or offline:', err);
      setTimeout(() => {
        const localFallback = getLocalCachedJobs();
        if (localFallback.length > 0) {
          setJobs(localFallback);
        }
        setLoading(false);
      }, 0);
    }

    return () => {
      clearTimeout(timer);
      if (unsubscribeJobs) {
        unsubscribeJobs();
      }
      if (unsubscribeApps) {
        unsubscribeApps();
      }
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const addJob = async (newJob: Job) => {
    let effectiveUserId = newJob.userId;
    if (!effectiveUserId) {
      try {
        const auth = getFirebaseAuth();
        if (auth.currentUser) {
          effectiveUserId = auth.currentUser.uid;
        }
      } catch {
        // offline
      }
    }

    if (!effectiveUserId || effectiveUserId === 'anonymous') {
      showToast('กรุณาเข้าสู่ระบบก่อนเพิ่มประกาศงาน', 'error');
      return;
    }

    // 1. Optimistic UI update
    setJobs((prev) => [newJob, ...prev]);

    // 2. Persist in local storage cache so it doesn't vanish on page reload
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('job_wanted_local_jobs');
        const list: Job[] = stored ? JSON.parse(stored) : [];
        const filtered = list.filter((j) => j.id !== newJob.id);
        localStorage.setItem('job_wanted_local_jobs', JSON.stringify([newJob, ...filtered]));
      }
    } catch {
      // ignore storage error
    }

    try {
      const db = getFirebaseFirestore();
      
      const userRef = doc(db, 'USER', effectiveUserId);
      const lat = Number(newJob.coordinates?.lat ?? 19.0284);
      const lng = Number(newJob.coordinates?.lng ?? 99.8970);
      const geo = new GeoPoint(lat, lng);

      const jobPayload = {
        // EXACT fields from ForNeed/JOB collection.png
        Job_name: newJob.title,
        User_ID: userRef,
        age: newJob.qualifications?.age || '18 ปีขึ้นไป',
        category: newJob.categoryLabel || 'พาร์ตไทม์',
        compensation: Number(newJob.salary),
        compensation_unit: `ต่อ${newJob.salaryUnit}`,
        created_up: serverTimestamp(),
        gender: newJob.qualifications?.gender || 'ไม่จำกัดเพศ',
        job_detail: newJob.description,
        job_location: geo,
        job_picture_url: newJob.mainImage || '',
        openings_number: Number(newJob.qualifications?.openings || 1),
        status: 0, // 0 == waiting for worker (per ForNeed/status config.png)
        updated_up: serverTimestamp(),
        work_time: newJob.time || 'ตามตกลง',

        // Complementary fields for full client compatibility
        title: newJob.title,
        salary: Number(newJob.salary),
        salaryUnit: newJob.salaryUnit,
        location: newJob.location,
        coordinates: { lat, lng },
        userId: effectiveUserId,
        description: newJob.description,
        mainImage: newJob.mainImage || '',
        images: newJob.images || [newJob.mainImage || ''],
        date: newJob.date,
        time: newJob.time,
        qualifications: newJob.qualifications,
        employer: newJob.employer,
        contact: newJob.contact,
        mapQuery: newJob.mapQuery || `${lat},${lng}`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'JOB', newJob.id), jobPayload);
      showToast(`เผยแพร่ประกาศ "${newJob.title}" สำเร็จ!`, 'success');
    } catch (err: unknown) {
      console.error('Failed to sync new job to Firestore:', err);
      const errorObj = err as { code?: string; message?: string };
      if (errorObj?.code === 'permission-denied') {
        showToast('Firestore ปฏิเสธสิทธิ์ (Missing or insufficient permissions): กรุณาอัปเดต Security Rules ใน Firebase Console แล้วกด Publish', 'error');
      } else {
        showToast(`บันทึกข้อมูลไม่สำเร็จ: ${errorObj?.message || 'โปรดตรวจสอบการเชื่อมต่อ'}`, 'error');
      }
    }
  };

  const updateJob = async (updatedJob: Job) => {
    setJobs((prev) => prev.map((j) => (j.id === updatedJob.id ? updatedJob : j)));
    showToast(`อัปเดตประกาศ "${updatedJob.title}" สำเร็จ!`, 'success');

    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('job_wanted_local_jobs');
        const list: Job[] = stored ? JSON.parse(stored) : [];
        localStorage.setItem(
          'job_wanted_local_jobs',
          JSON.stringify(list.map((j) => (j.id === updatedJob.id ? updatedJob : j)))
        );
      }
    } catch {
      // ignore
    }

    try {
      const db = getFirebaseFirestore();
      const lat = Number(updatedJob.coordinates?.lat ?? 19.0284);
      const lng = Number(updatedJob.coordinates?.lng ?? 99.8970);
      const geo = new GeoPoint(lat, lng);

      await setDoc(
        doc(db, 'JOB', updatedJob.id),
        {
          // EXACT fields from ForNeed/JOB collection.png & status config.png
          Job_name: updatedJob.title,
          compensation: Number(updatedJob.salary),
          compensation_unit: `ต่อ${updatedJob.salaryUnit}`,
          job_detail: updatedJob.description,
          job_location: geo,
          work_time: updatedJob.time,
          openings_number: Number(updatedJob.qualifications?.openings || 1),
          gender: updatedJob.qualifications?.gender || 'ไม่จำกัดเพศ',
          age: updatedJob.qualifications?.age || '18 ปีขึ้นไป',
          status: updatedJob.status === 'open' ? 0 : 2, // 0 = waiting for worker, 2 = done
          updated_up: serverTimestamp(),

          // Complementary fields
          title: updatedJob.title,
          salary: Number(updatedJob.salary),
          salaryUnit: updatedJob.salaryUnit,
          description: updatedJob.description,
          time: updatedJob.time,
          location: updatedJob.location,
          coordinates: { lat, lng },
          qualifications: updatedJob.qualifications,
          mapQuery: updatedJob.mapQuery || `${lat},${lng}`,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err: unknown) {
      console.error('Failed to sync job update to Firestore:', err);
      const errorObj = err as { code?: string; message?: string };
      if (errorObj?.code === 'permission-denied') {
        showToast('Firestore ปฏิเสธสิทธิ์: กรุณาอัปเดต Security Rules ใน Firebase Console แล้วกด Publish', 'error');
      }
    }
  };

  const deleteJob = async (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    showToast('ลบประกาศงานเรียบร้อยแล้ว', 'info');

    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('job_wanted_local_jobs');
        const list: Job[] = stored ? JSON.parse(stored) : [];
        localStorage.setItem(
          'job_wanted_local_jobs',
          JSON.stringify(list.filter((j) => j.id !== jobId))
        );
      }
    } catch {
      // ignore
    }

    try {
      const db = getFirebaseFirestore();
      await deleteDoc(doc(db, 'JOB', jobId));
    } catch (err: unknown) {
      console.error('Failed to delete job from Firestore:', err);
      const errorObj = err as { code?: string; message?: string };
      if (errorObj?.code === 'permission-denied') {
        showToast('Firestore ปฏิเสธสิทธิ์ในการลบ: กรุณาอัปเดต Security Rules ใน Firebase Console', 'error');
      }
    }
  };

  const applyForJob = async (application: JobApplication) => {
    let applicantUserId = '';
    try {
      const auth = getFirebaseAuth();
      if (auth.currentUser) {
        applicantUserId = auth.currentUser.uid;
      }
    } catch {
      // offline
    }

    if (!applicantUserId || applicantUserId === 'anonymous') {
      showToast('กรุณาเข้าสู่ระบบก่อนยื่นใบสมัครงาน', 'error');
      return;
    }

    const targetJob = jobs.find((j) => j.id === application.jobId);
    if (targetJob && targetJob.userId && targetJob.userId === applicantUserId) {
      showToast('คุณไม่สามารถสมัครงานที่คุณเป็นผู้ประกาศได้', 'error');
      return;
    }

    const tempId = `app-${Date.now()}`;
    const optimisticApp: ApplicationItem = {
      id: tempId,
      jobId: application.jobId,
      applicantUserId,
      applicantName: application.applicantName,
      phone: application.phone,
      freeScheduleNote: application.freeScheduleNote,
      status: 0, // 0 == pending
      createdAt: 'วันนี้',
    };

    setApplications((prev) => [optimisticApp, ...prev]);
    setAppliedJobs((prev) => new Set(prev).add(application.jobId));
    showToast('ยื่นใบสมัครสำเร็จ! ส่งข้อมูลของคุณไปยังผู้ว่าจ้างเรียบร้อยแล้ว', 'success');

    // Save to local storage cache
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('job_wanted_applications');
        const list: ApplicationItem[] = stored ? JSON.parse(stored) : [];
        localStorage.setItem('job_wanted_applications', JSON.stringify([optimisticApp, ...list]));
      }
    } catch {
      // ignore
    }

    try {
      const db = getFirebaseFirestore();

      const jobRef = doc(db, 'JOB', application.jobId);
      const userRef = doc(db, 'USER', applicantUserId);

      const applicationPayload = {
        // EXACT fields from ForNeed/JOB_APPLICATION collection.png & status config.png
        Job_ID: jobRef,
        User_ID: userRef,
        status: 0, // 0 == pending (per ForNeed/status config.png)
        created_up: serverTimestamp(),
        updated_up: serverTimestamp(),

        // Complementary fields
        jobId: application.jobId,
        applicantUserId,
        applicantName: application.applicantName,
        phone: application.phone,
        freeScheduleNote: application.freeScheduleNote,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'JOB_APPLICATIONS'), applicationPayload);
      setApplications((prev) =>
        prev.map((a) => (a.id === tempId ? { ...a, id: docRef.id } : a))
      );
    } catch (err) {
      console.error('Failed to sync application to Firestore:', err);
    }
  };

  const approveApplication = async (applicationId: string, jobId: string) => {
    // 1. Optimistic update
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === applicationId) return { ...app, status: 1 };
        // Per ForNeed/status config.png: "2 == rejected ก็ต่อเมื่อมีคนอื่นได้รับการ accepted ใบสมัครไปแล้ว"
        if (app.jobId === jobId) return { ...app, status: 2 };
        return app;
      })
    );

    // Optimistic update of job status
    setJobs((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, status: 'closed' } : job))
    );

    showToast('อนุมัติรับผู้สมัครเข้าทำงานเรียบร้อยแล้ว!', 'success');

    // 2. Persist to Firestore
    try {
      const db = getFirebaseFirestore();

      // Update approved application to status: 1 (accepted)
      await setDoc(
        doc(db, 'JOB_APPLICATIONS', applicationId),
        {
          status: 1,
          updated_up: serverTimestamp(),
        },
        { merge: true }
      );

      // Update other applications for this job to status: 2 (rejected)
      const otherApps = applications.filter(
        (app) => app.jobId === jobId && app.id !== applicationId && app.status === 0
      );
      for (const other of otherApps) {
        try {
          await setDoc(
            doc(db, 'JOB_APPLICATIONS', other.id),
            {
              status: 2,
              updated_up: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (e) {
          console.warn('Failed to update rejected applicant:', e);
        }
      }

      // Update JOB document to status: 1 (doing) per ForNeed/status config.png
      await setDoc(
        doc(db, 'JOB', jobId),
        {
          status: 1,
          updated_up: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error('Error approving application in Firestore:', err);
    }
  };

  const rejectApplication = async (applicationId: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? { ...app, status: 2 } : app))
    );
    showToast('ปฏิเสธใบสมัครเรียบร้อยแล้ว', 'info');

    try {
      const db = getFirebaseFirestore();
      await setDoc(
        doc(db, 'JOB_APPLICATIONS', applicationId),
        {
          status: 2,
          updated_up: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error('Error rejecting application in Firestore:', err);
    }
  };

  const cancelApplication = async (applicationId: string, jobId: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== applicationId));
    setAppliedJobs((prev) => {
      const next = new Set(prev);
      next.delete(jobId);
      return next;
    });
    showToast('ยกเลิกใบสมัครเรียบร้อยแล้ว', 'info');

    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('job_wanted_applications');
        if (stored) {
          const list: ApplicationItem[] = JSON.parse(stored);
          localStorage.setItem(
            'job_wanted_applications',
            JSON.stringify(list.filter((a) => a.id !== applicationId))
          );
        }
      }
    } catch {
      // ignore
    }

    try {
      const db = getFirebaseFirestore();
      await deleteDoc(doc(db, 'JOB_APPLICATIONS', applicationId));
    } catch (err) {
      console.error('Error deleting application in Firestore:', err);
    }
  };

  const getJobById = (id: string) => {
    return jobs.find((job) => job.id === id);
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        appliedJobs,
        applications,
        addJob,
        updateJob,
        deleteJob,
        applyForJob,
        approveApplication,
        rejectApplication,
        cancelApplication,
        getJobById,
        toast,
        showToast,
        hideToast,
        loading
      }}
    >
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}
