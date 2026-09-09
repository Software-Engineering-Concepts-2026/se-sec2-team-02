# 📝 Antigravity (AGY) Project Audit & Change Log

เอกสารนี้ใช้สำหรับบันทึกการตรวจสอบไฟล์ทั้งหมดในคลังโค้ด (Repository Audit) และบันทึกประวัติการแก้ไขไฟล์ทุกครั้งตามคำสั่ง เพื่อให้สามารถติดตามการเปลี่ยนแปลง (Traceability) ได้อย่างโปร่งใสและเป็นระบบ

---

## 📌 ข้อมูลโปรเจกต์โดยสังเขป (Project Overview)
* **ชื่อโปรเจกต์:** Job Wanted UP (Community Connector)
* **กลุ่มเป้าหมาย:** นิสิตมหาวิทยาลัยพะเยา (ผู้หางานพาร์ตไทม์) และ ผู้ประกอบการ/ร้านค้าแถวมอ (ผู้ประกาศงาน)
* **ทีมงาน (Sec 2 Team 02 - 2 หาร):**
  - นางสาวกมลชนก คำนาค (67020724) — GitHub: `@67020724-glitch`
  - นายญาณาธร ภาชนะ (67020870) — GitHub: `@YanathronPhachana`
  - นายทักษ์ดนัย พรมปัญญา (67020971) — GitHub: `@67020971`
  - นายภูมินทร์ อุ่นคำ (67021163) — GitHub: `@phoomin2005`
* **สถานะคะแนนล่าสุด (อิง `scoring.md` ณ 2026-09-07):**
  - Lab 1: 100% (✅ Full)
  - Lab 2: 50% (⚠️ Partial)
  - Lab 3: 50% (⚠️ Partial — ขาด 5 elements ใน personas และ measurable NFR < 5 ข้อตาม L3.1)
  - Lab 4: 100% (✅ Full)
  - Lab 5: 100% (✅ Full)
  - Lab 6: 50% (⚠️ Partial)
  - Lab 7: 50% (⚠️ Partial)
  - M1: 50% (⚠️ Partial)

---

## 🔍 ผลการตรวจสอบและอ่านไฟล์ทั้งหมด (Comprehensive Codebase Audit)

จากการอ่านและตรวจสอบไฟล์ทั้งหมด 100% ใน Repository สรุปสถานะตามหมวดหมู่ได้ดังนี้:

### 1. หมวดเอกสารข้อมูลทีมและการสะท้อนคิด (Team & Reflections)
* `team/kamonchanok.md`, `team/phoomin.md`, `team/takdanai.md`, `team/yanathron.md`: กรอกข้อมูลครบถ้วน มี Pragmatic Promise และ Broken Window
* `docs/reflections/kamolchanok.md`, `phuoomin.md`, `takdanai.md`, `yanathron.md`: มีการตอบประเด็น Broken Window Theory และ Take Responsibility ครบทั้ง 4 คน
* `AI_USAGE.md`: มีการบันทึกการใช้งาน AI ทั้ง ChatGPT, Claude, และ Antigravity CLI พร้อมระบุ Prompt และสัดส่วน % ที่สร้างโดย AI/มนุษย์
* `reflect.md`: ไฟล์ว่างเปล่า (0 bytes) อยู่ที่ root

