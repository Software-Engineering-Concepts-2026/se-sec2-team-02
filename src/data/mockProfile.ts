export interface UserProfile {
  name: string;
  studentId: string;
  faculty: string;
  major: string;
  campus: string;
  rating: number;
  reviewCount: number;
  phone: string;
  lineId: string;
  email: string;
  bio: string;
}

export interface MyPostedJob {
  id: string;
  title: string;
  category: string;
  wage: string;
  location: string;
  date: string;
  applicantsCount: number;
  status: string;
  description: string;
}

export interface CompletedWork {
  id: string;
  title: string;
  workplace: string;
  period: string;
  earnings: string;
  rating: number;
  reviewText: string;
  employer: string;
  skills: string[];
  image: string;
}

export interface OngoingJob {
  id: string;
  title: string;
  workplace: string;
  startedDate: string;
  currentShift: string;
  status: string;
  progressPercent: number;
  employer: string;
  contact: string;
  taskDescription: string;
}

export const mockUserProfile: UserProfile = {
  name: 'นันทิดา ศรีสุวรรณ (แนน)',
  studentId: '67020870',
  faculty: 'คณะเทคโนโลยีสารสนเทศและการสื่อสาร (ICT)',
  major: 'สาขาวิทยาการคอมพิวเตอร์ ชั้นปีที่ 2',
  campus: 'มหาวิทยาลัยพะเยา (หอพักใน ม.พะเยา)',
  rating: 4.9,
  reviewCount: 18,
  phone: '089-123-4567',
  lineId: 'nan_ict_up',
  email: 'nan.sri@up.ac.th',
  bio: 'นิสิต ม.พะเยา สายขยัน ตรงต่อเวลา หาประสบการณ์การทำงานและรายได้เสริมแบ่งเบาภาระครอบครัว ถนัดงานบริการ คาเฟ่ ช่วยวิจัยคีย์ข้อมูล และรับหิ้วของรอบมอ'
};

export const initialMyPosts: MyPostedJob[] = [
  {
    id: 'mypost-1',
    title: 'หาเพื่อนช่วยคีย์ข้อมูลวิจัยแบบสอบถาม SPSS ด่วน 2 คน',
    category: 'งานพาร์ตไทม์ / ช่วยวิจัย',
    wage: '80 บาท/ชม.',
    location: 'ตึกคณะ ICT ม.พะเยา',
    date: 'โพสต์เมื่อ 2 วันที่แล้ว',
    applicantsCount: 4,
    status: 'open',
    description: 'ต้องการคนช่วยคีย์ข้อมูลแบบสอบถามวิจัยจำนวน 300 ชุด ลง Excel/SPSS ละเอียดรอบคอบ สอนงานให้ 15 นาที'
  },
  {
    id: 'mypost-2',
    title: 'หาคนช่วยรับหิ้วชีทเอกสารสอบ จากร้านถ่ายเอกสารหน้ามอ ส่งที่หอใน',
    category: 'รับหิ้ว/รับส่ง',
    wage: '50 บาท/รอบ',
    location: 'ร้านถ่ายเอกสารหน้า ม.พะเยา -> หอพักนิสิต',
    date: 'โพสต์เมื่อ 5 วันที่แล้ว',
    applicantsCount: 2,
    status: 'closed',
    description: 'รับชีท 3 เล่มจากร้านก๊อปปี้หน้ามอ นำมาส่งให้ที่ใต้หอ 18 ช่วง 19:00 น.'
  }
];

