import { Job, JobCategory } from '@/types/job';

export interface CategoryOption {
  key: JobCategory;
  label: string;
}

export interface CompensationUnitOption {
  key: Job['salaryUnit'];
  label: string;
}

export const CATEGORY_LABELS: Record<JobCategory, string> = {
  'all': 'ทั้งหมด',
  'part-time': 'พาร์ทไทม์',
  'full-time': 'ประจำ',
  'freelance': 'ฟรีแลนซ์',
  'errand': 'รับหิ้ว/รับส่ง',
  'other': 'ทั่วไป'
};

export const CATEGORY_LIST: CategoryOption[] = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'full-time', label: 'ประจำ' },
  { key: 'freelance', label: 'ฟรีแลนซ์' },
  { key: 'errand', label: 'รับหิ้ว/รับส่ง' },
  { key: 'part-time', label: 'พาร์ทไทม์' }
];

export const COMPENSATION_UNIT_LIST: CompensationUnitOption[] = [
  { key: 'ชั่วโมง', label: 'ต่อชั่วโมง' },
  { key: 'วัน', label: 'ต่อวัน' },
  { key: 'เดือน', label: 'ต่อเดือน' },
  { key: 'งาน', label: 'ต่องาน/รอบ' }
];

