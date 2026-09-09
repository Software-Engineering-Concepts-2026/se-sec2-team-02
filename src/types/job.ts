export type JobCategory = 'all' | 'part-time' | 'full-time' | 'tutor' | 'errand' | 'other';

export interface Job {
  id: string;
  title: string;
  category: JobCategory;
  categoryLabel: string;
  salary: number;
  salaryUnit: 'ชั่วโมง' | 'วัน' | 'เดือน' | 'งาน';
  location: string;
  distance: number; // distance in meters from UP
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
    lineId: string;
    facebook: string;
    phone: string;
  };
  mapQuery: string;
  isFavorite?: boolean;
}

export interface JobApplication {
  jobId: string;
  applicantName: string;
  studentId: string;
  faculty: string;
  phone: string;
  freeScheduleNote: string;
  appliedAt: string;
}