### 2. หมวดความต้องการของระบบ (Requirements - Lab 3)
* `docs/requirements/personas.md`: มี 2 personas (น้องมิ้นท์, พี่เอก) แต่ยังขาดองค์ประกอบตามเกณฑ์ 5 Elements (เช่น Goals, Frustrations, Behaviors) ส่งผลให้ Lab 3 ได้คะแนน Partial (50%)
* `docs/requirements/personas/takdanai.md`: มีรายละเอียด Persona ครบถ้วน (ภาพ, Bio, Goals, Frustrations, Tech-savviness)
* `docs/requirements/personas/phuoomin.md`: ไฟล์ว่างเปล่า (0 bytes)
* `docs/requirements/nfr.md`: มี NFR 6 ข้อ (Performance, Security, Scalability, Usability)
* `docs/requirements/scenarios.md`: มี 4 Scenarios ครอบคลุมทั้ง Happy Path และ Edge Cases
* `docs/requirements/user-stories.md`: มี 8 User Stories พร้อม Acceptance Criteria ครบถ้วน
* `docs/requirements/srs.md`: ยังเป็น Template เริ่มต้น (Placeholder) ยังไม่ได้ลงรายละเอียดเต็มรูปแบบ
* `docs/requirements/main_scenario.md`: มีเนื้อหา Main Scenario ของ "แนน"

### 3. หมวดสถาปัตยกรรมและการออกแบบ (Architecture - Lab 5)
* `docs/architecture/c4-context.md`: มี Mermaid Diagram สำหรับ C4 Level 1 (Context)
* `docs/architecture/c4-container.md`: มี Mermaid Diagram สำหรับ C4 Level 2 (Container) เชื่อมโยง Next.js, API & Stats Service และ Firestore
* `docs/architecture/tech_stack.md`: มีตารางเหตุผลการเลือกเทคโนโลยี (Next.js, TypeScript, Firestore, Docker, Firebase Auth) และสิ่งที่พิจารณาแต่ปฏิเสธ (Rejected Alternatives)
* `docs/architecture/adr/0001-monolith-vs-microservices.md`: ADR การเลือก Monolith (Modular Monolith)
* `docs/architecture/adr/001-use-restful-api-internal-commu.md`: ADR การเลือกใช้ RESTful API สำหรับ Internal Communication
* `docs/architecture/uml_models.md`: ยังเป็น Template เริ่มต้น (Placeholder ยังไม่มีภาพ Use Case / Class Diagram จริง)
* `docs/architecture/README.md`: ยังเป็น Placeholder

### 4. หมวด Prototype และการออกแบบ (Prototypes & Design Assets - Lab 4)
* `Design/`: โฟลเดอร์รูปภาพดีไซน์ UI ต้นแบบ ตรวจสอบและอ่านรายละเอียดครบถ้วน:
  - `Homepage.png`: แผนผังหน้าหลัก (Homepage) ประกอบด้วย Navbar (Logo "JOB UP หางานหน้า ม.พะเยา", กล่อง Search, Avatar), Hero Section ("กำลังมองหางานอยู่ใช่ไหม? พร้อมปุ่มเริ่มหางาน"), ส่วนหมวดหมู่งาน (+ เพิ่มงาน, ประจำ, ติวเตอร์, รับหิ้ว/รับส่ง, พาร์ทไทม์), และรายการประกาศล่าสุด 6 การ์ด แสดงตำแหน่งงาน, ค่าตอบแทน, สถานที่, ระยะทาง และปุ่มเปิดรับ
  - `WorkDetail.png`: แผนผังหน้ารายละเอียดประกาศงาน (Job Detail) ประกอบด้วย ปุ่มย้อนกลับ, แกลเลอรีรูปภาพ (ภาพหลัก + 3 ภาพย่อย), ชื่อตำแหน่งงาน, อัตราค่าตอบแทน, วันที่-เวลา, ข้อมูลผู้ประกาศ (คะแนนรีวิว, ปุ่มดูโปรไฟล์), รายละเอียดงาน, คุณสมบัติผู้สมัคร, ช่องทางติดต่อ (LINE, Facebook, เบอร์โทร), ปุ่มสมัครงาน, และแผนที่ตั้งร้านค้าพร้อมปุ่มดู Google Map
