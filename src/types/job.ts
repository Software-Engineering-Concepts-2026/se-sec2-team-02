export type JobCategory = 'all' | 'part-time' | 'full-time' | 'freelance' | 'errand' | 'other';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Job {
  id: string;
  userId?: string;
  title: string;
  category: JobCategory;
  categoryLabel: string;
  salary: number;
  salaryUnit: 'ชั่วโมง' | 'วัน' | 'เดือน' | 'งาน';
  location: string;
  coordinates?: Coordinates;
  distance?: number; // distance in meters from UP (optional/deprecated)
  status: 'open' | 'closed';
  date: string;
  time: string;
  images: string[];
  mainImage: string;
  description: string;
  qualifications: {
    openings: number;
    gender: string;
    age: string;
    experience?: string;
    skills?: string[];
  };
  employer: {
    name: string;
    avatar?: string;
    memberSince: string;
    rating: number;
    reviewsCount: number;
    verified?: boolean;
  };
  contact: {
    lineId?: string;
    facebook: string;
    phone: string;
  };
  mapQuery: string;
}

export interface JobApplication {
  jobId: string;
  applicantName: string;
  studentId?: string;
  faculty?: string;
  phone: string;
  freeScheduleNote: string;
  appliedAt: string;
}

export interface ApplicationItem {
  id: string;
  jobId: string;
  applicantUserId: string;
  applicantName: string;
  phone: string;
  freeScheduleNote?: string;
  status: number; // 0 == pending, 1 == accepted, 2 == rejected (per ForNeed/status config.png)
  createdAt?: string;
}

// ==========================================
// Strict Schema from ForNeed Screenshots
// ==========================================

// 1. ForNeed/JOB collection.png
export interface FirestoreJobDocument {
  Job_name: string;
  User_ID: unknown; // DocumentReference to USER
  age: string;
  category: string;
  compensation: number;
  compensation_unit: string;
  created_up: unknown; // Timestamp
  gender: string;
  job_detail: string;
  job_location: unknown; // GeoPoint
  job_picture_url: string;
  openings_number: number;
  status: number; // 0 == waiting for worker, 1 == doing, 2 == done
  updated_up: unknown; // Timestamp
  work_time: string;
}

// 2. ForNeed/JOB_APPLICATION collection.png
export interface FirestoreJobApplicationDocument {
  Job_ID: unknown; // DocumentReference to JOB
  User_ID: unknown; // DocumentReference to USER
  created_up: unknown; // Timestamp
  status: number; // 0 == pending, 1 == accepted, 2 == rejected
  updated_up: unknown; // Timestamp
}

// 3. ForNeed/USER collection.png
export interface FirestoreUserDocument {
  Doing_work: number;
  Finished_work: number;
  Income: number;
  Own_work: number;
  User_info: string;
  User_name: string;
  created_up: unknown; // Timestamp
  email: string;
  facebook: string;
  tel: string;
  updated_up: unknown; // Timestamp
  user_picture_url: string;
}

// 4. ForNeed/Rating_score.png (USER/{userId}/Rating_score)
export interface FirestoreRatingScoreDocument {
  id?: string;
  Job_id: unknown; // DocumentReference to JOB
  User_id: unknown; // DocumentReference to USER
  comment: string;
  score: number;
  created_up?: unknown;
  reviewer_name?: string;
}

export interface ReviewItem {
  id: string;
  score: number;
  comment: string;
  jobId?: string;
  jobTitle?: string;
  reviewerId?: string;
  reviewerName?: string;
  createdAt?: string;
}

// 5. ForNeed/User_location.png (USER/{userId}/User_location)
export interface FirestoreUserLocationDocument {
  location: unknown; // GeoPoint
  location_detail: string;
  location_name: string;
}
