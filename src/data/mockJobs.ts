import { Job } from '@/types/job';

export const initialJobs: Job[] = [
  {
    id: 'job-01',
    title: 'พนักงานร้านกาแฟ (Barista)',
    category: 'part-time',
    categoryLabel: 'พาร์ทไทม์',
    salary: 45,
    salaryUnit: 'ชั่วโมง',
    location: 'คาเฟ่หน้า ม.พะเยา (ร้าน Slow Life Cafe)',
    distance: 800,
    status: 'open',
    date: '10 พ.ค. 2569',
    time: '18:00 น. - 22:00 น.',
    mainImage: '/images/coffee_barista.jpg',
    images: [
      '/images/coffee_barista.jpg',
      '/images/hotpot_server.jpg',
      '/images/bookstore.jpg'
    ],
    description: 'รับสมัครนิสิตทำงานพาร์ทไทม์ตำแหน่งบาริสต้า ชงเครื่องดื่ม จัดเบเกอรี่ และดูแลความเรียบร้อยหน้าร้าน มีใจรักบริการ ยิ้มแย้มแจ่มใส เข้ากับเพื่อนร่วมงานได้ดี หากมีประสบการณ์ชงกาแฟสดหรือทำเบเกอรี่จะพิจารณาเป็นพิเศษ มีสอนงานให้ก่อนเริ่มงานจริง',
    qualifications: {
      openings: 2,
      gender: 'ชาย / หญิง',
      age: '20 ปีขึ้นไป',
      experience: 'มีประสบการณ์ด้านกาแฟจะพิจารณาเป็นพิเศษ (ยินดีรับผู้ไม่มีประสบการณ์)',
      skills: ['มีใจรักงานบริการ', 'ตรงต่อเวลา', 'รักษาความสะอาด']
    },
    employer: {
      name: 'พี่ยวยวย (พี่เอก เจ้าของร้าน)',
      memberSince: '2566',
      rating: 4.8,
      reviewsCount: 23,
      verified: true
    },
    contact: {
      lineId: '@slowlife_up',
      facebook: 'Slow Life Cafe Phayao',
      phone: '089-555-1234'
    },
    mapQuery: 'หน้ามหาวิทยาลัยพะเยา ตำบลแม่กา อำเภอเมืองพะเยา'
  },
  {
    id: 'job-02',
    title: 'ติวเตอร์สอนวิชาคณิตศาสตร์ ม.ปลาย',
    category: 'freelance',
    categoryLabel: 'ฟรีแลนซ์',
    salary: 150,
    salaryUnit: 'ชั่วโมง',
    location: 'โครงการกุลวงศ์ทาวน์ หน้า ม.พะเยา',
    distance: 950,
    status: 'open',
    date: '12 พ.ค. 2569',
    time: '17:00 น. - 19:00 น.',
    mainImage: '/images/tutor_math.jpg',
    images: [
      '/images/tutor_math.jpg',
      '/images/data_entry.jpg',
      '/images/bookstore.jpg'
    ],
    description: 'สอนพิเศษคณิตศาสตร์สำหรับนักเรียนชั้น ม.5-ม.6 เตรียมสอบ A-Level และ TGAT/TPAT สอนกลุ่มย่อย 2 คน บรรยากาศเป็นกันเอง เลือกวันเรียนได้ (สัปดาห์ละ 2 วัน)',
    qualifications: {
      openings: 1,
      gender: 'ไม่จำกัดเพศ',
      age: '19 ปีขึ้นไป',
      experience: 'มีผลการเรียนวิชาคณิตศาสตร์ในเกณฑ์ดี หรือมีประสบการณ์สอน',
      skills: ['สื่อสารเข้าใจง่าย', 'ใจเย็น', 'เตรียมโจทย์ฝึกทำ']
    },
    employer: {
      name: 'ครูนก กุลวงศ์ติวเตอร์',
      memberSince: '2565',
      rating: 4.9,
      reviewsCount: 38,
      verified: true
    },
    contact: {
      lineId: 'tutor_nok_up',
      facebook: 'Kullawong Academy Phayao',
      phone: '081-234-5678'
    },
    mapQuery: 'กุลวงศ์ทาวน์ หน้า ม.พะเยา'
  },
  {
    id: 'job-03',
    title: 'ไรเดอร์รับหิ้ว/รับส่งของ รอบมอ',
    category: 'errand',
    categoryLabel: 'รับหิ้ว/รับส่ง',
    salary: 50,
    salaryUnit: 'ชั่วโมง',
    location: 'รอบวิทยาเขตมหาวิทยาลัยพะเยา',
    distance: 300,
    status: 'open',
    date: 'วันนี้เป็นต้นไป',
    time: '11:00 น. - 14:00 น. และ 17:00 น. - 21:00 น.',
    mainImage: '/images/delivery_rider.jpg',
    images: [
      '/images/delivery_rider.jpg',
      '/images/pet_care.jpg',
      '/images/hotpot_server.jpg'
    ],
    description: 'รับส่งอาหาร พัสดุ เอกสาร และช็อปปิ้งของใช้จากหน้ามอ เข้าหอใน/หอนอก และตึกเรียนต่างๆ คิดค่ารอบเริ่มต้น 30-50 บาท พร้อมทิปจากลูกค้า',
    qualifications: {
      openings: 4,
      gender: 'ไม่จำกัดเพศ',
      age: '18 ปีขึ้นไป',
      experience: 'มีรถจักรยานยนต์ส่วนตัวและใบขับขี่ที่ยังไม่หมดอายุ',
      skills: ['รู้เส้นทางใน ม.พะเยา เป็นอย่างดี', 'ตรงต่อเวลา', 'สุภาพ']
    },
    employer: {
      name: 'เครือข่าย UP Delivery Express',
      memberSince: '2566',
      rating: 4.7,
      reviewsCount: 52,
      verified: true
    },
    contact: {
      lineId: '@up_delivery',
      facebook: 'UP Delivery Hub',
      phone: '095-888-9999'
    },
    mapQuery: 'มหาวิทยาลัยพะเยา อำเภอเมืองพะเยา'
  },
  {
    id: 'job-04',
    title: 'ผู้ช่วยวิจัยคีย์ข้อมูลสถิติ',
    category: 'part-time',
    categoryLabel: 'พาร์ทไทม์',
    salary: 80,
    salaryUnit: 'ชั่วโมง',
    location: 'ตึกคณะ ICT มหาวิทยาลัยพะเยา',
    distance: 100,
    status: 'open',
    date: '15 พ.ค. 2569',
    time: '09:00 น. - 16:00 น. (จัดสรรเวลาได้)',
    mainImage: '/images/data_entry.jpg',
    images: [
      '/images/data_entry.jpg',
      '/images/bookstore.jpg',
      '/images/coffee_barista.jpg'
    ],
    description: 'รวบรวมและคีย์ข้อมูลผลการสำรวจและแบบสอบถามงานวิจัยลงโปรแกรม Microsoft Excel และ Google Sheets ตรวจสอบความถูกต้องของข้อมูล สามารถนำกลับไปทำที่หอพักได้',
    qualifications: {
      openings: 2,
      gender: 'ไม่จำกัดเพศ',
      age: '18 ปีขึ้นไป',
      experience: 'เป็นนิสิต ม.พะเยา สาขาใดก็ได้',
      skills: ['พิมพ์สัมผัสคล่อง', 'ใช้ Excel/Sheets ได้', 'ละเอียดรอบคอบ']
    },
    employer: {
      name: 'ดร.สมเกียรติ (ฝ่ายงานวิจัย ICT)',
      memberSince: '2564',
      rating: 5.0,
      reviewsCount: 15,
      verified: true
    },
    contact: {
      lineId: 'somkiat_research',
      facebook: 'ICT Phayao Research Group',
      phone: '054-466-666 ต่อ 2300'
    },
    mapQuery: 'คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา'
  },
  {
    id: 'job-05',
    title: 'พนักงานประจำร้านสะดวกซื้อ/มินิมาร์ท',
    category: 'full-time',
    categoryLabel: 'ประจำ',
    salary: 55,
    salaryUnit: 'ชั่วโมง',
    location: 'สาขาประตู 1 หน้า ม.พะเยา',
    distance: 400,
    status: 'open',
    date: '1 มิ.ย. 2569',
    time: 'กะเช้า 07:00 - 15:00 น. / กะดึก 23:00 - 07:00 น.',
    mainImage: '/images/hotpot_server.jpg',
    images: [
      '/images/hotpot_server.jpg',
      '/images/bookstore.jpg',
      '/images/coffee_barista.jpg'
    ],
    description: 'ดูแลความสะอาดร้าน คิดเงินที่แคชเชียร์ เติมสินค้าบนชั้นวาง จัดสต็อก และบริการลูกค้า มีเบี้ยขยันและโบนัสรายเดือน เหมาะสำหรับผู้ที่ต้องการงานประจำหรือนิสิตที่สามารถลงกะประจำได้',
    qualifications: {
      openings: 3,
      gender: 'ไม่จำกัดเพศ',
      age: '20 ปีขึ้นไป',
      experience: 'ไม่จำเป็นต้องมีประสบการณ์ มีการฝึกอบรมให้',
      skills: ['ขยัน', 'ซื่อสัตย์', 'มีวินัยในการเข้ากะ']
    },
    employer: {
      name: 'คุณวิชัย (ผู้จัดการร้านมินิมาร์ท)',
      memberSince: '2565',
      rating: 4.6,
      reviewsCount: 19,
      verified: true
    },
    contact: {
      lineId: 'wichai_store',
      facebook: 'Minimart UP Gate 1',
      phone: '086-777-3344'
    },
    mapQuery: 'ประตู 1 มหาวิทยาลัยพะเยา'
  },
  {
    id: 'job-06',
    title: 'พนักงานเสิร์ฟร้านหมูกระทะ',
    category: 'part-time',
    categoryLabel: 'พาร์ทไทม์',
    salary: 45,
    salaryUnit: 'ชั่วโมง',
    location: 'หน้า ม.พะเยา (ร้านแชมป์หมูกระทะ)',
    distance: 1200,
    status: 'closed',
    date: 'ปิดรับสมัครรอบนี้แล้ว',
    time: '17:00 น. - 23:00 น.',
    mainImage: '/images/hotpot_server.jpg',
    images: [
      '/images/hotpot_server.jpg',
      '/images/coffee_barista.jpg',
      '/images/delivery_rider.jpg'
    ],
    description: 'เสิร์ฟอาหารและเครื่องดื่ม เติมน้ำซุป ดูแลเตาถ่าน จัดเก็บโต๊ะอาหาร อาหารเย็นฟรี 1 มื้อ สามารถสลับวันทำงานตามตารางเรียนได้',
    qualifications: {
      openings: 2,
      gender: 'ไม่จำกัดเพศ',
      age: '18 ปีขึ้นไป',
      experience: 'ขยัน อดทน รองรับความเร่งรีบช่วงหัวค่ำได้',
      skills: ['คล่องแคล่ว', 'มนุษยสัมพันธ์ดี']
    },
    employer: {
      name: 'เจ๊หมวย แชมป์หมูกระทะ',
      memberSince: '2566',
      rating: 4.5,
      reviewsCount: 14,
      verified: true
    },
    contact: {
      lineId: 'champ_buffet_up',
      facebook: 'แชมป์หมูกระทะหน้า ม.พะเยา',
      phone: '084-333-2211'
    },
    mapQuery: 'ร้านอาหารหน้ามหาวิทยาลัยพะเยา'
  }
];