* `prototypes/sprint1/index.html` & `kamolchanok_search_prototype.html`: หน้าค้นหาและกรองงาน (Search & Filter) ใช้งานได้จริง มี Mock Data, Modal รายละเอียด, และ UI ตอบสนอง
* `prototypes/sprint1/phuomin_job_detail_prototype.html`: หน้าดูรายละเอียดงาน
* `prototypes/sprint1/takdanai_main_prototype.html`: หน้าหลักระบบ JOB UP
* `prototypes/sprint1/yanathron_prototype.html`: หน้าสร้างประกาศงานใหม่ (Create Job Post)
* `prototypes/sprint1/README.md`: อธิบาย Tracer Bullet Architecture และขอบเขตงาน Sprint 1

### 5. หมวดบริการหลังบ้านและคอนเทนเนอร์ (Services & Docker - Lab 6)
* `Dockerfile`: Multi-stage build สำหรับ Next.js (deps -> builder -> runner)
* `docker/README.md`: เอกสารขั้นตอนการ Build/Run Docker Image `job-up-app`
* `services/stats-service/`:
  - `src/index.ts`: Express + TypeScript API ให้บริการ `/health` และ `/api/stats`
  - `Dockerfile`: Multi-stage build สำหรับ Stats Service
  - `package.json`, `tsconfig.json`: มีครบและพร้อมรัน

### 6. หมวดแอปพลิเคชันหลัก (Next.js App)
* `package.json`: Next.js 16.2.10, React 19.2.4, Tailwind CSS v4, ESLint 9, ติดตั้ง `lucide-react` สำหรับไอคอน
* `next.config.ts`: ตั้งค่า `output: 'standalone'` เรียบร้อย
* `tsconfig.json`: ปรับปรุงโดยเพิ่ม `"services"` ใน `exclude` เพื่อไม่ให้ Next.js type check ข้ามไปยัง Express backend service
* `src/app/page.tsx`: พัฒนาระบบเต็มรูปแบบเชื่อมโยงทุก Component ตาม UI Mockup ในโฟลเดอร์ `Design/`
* `src/types/job.ts`: นิยามประเภทข้อมูล Job, JobCategory, JobApplication
* `src/data/mockJobs.ts`: ชุดข้อมูลประกาศงานจริงรอบ ม.พะเยา ตามดีไซน์
* `src/components/`:
  - `Header.tsx`: Navbar รองรับการค้นหา, สลับโหมดหน้าหลัก/หน้ารายละเอียด, ปุ่มค้นหางานเฉพาะ, ปุ่มโปรไฟล์นิสิต, และปุ่ม + เพิ่มงาน
  - `HeroSection.tsx`: ป้ายต้อนรับและแนะนำการหางานตาม `Design/Homepage.png`
  - `CategoryBar.tsx`: แถบปุ่มกรองหมวดหมู่งาน (ประจำ, ติวเตอร์, รับหิ้ว/รับส่ง, พาร์ทไทม์)
  - `JobCard.tsx`: การ์ดแสดงงานพร้อมระบบกดหัวใจ (Favorite) และปุ่มสถานะเปิดรับ
  - `WorkDetailView.tsx`: หน้ารายละเอียดงานตาม `Design/WorkDetail.png` (Gallery ภาพย่อย, ข้อมูลผู้ประกาศ, ดาวรีวิว, คุณสมบัติ, ช่องทางติดต่อ LINE/FB/Tel, แผนที่ Google Map)
  - `SearchPageView.tsx`: หน้าค้นหาและตัวกรองงานโดยเฉพาะ (Search Page) พร้อมตัวกรองละเอียด (สไลเดอร์ราคา, ระยะทาง, ประเภทงาน, สถานะรับสมัคร, และการจัดเรียง)
  - `ProfileView.tsx`: หน้าโปรไฟล์นิสิต ประกอบด้วย ข้อมูลส่วนตัว (Bio, สถานะยืนยัน, ดาวรีวิว, ช่องทางติดต่อ) และส่วนผลงานแบ่ง 3 หมวด (1. โพสต์ที่เราโพสต์เอง, 2. ผลงานของงานที่เคยทำเสร็จไป, 3. งานที่กำลังทำอยู่)
  - `ApplyModal.tsx`: ฟอร์มยื่นใบสมัครงานสำหรับนิสิต
  - `CreateJobModal.tsx`: ฟอร์มสร้างประกาศงานใหม่พร้อมระบบเลือกธีมภาพ
  - `Toast.tsx`: ระบบแจ้งเตือนผลการกระทำ (Toast Notifications)