export const mockCompletedWorks: CompletedWork[] = [
  {
    id: 'comp-1',
    title: 'พนักงานบาริสต้าและต้อนรับลูกค้า',
    workplace: 'ร้าน Slow Life Cafe หน้า ม.พะเยา',
    period: '1 พ.ค. 2569 - 25 พ.ค. 2569 (รวม 15 กะ)',
    earnings: '3,600 บาท',
    rating: 5.0,
    reviewText: 'น้องแนนทำงานตรงเวลามาก เรียนรู้สูตรกาแฟไว ยิ้มแย้มต้อนรับลูกค้าดีเยี่ยม ลูกค้าประจำชมเยอะครับ',
    employer: 'พี่ยวยวย (เจ้าของร้าน)',
    skills: ['บาริสต้า', 'งานบริการ', 'จัดการแคชเชียร์ POS'],
    image: '/images/coffee_barista.jpg'
  },
  {
    id: 'comp-2',
    title: 'ผู้ช่วยวิจัยคีย์ข้อมูลและจัดหมวดหมู่เอกสาร',
    workplace: 'สำนักงานคณบดี คณะเทคโนโลยีสารสนเทศ ม.พะเยา',
    period: '10 เม.ย. 2569 - 14 เม.ย. 2569',
    earnings: '1,200 บาท',
    rating: 5.0,
    reviewText: 'ทำงานละเอียดรอบคอบ คีย์ข้อมูลชุดสำรวจ 500 รายการถูกต้อง 100% ส่งงานตามเดดไลน์เป๊ะ',
    employer: 'ดร.สมเกียรติ',
    skills: ['Microsoft Excel', 'Data Entry', 'SPSS เบื้องต้น'],
    image: '/images/data_entry.jpg'
  },
  {
    id: 'comp-3',
    title: 'ติวเตอร์สอนคณิตศาสตร์ O-NET ม.3',
    workplace: 'กุลวงศ์ทาวน์ หน้า ม.พะเยา',
    period: 'กุมภาพันธ์ - มีนาคม 2569 (10 สัปดาห์)',
    earnings: '3,000 บาท',
    rating: 4.8,
    reviewText: 'ครูแนนสอนสนุก ใจเย็น เข้าใจวิธีอธิบายให้น้องเข้าใจง่าย น้องทำคะแนนสอบได้ดีขึ้นมากครับ',
    employer: 'ผู้ปกครองน้องภูมิ',
    skills: ['ทักษะการสื่อสาร', 'การสอนพิเศษ', 'คณิตศาสตร์'],
    image: '/images/tutor_math.jpg'
  }
];

export const mockOngoingJobs: OngoingJob[] = [
  {
    id: 'ong-1',
    title: 'ไรเดอร์รับหิ้วอาหารและพัสดุรอบวิทยาเขต ม.พะเยา',
    workplace: 'UP Delivery Express (เครือข่ายนิสิต)',
    startedDate: 'เริ่มงาน: 1 มิ.ย. 2569',
    currentShift: 'วันนี้ 17:00 น. - 20:00 น.',
    status: 'กำลังปฏิบัติหน้าที่',
    progressPercent: 65,
    employer: 'UP Delivery Network',
    contact: '095-888-9999',
    taskDescription: 'รับออเดอร์ส่งข้าวกล่องจากร้านหน้ามอ ส่งตึก ICT และหอพักนิสิต ทำยอดไปแล้ว 4/6 ออเดอร์ของกะนี้'
  },
  {
    id: 'ong-2',
    title: 'จัดเรียงหนังสือและสื่อการเรียนรู้ ศูนย์หนังสือ ม.พะเยา',
    workplace: 'อาคารสงวนเสริมศรี มหาวิทยาลัยพะเยา',
    startedDate: 'เริ่มงาน: 25 พ.ค. 2569',
    currentShift: 'วันพุธและศุกร์ 13:00 - 17:00 น.',
    status: 'เข้ากะถัดไป: พรุ่งนี้ 13:00 น.',
    progressPercent: 40,
    employer: 'คุณสุภาภรณ์ (หัวหน้าแผนก)',
    contact: '054-466-666 ต่อ 1200',
    taskDescription: 'ตรวจนับสต็อกหนังสือหมวดวิชาศึกษาทั่วไปและจัดขึ้นชั้นวางใหม่อีก 3 ล็อก'
  }
];
