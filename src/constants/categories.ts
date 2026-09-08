import { JobCategory } from '@/types/job';

export interface CategoryOption {
  key: JobCategory;
  label: string;
}

export const CATEGORY_LABELS: Record<JobCategory, string> = {
  'all': 'ทั้งหมด',
  'part-time': 'พาร์ทไทม์',
  'full-time': 'ประจำ',
  'tutor': 'ติวเตอร์',
  'errand': 'รับหิ้ว/รับส่ง',
  'other': 'ทั่วไป'
};

export const CATEGORY_LIST: CategoryOption[] = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'full-time', label: 'ประจำ' },
  { key: 'tutor', label: 'ติวเตอร์' },
  { key: 'errand', label: 'รับหิ้ว/รับส่ง' },
  { key: 'part-time', label: 'พาร์ทไทม์' }
];