### 7. หมวด CI/CD และการทดสอบ (Testing & CI - Lab 7)
* `.github/workflows/ci.yml`: ปัจจุบันมีเพียงจุดไข่ปลา `....` ยังไม่มี Pipeline การรัน Test/Build อัตโนมัติ
* `.github/pull_request_template.md`: อ.กิ๊ก เพิ่ม Template บังคับกรอก Pragmatic Promise และ Tag Reviewer
* `docs/testing/readme.md` & `src/tests/README.md`: ยังเป็นโฟลเดอร์ว่างเปล่า มีเพียงข้อความ placeholder

---

## 📋 บันทึกประวัติการแก้ไขไฟล์ (Change Log)

ทุกการแก้ไขไฟล์ใน Repository จะถูกบันทึกลงในตารางนี้เสมอ:

| ครั้งที่ | วันที่-เวลา | ผู้ดำเนินการ | ไฟล์ที่แก้ไข | วัตถุประสงค์ / รายละเอียดการแก้ไข |
|:---:|:---:|:---:|:---|:---|
| 01 | 2026-09-08 22:25 | Antigravity (AGY) | `agy.md` | สร้างไฟล์ `agy.md` สำหรับบันทึกการตรวจสอบไฟล์ทั้งหมด (Repository Audit) และเตรียมโครงสร้าง Change Log ตามคำสั่งผู้ใช้ |
| 02 | 2026-09-08 22:34 | Antigravity (AGY) | `AI_USAGE.md` | เพิ่มบันทึกการใช้งาน AI ตามหัวข้อ AI Usage Disclosure - Combined Lab, Prompts Used, และ Code Portion Generated & Human Modifications สำหรับการตรวจสอบโค้ดและโฟลเดอร์ `Design/` |
| 03 | 2026-09-08 22:35 | Antigravity (AGY) | `agy.md` | บันทึกรายละเอียดการอ่านและวิเคราะห์ไฟล์ UI Mockup ใน `Design/` (`Homepage.png`, `WorkDetail.png`) และอัปเดตประวัติการแก้ไขไฟล์ใน Change Log |
| 04 | 2026-09-08 22:40 | Antigravity (AGY) | `tsconfig.json` | เพิ่ม `"services"` ใน `exclude` ของ root tsconfig เพื่อแก้ไขปัญหา Next.js type-check ชนกับโมดูลของ backend stats-service ทำให้ build ผ่าน 100% |
| 05 | 2026-09-08 22:41 | Antigravity (AGY) | `package.json`, `package-lock.json` | ติดตั้งไลบรารี `lucide-react` เพื่อใช้ไอคอน UI ตามภาพม็อกอัป `Design/` |
| 06 | 2026-09-08 22:43 | Antigravity (AGY) | `src/types/job.ts`, `src/data/mockJobs.ts`, `src/components/*`, `src/app/page.tsx` | พัฒนาระบบเว็บแอปพลิเคชัน Next.js ตามแบบดีไซน์ `Design/Homepage.png` และ `Design/WorkDetail.png` ครบทั้งหน้าหลัก, หน้ารายละเอียด, ระบบค้นหา/ฟิลเตอร์, โมดัลสมัครงาน และโมดัลเพิ่มงานใหม่ |
| 07 | 2026-09-08 22:45 | Antigravity (AGY) | `AI_USAGE.md` | อัปเดตหัวข้อ Prompt 3 และระบุสัดส่วนโค้ดที่สร้างโดย AI/ปรับปรุงโดยมนุษย์ สำหรับขั้นตอนการพัฒนาเว็บตาม `Design/` |
| 08 | 2026-09-08 22:46 | Antigravity (AGY) | `agy.md` | บันทึกรายละเอียดการอัปเดตโครงสร้างระบบเว็บแอปพลิเคชันและการแก้ไขไฟล์ทั้งหมดลงใน Change Log |
| 09 | 2026-09-08 23:03 | Antigravity (AGY) | `src/components/SearchPageView.tsx`, `src/components/ProfileView.tsx`, `src/components/Header.tsx`, `src/app/page.tsx`, `AI_USAGE.md`, `agy.md` | เพิ่มปุ่มพาไปหน้าค้นหางานเฉพาะ (Search Page) พร้อมตัวกรองครบวงจร และเพิ่มหน้าโปรไฟล์นิสิต (Profile View) แสดงข้อมูลส่วนตัวและผลงาน 3 หมวด (1. โพสต์ที่เราโพสต์เอง, 2. ผลงานที่เคยทำเสร็จไป, 3. งานที่กำลังทำอยู่) |
| 10 | 2026-09-08 23:14 | Antigravity (AGY) | `src/components/CreateJobModal.tsx`, `src/components/ApplyModal.tsx`, `AI_USAGE.md` | ปรับขนาด Modal Popup หน้าสร้างประกาศงานใหม่และหน้ายื่นใบสมัครให้พอดีกับหน้าจอ (กำหนด `max-w-xl`, `max-h-[90vh]`, แยก Header นิ่ง, ฟอร์มเลื่อน Scroll ได้อิสระ, และ Footer ปุ่มกดยึดติดด้านล่าง) ไม่ให้ล้นขอบจอ พร้อมบันทึก Prompt 5 ใน `AI_USAGE.md` |
| 11 | 2026-09-09 00:03 | Antigravity (AGY) | `package.json`, `src/utils/*`, `src/constants/*`, `src/data/mockProfile.ts`, `src/tests/*`, `src/components/*`, `src/app/page.tsx`, `docs/refactoring-journal.md`, `AI_USAGE.md` | ดำเนินการรีแฟกเตอร์โค้ดเพื่อกำจัด Code Smells 6 จุด โดยไม่เพิ่มฟีเจอร์ใหม่ตามเงื่อนไข: 1) ติดตั้ง test runner และเขียน Automated Tests ครอบคลุม 19 การทดสอบ รันผ่านทั้งก่อนและหลังแก้โค้ด 2) รวมฟังก์ชัน `formatDistance` (DRY) 3) รวมฟังก์ชัน `filterJobs`/`sortJobs` 4) ดึงค่าคงที่หมวดหมู่เป็น Single Source of Truth 5) แยก Mock Data ออกจาก `ProfileView.tsx` 6) กำจัด Dead Code (`jobsListRef`, `onBack`) และป้องกัน Unhandled Promise ใน `handleShare` 7) จัดทำเอกสาร `docs/refactoring-journal.md` สมบูรณ์ |
| 12 | 2026-09-09 00:07 | Antigravity (AGY) | `docs/refactoring-journal.md`, `AI_USAGE.md` | อัปเดตเนื้อหาเอกสาร `docs/refactoring-journal.md` ครบถ้วนทั้ง 4 มิติตามคำสั่ง: 1) ระบุส่วนของโค้ดที่แก้ไข 2) การประยุกต์ใช้งาน AI ในกระบวนการ 3) ตารางและตัวอย่างโค้ดเปรียบเทียบก่อน/หลัง (Before vs After) 4) บทเรียนและข้อคิดที่ได้เรียนรู้ (Two Hats Rule, Test Harness, Broken Windows, Pure Functions) |

---

> 💡 **หมายเหตุสำหรับ Antigravity (AGY):** เมื่อใดก็ตามที่มีการสร้าง, แก้ไข หรือลบไฟล์ในโปรเจกต์นี้ ให้ทำการอัปเดตตาราง Change Log ด้านบน พร้อมระบุรายละเอียดการเปลี่ยนแปลงทุกครั้ง
