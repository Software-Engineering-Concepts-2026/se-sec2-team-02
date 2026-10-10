/**
 * Test Fixtures for Automated Unit Testing Only
 * (Not used by production application code)
 */
import { Job } from '@/types/job';

export const sampleTestJobs: Job[] = [
  {
    id: 'test-job-01',
    title: 'พนักงานร้านกาแฟ (Barista)',
    category: 'part-time',
    categoryLabel: 'พาร์ทไทม์',
    salary: 45,
    salaryUnit: 'ชั่วโมง',
    location: 'คาเฟ่หน้าพะเยา',
    distance: 800,
    status: 'open',
    date: '2026-05-10',
    time: '18:00 - 22:00 น.',
    mainImage: '/images/coffee_barista.jpg',
    images: ['/images/coffee_barista.jpg'],
    description: 'รับสมัครนิสิตทำงานพาร์ทไทม์ตำแหน่งบาริสต้า ชงกาแฟสด',
    qualifications: {
      openings: 2,
      gender: 'ไม่จำกัดเพศ',
      age: '18 ปีขึ้นไป'
    },
    employer: {
      name: 'ร้านกาแฟเทสต์',
      memberSince: '2026',
      rating: 4.8,
      reviewsCount: 10
    },
    contact: {
      facebook: 'Test Cafe',
      phone: '0812345678'
    },
    mapQuery: 'หน้าพะเยา'
  },
  {
    id: 'test-job-02',
    title: 'ฟรีแลนซ์สอนวิชาคณิตศาสตร์',
    category: 'freelance',
    categoryLabel: 'ฟรีแลนซ์',
    salary: 150,
    salaryUnit: 'ชั่วโมง',
    location: 'หน้าพะเยา',
    distance: 950,
    status: 'open',
    date: '2026-05-12',
    time: '17:00 - 19:00 น.',
    mainImage: '/images/tutor_math.jpg',
    images: ['/images/tutor_math.jpg'],
    description: 'สอนคณิตศาสตร์ ม.ปลาย',
    qualifications: {
      openings: 1,
      gender: 'ไม่จำกัดเพศ',
      age: '18 ปีขึ้นไป'
    },
    employer: {
      name: 'สถาบันเทสต์',
      memberSince: '2026',
      rating: 5.0,
      reviewsCount: 5
    },
    contact: {
      facebook: 'Test Academy',
      phone: '0898765432'
    },
    mapQuery: 'หน้าพะเยา'
  },
  {
    id: 'test-job-03',
    title: 'งานปิดรับสมัครทดสอบ',
    category: 'other',
    categoryLabel: 'อื่นๆ',
    salary: 50,
    salaryUnit: 'ชั่วโมง',
    location: 'ในพะเยา',
    distance: 1200,
    status: 'closed',
    date: '2026-05-01',
    time: '13:00 - 17:00 น.',
    mainImage: '/images/data_entry.jpg',
    images: ['/images/data_entry.jpg'],
    description: 'งานทดสอบสถานะปิดรับสมัคร',
    qualifications: {
      openings: 1,
      gender: 'ไม่จำกัดเพศ',
      age: '18 ปีขึ้นไป'
    },
    employer: {
      name: 'ผู้ว่าจ้างทดสอบ',
      memberSince: '2026',
      rating: 4.0,
      reviewsCount: 2
    },
    contact: {
      facebook: 'Test Closed',
      phone: '0800000000'
    },
    mapQuery: 'ในพะเยา'
  }
];
