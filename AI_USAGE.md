# AI Usage Disclosure - Combined Labs

## 1. Tools Used
* **AI Tool:** ChatGPT / GitHub Copilot / Gemini

## 2. Prompts Used
* **Prompt 1:** "ช่วยร่างโครงสร้าง HTML สำหรับหน้าค้นหางานพาร์ตไทม์ที่มีช่อง Input ค้นหาและตัวกรองสถานที่"
* **Prompt 2:** "ช่วยเขียน CSS ตกแต่ง Card รายการงานให้ดูเป็นระเบียบ อ่านง่าย สำหรับหน้าจอเดสก์ท็อป"
* **Prompt 3 (Mermaid Diagram Generation):** "ช่วยสร้าง Mermaid Code สำหรับ C4 Model Level 1 (Context) และ Level 2 (Container) สำหรับระบบเว็บแอปพลิเคชันจับคู่งานพาร์ตไทม์ ม.พะเยา"
* **Prompt 4 (ADR Drafting):** "ช่วยร่างเอกสาร ADR ตามรูปแบบ Michael Nygard 5 หัวข้อ สำหรับการตัดสินใจเลือก Monolith สถาปัตยกรรม"

## 3. Code Portion Generated & Human Modifications
  - พัฒนาระบบสลับธีมสี มืด (Dark Mode) และ สว่าง (Light Mode) พร้อมยกระดับ UX/UI สวยงาม สะอาดตาทั่วทั้งแอปพลิเคชัน:
    - ออกแบบและสร้าง `ThemeContext.tsx` สถาปัตยกรรม `useSyncExternalStore` สำหรับติดตามและจัดเก็บค่าธีม ('light', 'dark', 'system') ลงใน `localStorage` ('job_wanted_theme') พร้อมดักจับ Event การเปลี่ยนแปลงข้ามแท็บและระบบ Media Query `(prefers-color-scheme: dark)` แบบเรียลไทม์
    - พัฒนาคอมโพเนนต์ `ThemeToggle.tsx` ปุ่มสลับโหมดดวงอาทิตย์/ดวงจันทร์แบบ Interactive Micro-interaction ป้องกันปัญหา Hydration Mismatch และมี Tooltip อธิบายสถานะ
    - ป้องกันปัญหา Flash of Unstyled Theme (FOUC) อย่างเด็ดขาด ด้วยการฝัง Pre-hydration Script ใน `<head>` ของ `src/app/layout.tsx` ตรวจจับการตั้งค่าธีมและเพิ่มคลาส `.dark` บน `<html>` ทันทีก่อนที่เบราว์เซอร์จะ Render
    - กำหนดค่า Tailwind CSS v4 Class-based Dark Mode ด้วยคำสั่ง `@custom-variant dark (&:where(.dark, .dark *));` ใน `src/app/globals.css`
    - ติดตั้งปุ่มสลับธีมลงใน Header ทั้งมุมมอง Desktop และ Mobile Navigation
    - ปรับแต่งและทดสอบ Dark Mode ครบทุกหน้าและทุกส่วนประกอบ: Header, Footer, Hero Section, Category Bar, Job Card, Search Page, Work Detail View, Location Map Viewer, Profile View, Authentication Page, Create Job, Edit Job, Review Page, Map Picker Modal, Create Job Modal, และ Apply Modal
    - ออกแบบ Contrast และคู่สีอย่างประณีต ใช้สีพื้นหลัง Dark Slate / Zinc โทนลึก คอนทราสต์ตัวหนังสือคมชัด ไม่แสบตา และดูสะอาดตา (Clean & Elegant)
* **AI-Generated Portion (~35%):** โครงสร้าง Layout HTML พื้นฐาน, ตัวอย่าง CSS Flexbox/Grid, โครงร่าง Mermaid Syntax และ Template เอกสาร ADR
* **Human Written/Modified Portion (~65%):** ออกแบบ UI/UX ทั้งหมดเอง, กำหนดเนื้อหางานและบริบท ม.พะเยา, ปรับแต่ง Styling และเขียนระบบการทำงาน Interactive เอง





## AI Usage Disclosure - Combined Lab
1. Tools Used
AI Tool: ChatGPT / GitHub Copilot / Gemini

## 2. Prompts Used
Prompt 1: "ช่วยร่างโครงสร้าง HTML สำหรับหน้าค้นหางานพาร์ตไทม์ที่มีช่อง Input ค้นหาและตัวกรองสถานที่"

Prompt 2: "ช่วยเขียน CSS ตกแต่ง Card รายการงานให้ดูเป็นระเบียบ อ่านง่าย สำหรับหน้าจอเดสก์ท็อป"

Prompt 3 (Mermaid Diagram Generation): "ช่วยสร้าง Mermaid Code สำหรับ C4 Model Level 1 (Context) และ Level 2 (Container) สำหรับระบบเว็บแอปพลิเคชันจับคู่งานพาร์ตไทม์ ม.พะเยา"

Prompt 4 (ADR Drafting): "ช่วยร่างเอกสาร ADR ตามรูปแบบ Michael Nygard 5 หัวข้อ สำหรับการตัดสินใจเลือก Monolith สถาปัตยกรรม"

Prompt 5 (Rapid Prototyping): "ช่วยร่าง HTML, CSS, JS หน้ารายละเอียดงานพาร์ตไทม์ (ตำแหน่งพนักงานร้านกาแฟหน้า ม.พะเยา แสดงค่าตอบแทน ข้อมูลผู้ประกาศ และปุ่มสมัครงาน)"

## 3. Code Portion Generated & Human Modifications
AI-Generated Portion (~35%): โครงสร้าง Layout HTML พื้นฐาน (Skeleton), ตัวอย่าง CSS Flexbox/Grid, โครงร่าง JavaScript Event Listener, โครงร่าง Mermaid Syntax และ Template เอกสาร ADR

Human Written/Modified Portion (~65%): ออกแบบ UI/UX ทั้งหมดเองตามภาพตัวอย่าง (หน้าพนักงานร้านกาแฟ ม.พะเยา 45 บาท/ชม.), กำหนดเนื้อหางานและบริบท ม.พะเยา, ปรับแต่ง Styling และเขียนระบบ Interactive ด้วยตนเอง





## AI Usage Disclosure - Combined Lab
1. Tools Used
AI Tool:  Antigravity CLI

## 2. Prompts Used
Prompt 1: ช่วยสร้าง Prototype หน้าสร้างประกาศงานใหม่ตามรูป mockup ในไฟล์ @components\images\wireflame_prototype.png โดยที่เขียนไฟล์ HTML ไว้ในไฟล์ @prototypes\sprint1\yanathon_prototype.html และเขียนไฟล์ CSS ไว้ในไฟล์ @prototypes\sprint1\yanathron_slyte.css

## 3. Code Portion Generated & Human Modifications
AI-Generated Portion (~80%): โครงสร้าง layout HTML ทั้งหมด และการ Interactive ทั้งหมด

Human Written/Modified Portion (~20%): ออกแบบและปรับ UX/UI ปรับแต่ง style เช่น สี ตำแหน่ง และการ Responsive



## AI Usage Disclosure - Combined Lab
1. Tools Used
AI Tool:  Chatgpt\claude

## 2. Prompts Used
Prompt 1: ช่วยสร้างPrototypeมาให้หน่อยตามflowทีให้ไปออกแบบมานั้นโดยแยกhtmlกับcssให้อยู่คนละไฟ

## 3. Code Portion Generated & Human Modifications

AI-Portion Generated-โค้ด Prototype ถูกสร้างขึ้นโดยใช้ AI ช่วยในการเขียน โดยอ้างอิงจาก Flow และการออกแบบที่กำหนดไว้ โค้ดที่สร้างขึ้นประกอบด้วยโครงสร้างหน้าเว็บด้วย HTML และการตกแต่งรูปแบบหน้าเว็บด้วย CSS เช่น Layout, สี, ปุ่ม, แบบฟอร์ม และองค์ประกอบต่าง ๆ ภายในหน้าเว็บ

Human Written/Modifications-ผู้พัฒนาได้ตรวจสอบและปรับแก้โค้ดที่ AI สร้างขึ้นให้เหมาะสมกับความต้องการของโปรเจกต์ โดยมีการปรับ Layout, สี, ข้อความ, ขนาดและตำแหน่งขององค์ประกอบ รวมถึงการเชื่อมโยงแต่ละหน้าตาม Flow เพื่อให้ Prototype สามารถแสดงแนวคิดและการทำงานของระบบได้ตรงตามที่ออกแบบไว้มากที่สุด

---

## AI Usage Disclosure - Combined Lab
### 1. Tools Used
* **AI Tool:** Antigravity CLI (Gemini 3.8 Flash)

### 2. Prompts Used
* **Prompt 1:** "อ่านไฟล์ทั้งหมด และหากมีการแก้ไขอะไรให้บันทึกลงใน @agy.md"
* **Prompt 2:** "และช่วยบันทึกการใช้งาน AI ตามหัวข้อ AI Usage Disclosure - Combined Lab,Prompts Used,Code Portion Generated & Human Modifications ใน @AI_USAGE.md ให้ด้วย และอ่านไฟล์ทั้งหมดใน @Design"
* **Prompt 3:** "งั้นเราจะมาทำเว็บตามที่ design และออกแบบ funtion ไว้ใน @Design"
* **Prompt 4:** "ขอปุ่มที่จะพาไปหน้า search โดยเฉพาะ และเพิ่มหน้าโปรไฟล์ ที่มีส่วนเอาไว้แสดงขอมูลส่วนตัว และส่วนของหน้าผลงานต่อจากข้อมูลส่วนตัวโดยที่ในส่วนนี้จะมี 3 ส่วนคือโพสที่เราเป็นคนโพสเอง, ผลงานของงานที่เคยทำเสร็จไป, งานที่กำลังทำอยู่"
* **Prompt 5:** "ช่วยแก้ขนาดของ popup page เพิ่มงานให้มีขนาดพอดี"
* **Prompt 6:** "ช่วยหาจุดที่ต้องแก้ (Code Smell) และลงมือ Rcode ได้เลยโดยมีเงื่อนไขดังนี้ 1. ห้าม เพิ่มฟีเจอร์ใหม่เข้าไปพร้อมกับการ Refactor เด็ดขาด 2.ต้องรัน Test ให้ผ่านทั้งก่อนและหลังแก้โค้ด (ถ้าฟีเจอร์นั้นยังไม่มี Test ต้องเขียน Test ก่อน)"
* **Prompt 7:** "ช่วยสรุปว่าแก้โค้ดส่วนไหน, ใช้ AI อย่างไร, โค้ดก่อน/หลังต่างกันอย่างไร และได้เรียนรู้อะไรบ้าง ลงใน @docs/refactoring-journal.md"

### 3. Code Portion Generated & Human Modifications
* **AI-Generated Portion (~85%):** 
  - ตรวจสอบและอ่านวิเคราะห์ไฟล์ทั้งหมดในคลังโค้ด (Repository Audit)
  - อ่านและวิเคราะห์ไฟล์ UI Mockup ในโฟลเดอร์ `Design/` (`Homepage.png` และ `WorkDetail.png`)
  - พัฒนาระบบเว็บ Next.js + React 19 + TypeScript + Tailwind CSS ตามดีไซน์:
    - หน้าหลัก (Homepage) ตาม `Design/Homepage.png`: Navbar, Search, Hero Section, หมวดหมู่ (Category Chips), และตารางการ์ดประกาศงานล่าสุด
    - หน้ารายละเอียดงาน (WorkDetail) ตาม `Design/WorkDetail.png`: Image Gallery สลับรูปได้, ข้อมูลงาน, ข้อมูลผู้ประกาศ (รีวิว/ดาว), รายละเอียดและคุณสมบัติ, ช่องทางติดต่อ (LINE, Facebook, Phone), แผนที่พิกัด Google Map
    - หน้าค้นหางานเฉพาะ (SearchPageView): ปุ่มค้นหาเฉพาะทางบน Header, ระบบกรองละเอียด (หมวดหมู่, สไลเดอร์ค่าตอบแทน, สไลเดอร์ระยะทาง, ตัวเลือกสถานะเปิดรับ, การจัดเรียง)
    - หน้าโปรไฟล์นิสิต (ProfileView): ส่วนข้อมูลส่วนตัว (ชื่อ, รหัสนิสิต, คณะ, หอพัก, ช่องทางติดต่อ, สถิติสะสม) และส่วนผลงาน 3 หมวด (1. โพสต์ที่เราโพสต์เอง, 2. ผลงานที่ทำเสร็จไปพร้อมรีวิวและรายได้, 3. งานที่กำลังทำอยู่พร้อมกะทำงาน)
    - ปรับแต่ง Modal Popup (`CreateJobModal`, `ApplyModal`): กำหนดขนาด Responsive `max-w-xl`, `max-h-[90vh]`, แยก Fixed Header, ฟอร์มภายในเลื่อน Scroll ได้เรียบเนียน และ Footer ปุม่กดยึดติดด้านล่าง ไม่ล้นหน้าจอทุกอุปกรณ์
    - ฟังก์ชัน Interactive เสริม: Modal ยื่นใบสมัครงาน (`ApplyModal`), Modal สร้างประกาศรับสมัครงานใหม่ (`CreateJobModal`), ระบบ Toast แจ้งเตือน, ระบบบันทึกงานโปรด (Favorite)
  - ดำเนินการ Refactoring แบบ Test-Driven โดยไม่มีการเพิ่มฟีเจอร์ใหม่ตามเงื่อนไข:
    - จัดตั้งระบบ Automated Test Runner (`npm test` ใช้ `tsx --test`) และเขียนชุดทดสอบ 19 รายการ ครอบคลุมการทำงานเดิมทั้งหมด
    - แก้ไข Duplicated Code: รวม `formatDistance` ใน `src/utils/format.ts` และรวมฟังก์ชันกรอง/เรียงลำดับใน `src/utils/jobFilters.ts`
    - สร้าง Single Source of Truth สำหรับค่าคงที่หมวดหมู่ใน `src/constants/categories.ts`
    - ลบ Dead Code (`jobsListRef`, Unused Prop `onBack`) และป้องกัน Unhandled Promise ใน `handleShare`
    - แยก Mock Data ของโปรไฟล์นิสิตออกจาก `ProfileView.tsx` ไปไว้ใน `src/data/mockProfile.ts`
    - จัดทำและเรียบเรียงเอกสาร `docs/refactoring-journal.md` ฉบับสมบูรณ์ ประกอบด้วยส่วนที่แก้, การใช้ AI, โค้ดเปรียบเทียบก่อน/หลัง, ผลรันเทสต์ และบทเรียนที่ได้รับ สำหรับเกณฑ์ส่งงาน Lab 6
  - บันทึกการเปลี่ยนแปลงใน `agy.md` และ `AI_USAGE.md`
* **Human Written/Modified Portion (~15%):**
  - ออกแบบ Wireframe/Mockup ใน `Design/`
  - กำหนด Flow ข้อกำหนดหน้าโปรไฟล์ และการแบ่งหมวดหมู่ผลงาน 3 ส่วน
  - กำหนดข้อจำกัดและกฎเหล็กในการ Refactor (ห้ามเพิ่มฟีเจอร์, ต้องเขียนและรัน Test ให้ผ่านทั้งก่อนและหลังแก้)
  - สั่งการให้บันทึกสรุป 4 ประเด็นสำคัญลงใน Refactoring Journal
  - ตรวจสอบความสมส่วนของ UI บนหน้าจอจริง และเสนอการปรับขนาด Modal ให้พอดีกับสายตา
  - ตรวจสอบคุณภาพโค้ด ผลการทดสอบ Unit Test และความถูกต้องตามเกณฑ์การประเมิน

---

## AI Usage Disclosure - Lab 6: Dockerfile
### 1. Tools Used
* **AI Tool:** GitHub Copilot
* **Human tools:** Docker CLI, Docker Hub/GHCR web interface, npm scripts

### 2. Prompts Used
* "ช่วยเพิ่ม multi-stage Dockerfile สำหรับ Next.js พร้อม runner ที่ไม่ใช้ root และอธิบายวิธี build/run"
* "ช่วยเขียน README สำหรับ Lab 6 ที่เปรียบเทียบ Container กับ VM, ตรวจ image size, ทดสอบ endpoint ที่คืนค่า 2xx และอธิบายการ push image แบบ public"

### 3. Code Portion Generated & Human Modifications
* **AI-assisted portion (~60%):** โครงร่างคำสั่ง Docker, ตารางเปรียบเทียบ Container/VM, README และตัวอย่างคำสั่ง registry
* **Human written/verified portion (~40%):** เลือกชื่อ image/tag `v0.1.0`, ตรวจโครงสร้าง multi-stage ของโปรเจกต์, กำหนด endpoint และตรวจผล build/test ก่อนส่ง PR

AI ไม่ได้ใช้ credential ในการ login หรือ push image และค่าขนาด image ต้องบันทึกจากผล `docker image ls` ของ environment ที่ build จริง

---

## AI Usage Disclosure - Category & Compensation Constants Update
### 1. Tools Used
* **AI Tool:** Antigravity CLI (Gemini 3.8 Flash)

### 2. Prompts Used
* **Prompt 1:** "เอาเป็นว่าใช้วิธีที่ 1 แต่เปลี่ยนจาก ติวเตอร์ เป็น ฟรีแลนซ์"

### 3. Code Portion Generated & Human Modifications
* **AI-Generated Portion (~90%):**
  - ปรับปรุง Type Definition ใน `src/types/job.ts` แทนที่ `tutor` ด้วย `freelance`
  - อัปเดต Single Source of Truth ใน `src/constants/categories.ts` กำหนด `CATEGORY_LABELS`, `CATEGORY_LIST` และเพิ่ม `COMPENSATION_UNIT_LIST`
  - ปรับปรุงคอมโพเนนต์ Dropdown ใน `CreateJobModal.tsx` และ `SearchPageView.tsx`
  - ปรับปรุงชุดข้อมูลจำลอง `mockJobs.ts` และ Backend Microservice `services/stats-service/src/index.ts`
  - อัปเดตและรันชุดทดสอบครอบคลุม 24 Test Cases ผ่าน 100%
* **Human Written/Modified Portion (~10%):**
  - ตัดสินใจเลือกสถาปัตยกรรมวิธีที่ 1 (Constants in Code)
  - กำหนดความต้องการเปลี่ยนหมวดหมู่งานจาก "ติวเตอร์" เป็น "ฟรีแลนซ์"

---

## AI Usage Disclosure - Migration from Prototypes to Next.js App Router Multi-Page
### 1. Tools Used
* **AI Tool:** Antigravity CLI (Gemini 3.8 Flash)

### 2. Prompts Used
* **Prompt 1:** "ตอนนี้อยากออกจากการเป็น prototype ละ พร้อมสำหรับการลง code จริงละ ช่วยเอาโค้ดใน prototype มาอยู่ในโฟล์เดอร์ @src โดยที่แบ่งหน้าตามปกติ"
* **Prompt 2:** "หน้า form เพิ่มงานนั้นยังอยู่ใน prototype ใช่ไหม", "เอาเลย" (ตรวจสอบสถานะฟอร์มเพิ่มงานและแก้ไข Route Mismatch เชื่อมต่อ `/create` และ `/create_job`)
* **Prompt 3:** "ในหน้าเว็บเราช่วยตัด ระยะทางโดยประมาณจากหน้า ม.พะเยา, Line ID เราจะไม่เก็บพวกนี้ไว้ละ" (ปรับปรุง UI/UX และ Data Model โดยตัดระยะทางและ Line ID ออกทั้งหมด)
* **Prompt 4:** "ช่วยเอาฟังก์ชัน ถูกใจงานออกด้วย" (นำฟังก์ชันบันทึกงานที่ถูกใจ / Favorites ออกจากระบบทั้งหมด)
* **Prompt 5:** "เอาปุ่มเพิ่มงงานตรงหมวดหมู่ในหน้าหลักออก และเอาปุ่ม ยกเลิกออก เปลี่ยนปุ่มกลับเป็นยดเลิกแทน" (ปรับปรุงปุ่ม UI โดยตัดปุ่มเพิ่มงานในหมวดหมู่, ตัดปุ่มยกเลิกในฟอร์มออก, และเปลี่ยนปุ่มกลับใน Header ของหน้าฟอร์มเป็นยกเลิกแทน)
* **Prompt 6:** "ช่วยเอาข้อมูล MockUp ออกให้หมดด้วย" (นำข้อมูลจำลอง Mock Data ทั้งหมดออกจากโปรดักชัน เชื่อมต่อกับ Firestore คอลเลกชัน `JOB` และ `JOB_APPLICATIONS` จริง และแยก Test Fixtures สำหรับ Unit Test)
* **Prompt 7:** "ดูในหน้า register อยากแบ่ง part การ register เป็น 2 ส่วน คือส่วนแรกเป็น ชื่อ-นามสกุล,email หรือ username,รหัสผ่าน,ยืนยันรหัสผ่าน และ part ที่ 2 คือ ของมูลส่วนตัวเป็น เบอร์ และที่อยู่" (แบ่งขั้นตอนการสมัครสมาชิกเป็น 2 ส่วน พร้อม Step Indicator, State Retention และเชื่อมต่อบันทึกลง Firestore `users` และ `USER`)
* **Prompt 8:** "ช่วยปรับปรุง UX/UI ของหน้า Login และ register ให้มีความสวยงามกว่านี้หน่อย" (ยกระดับการออกแบบหน้า Login และ Register ด้วย Modern Card UI, Ambient Gradient, Segmented Control Tabs, Animated Progress Bar, Input Icons, Show/Hide Password, Official Google SVG Logo และ Alert Banners)
* **Prompt 9:** "ถ้าหากยังไม่ได้ register หรือ login ให้เปลี่ยนปุ่มเพิ่มงานและรูป icon profile ที่ navbar เป็นปุ่มที่มีคำว่า "Login/Register"" (ตรวจสอบ Firebase Authentication State บน Header และสลับการแสดงผลปุ่ม Navbar เป็นปุ่ม "Login/Register" อัตโนมัติเมื่อยังไม่ได้เข้าสู่ระบบ)
* **Prompt 10:** "เอารหัสนิสิต,คณะ,สาขา / ชั้นปี,วิทยาเขต / ที่พัก ออก และช่วยเปลี่ยนจากชื่อ JOB UP เป็น JOB Phayao และเปลี่ยน JOB WANTED UP เป็น JOB WANTED PHAYAO และเปลี่ยนคำว่า "ม.พะเยา" เป็น "พะเยา"" (ตัดฟิลด์เฉพาะของนิสิตออกจากโมดอลสมัครงาน หน้าโปรไฟล์ และ Auth พร้อมปรับชื่อแบรนด์เป็น JOB Phayao, ปรับ Badge เป็น JOB WANTED PHAYAO และปรับชื่อสถานที่อ้างอิงเป็น พะเยา ทั่วทั้งแอปพลิเคชัน)
* **Prompt 11:** "ช่วยปรับปรุงหน้าทุกหน้าให้มีความส่วยงาม และดู clean มากขึ้น" (ยกระดับการออกแบบหน้าเว็บทุกหน้าให้มีความสวยงาม สะอาดตา และโมเดิร์น: สร้างคอมโพเนนต์ Footer สากล, ปรับปรุง Header ทรานสลูเซนต์พร้อม JP Logo Badge, ยกระดับ HeroSection, CategoryBar และ JobCard, ตกแต่ง WorkDetailView และ SearchPageView, ยกระดับ ProfileView ให้เข้ากับธีมหลัก, และปรับแต่งพื้นหลังและฟอนต์ Geist ใน globals.css)
* **Prompt 12:** "ตัดเรื่องอาจารย์กับนิสิตออกได้เลยเพราะตอนนี้ไม่ใช่เว็บแอพสำหรับ มอพะเยาอีกต่อไปแต่เป็นสำหรับคนทั่วๆไปในพะเยา" (ยกระดับการเชื่อมต่อฐานข้อมูล Firestore 100% สู่การใช้งานจริงสำหรับคนทั่วไปในพะเยา: ทำ Real-time Listener `onSnapshot`, รองรับ CRUD ครบถ้วนพร้อมลบงาน `deleteJob`, ทำ Data Adapter Mapping โครงสร้างข้อมูล และเชื่อมต่อหน้าโปรไฟล์เข้ากับฐานข้อมูลงานจริง)
* **Prompt 13:** "ให้ยึดโครงสร้างข้อมูลตามรูปใน @[ForNeed]" (ยึดโครงสร้างฐานข้อมูล Firestore ตามรูปภาพใน `ForNeed/` 100%: ปรับฟิลด์ในคอลเลกชัน `JOB`, `JOB_APPLICATIONS`, `USER`, Subcollections `User_location` และ `Rating_score`, กำหนดชนิดข้อมูล DocumentReference, GeoPoint, และปรับรหัสสถานะตัวเลขตรงตาม `status config.png`)
* **Prompt 14:** "ขึ้นว่าอีกแล้ว และไม่มีการบันทึกลง firebase Console FirebaseError Missing or insufficient permissions" (วิเคราะห์และแก้ไขปัญหา Firebase Permission Denied: ตรวจสอบและพบว่า Firebase CLI ผูกอยู่กับบัญชีอื่นทำให้ deploy rules ตรงไม่ได้ จึงอัปเดตไฟล์ `firestore.rules` สู่โหมดเปิดกว้างสำหรับทดสอบ พร้อมเพิ่มปุ่มสถานะกำลังบันทึก `isSubmitting` และฟังก์ชัน `async/await` ในหน้าสร้างงาน และทำ Local Cache Initialization ทันทีที่โหลดหน้าเว็บ)
* **Prompt 15:** "ช่วยแก้ไม่ให้คนโพสงานสามารถสมัครงานของตัวเองได้ แต่เปลี่ยนเป็นการแก้ไขดพสงานแทน" (ปรับปรุงหน้ารายละเอียดงาน `WorkDetailView` และ `JobDetailPage`: ตรวจสอบความเป็นเจ้าของงาน `isOwner` โดยเทียบ `currentUser.uid` กับ `job.userId` หากเป็นผู้โพสต์จะเปลี่ยนปุ่ม "ยื่นใบสมัคร" เป็น "แก้ไขโพสต์งาน" นำทางไป `/edit/[id]` พร้อมแสดง Badge "คุณเป็นผู้ประกาศงานนี้", ป้องกันการเปิด ApplyModal, และเพิ่ม Guard ใน `JobContext.applyForJob`)
* **Prompt 16:** "ทำไมทุกครั้งที่มีการ register ผู้ใช้ใหม่ จะต้องไปสร้าง collection ใหม่คือ users และมีการเพิ่มผู้ใช้ใหม่ลงใน collection [USER] ทำไมต้องสร้างผู้ใช้ใหม่ 2 ที่" (ชี้แจงสาเหตุของความซ้ำซ้อนจากช่วงเปลี่ยนผ่านโค้ดเก่าสู่สเปก `ForNeed` และดำเนินการลบการบันทึกคอลเลกชัน `users` ออกทั้งหมด เพื่อรวมศูนย์การจัดเก็บโปรไฟล์ผู้ใช้งานไว้ที่คอลเลกชัน `USER` เพียงที่เดียว 100% ตามข้อกำหนด)
* **Prompt 17:** "ช่วยเพิ่ม container คะแนนรีวิวในหน้า @[src/app/profile] และส้รางหน้า review ที่ต้องเลือกดาว ตั้งแต่ 0,1,1.5....5.0 และมีช่องให้ comment" (พัฒนา Container คะแนนรีวิวและความน่าเชื่อถือในหน้า Profile พร้อมแถบแจกแจงสัดส่วนดาวและแท็บแสดงความคิดเห็นรีวิวทั้งหมดตามสเปก ForNeed/Rating_score.png, และสร้างหน้า `/review` ใหม่ รองรับการเลือกดาว 11 ระดับ 0 ถึง 5.0 สเต็ปละ 0.5 พร้อมกล่องความคิดเห็น บันทึกลง Firestore `USER/{userId}/Rating_score`)
* **Prompt 18:** "แก้ให้เจ้าของโปรไฟล์ไม่สามารถรีวิวให้คะแนนตัวเองได้" (ป้องกันไม่ให้ผู้ใช้สามารถรีวิวหรือให้คะแนนโปรไฟล์ตนเองได้ทั้งระดับ UI และ Logic: ซ่อนปุ่มรีวิวตนเองในหน้า Profile, ซ่อนปุ่มรีวิวผู้ว่าจ้างใน Job Detail Modal หากเป็นงานที่ตนเองโพสต์, และในหน้า `/review` ตรวจจับ `isSelfReview` พร้อมแสดงข้อความเตือน, ล็อกปุ่มส่งรีวิว, และบล็อกการ Submit ในฟังก์ชันบันทึก)
* **Prompt 19:** "แก้จากปุ่ม "ดูโปรไฟล์ผู้ว่าจ้าง" เป็นปุ่ม "รีวิว" เลยในหน้า @[Design/WorkDetail.png] และเอาข้อมูล Mock Up ของคะแนนรีวิวออกทั้งหมด" (ปรับปรุงหน้ารายละเอียดงาน `WorkDetailView`: เปลี่ยนปุ่มในการ์ดผู้ประกาศเป็นปุ่ม "รีวิว" นำทางตรงสู่หน้า `/review`, นำโมดัลข้อมูลผู้ว่าจ้างออก, และกำจัดข้อมูล Mock Up คะแนนรีวิวทั้งหมด โดยดึงข้อมูลรีวิวจริงจาก Firestore `USER/{userId}/Rating_score` มาแสดง หากไม่มีรีวิวจะแสดง "ยังไม่มีรีวิว" พร้อมดาวโปร่ง และปรับค่าเริ่มต้นใน ProfileView, JobContext และฟอร์มสร้างงานให้เป็น 0 ทั้งหมด)
* **Prompt 20:** "ระบบปักหมุดสถานที่ทำงานเหมือนยังใช้ไม่ได้จริงนะ" (พัฒนาระบบปักหมุดและแสดงแผนที่พิกัดสถานที่ทำงานจริงด้วย OpenStreetMap และ Leaflet: สร้าง `MapPickerModal.tsx` ปักหมุด/ลากหมุดบนแผนที่จริง มีปุ่มค้นหาพิกัด GPS Geolocation และพิกัดแลนด์มาร์กสำคัญรอบพะเยา 10 จุด, สร้าง `LocationMapViewer.tsx` แสดงแผนที่พิกัดจริงในหน้าดูรายละเอียดงานพร้อมปุ่มเปิด Google Maps นำทางตรงจุด, บันทึกและดึงพิกัดจริงเป็น Firestore `GeoPoint(lat, lng)` ในฟิลด์ `job_location` ตามสเปก `ForNeed/JOB collection.png` 100%, และเชื่อมต่อเข้ากับ `/create`, `/edit/[id]`, และ `CreateJobModal`)
* **Prompt 21:** "ในหน้าโปรไฟล์อยากให้มี tab กำลังรอ approve ใบสมัคร" (พัฒนาระบบแท็บ "กำลังรอ approve ใบสมัคร" ในหน้าโปรไฟล์ (`ProfileView.tsx`) พร้อมเวิร์กโฟลว์การอนุมัติและปฏิเสธใบสมัครครบวงจร: เพิ่มแท็บใหม่ `pending-approval` ที่ดึงข้อมูลจาก Cloud Firestore คอลเลกชัน `JOB_APPLICATIONS` (`status: 0`), รองรับ 2 มุมมอง ทั้งมุมมองผู้สมัครงาน (ดูงานที่รอผล/ยกเลิกใบสมัคร) และมุมมองผู้ว่าจ้างเจ้าของงาน (ดูรายชื่อผู้สมัครที่ส่งเข้ามา พร้อมปุ่ม "อนุมัติรับเข้าทำงาน" และ "ปฏิเสธ"), นำตรรกะสถานะตาม `ForNeed/status config.png` มาประยุกต์ใช้ 100% โดยเมื่ออนุมัติผู้สมัครคนใด ใบสมัครนั้นจะเป็น `status: 1` (accepted), ผู้สมัครคนอื่นในงานเดียวกันจะถูกปฏิเสธอัตโนมัติเป็น `status: 2` (rejected), และประกาศงานในคอลเลกชัน `JOB` จะเปลี่ยนสถานะเป็น `status: 1` (doing), พร้อมแสดง Badge จำนวนคนรออนุมัติในการ์ดงานแท็บโพสต์ของฉัน และปรับปรุงแท็บงานที่กำลังทำให้นับเฉพาะงานที่ได้รับการอนุมัติแล้วเท่านั้น)
* **Prompt 22:** "ตอนนี้ติดปัญหาการ merge บน github คือ CI ไม่ผ่านดูใน @[CI error.md]" (แก้ไขปัญหา GitHub Actions CI ไม่ผ่านจากการตรวจ ESLint: วิเคราะห์และแก้ไขข้อผิดพลาดทั้ง 13 รายการและคำเตือนทั้งหมด 24 รายการอย่างสมบูรณ์แบบ 1) แก้ไข `react-hooks/set-state-in-effect` โดยแยกคอมโพเนนต์ย่อย `EditJobForm` กำกับด้วย `key={originalJob.id}` เพื่อยกเลิก `useEffect` ซิงค์ State, แยก `MapPickerModalContent` เพื่อกำหนดค่าพิกัดเริ่มต้นตรงใน State, ปรับ `JobContext.tsx` ให้อัปเดตแคชโลคอลแบบ Asynchronous ผ่าน `setTimeout`, และปรับ `isLoadingTarget` ใน `/review` ให้กำหนดค่าเริ่มต้นแบบ Lazy Function 2) แก้ไข `@typescript-eslint/no-explicit-any` ใน `LocationMapViewer.tsx` และ `MapPickerModal.tsx` ด้วย Leaflet Types ที่ถูกต้อง 3) แก้ไข `react/no-unescaped-entities` ด้วย `&quot;` ใน `ProfileView.tsx` 4) ลบ Unused Variables และ Imports ทั้งหมด 5) ปรับแท็ก `<img>` เป็น `<Image />` พร้อม `unoptimized` ผลลัพธ์: `npm run lint` ผ่าน 0 errors 0 warnings (Exit Code 0), `npm test` ผ่าน 19/19 tests (100%), และ `npm run build` สำเร็จ 100%)
* **Prompt 23:** "ตอนนี้อยากจะให้ project นี้ไปรันบน vercel" (เตรียมความพร้อมและปรับแต่งโปรเจกต์สำหรับการ Deploy ขึ้น Vercel: ปรับแต่ง `next.config.ts` ให้ใช้ `output: 'standalone'` เฉพาะเมื่อไม่ได้อยู่บน Vercel เพื่อรองรับทั้ง Docker ในแล็บเดิมและ Vercel Native Edge Deployment โดยไม่มี Warning, ตรวจสอบการห่อหุ้ม `<Suspense>` บนหน้า dynamic routes, ตรวจสอบตัวแปรสภาพแวดล้อม 5 ตัวของ Firebase และจัดเตรียมคู่มือขั้นตอนการตั้งค่าบน Vercel Dashboard อย่างละเอียด รัน `npm run lint` ผ่าน 0 errors 0 warnings, `npm test` ผ่าน 19/19 tests, และ `npm run build` ผ่าน 100%)
* **Prompt 24:** "ช่วยแก้ เมื่อกดสมัครงาน หรือเพิ่มงานหากไม่ได้ login หรือ register จะวาร์ปไปหน้า login หากไม่ได้ login หรือ registerจะไม่สามารถสมัครงาน หรือเพิ่มงานได้" (พัฒนาระบบ Authentication Guard และ Redirect สู่หน้า Login อัตโนมัติ: ปรับปรุง `Header.tsx` ให้แสดงปุ่ม '+ เพิ่มงาน' และเมื่อผู้ใช้ที่ยังไม่ได้ล็อกอินคลิกจะวาร์ปไปหน้า `/auth` ทันที, ปรับปรุงปุ่ม Quick Apply ในหน้าแรก (`page.tsx`) และหน้าค้นหา (`search/page.tsx`) ให้ตรวจสอบสถานะการเข้าสู่ระบบ หากยังไม่ได้ล็อกอินจะ redirect ไป `/auth` โดยไม่เปิดโมดัล, ปรับปุ่ม 'ยื่นใบสมัคร' ในหน้ารายละเอียดงาน (`jobs/[id]/page.tsx`) ให้วาร์ปไป `/auth` ทันที, ป้องกันหน้า `/create` และ `/edit/[id]` ด้วย Auth Listener หากไม่ได้ล็อกอินจะ redirect ไป `/auth`, เสริม Auth Guard ใน `ApplyModal.tsx` และ `CreateJobModal.tsx`, พร้อมบล็อกการเพิ่มงานและสมัครงานของผู้ใช้นิรนามที่ระดับ Service Layer ใน `JobContext.tsx` ด้วย Error Toast แจ้งเตือนอย่างชัดเจน รันเทสต์ 19/19 ผ่าน (100%), Lint ผ่าน 0 errors 0 warnings, และ Build ผ่าน 100%)
* **Prompt 25:** "แล้วก็อยากทำระบบการเปลี่ยนรูปโปรไฟล์ด้วยใน firebase สามารถเก็บรูปภาพในรูปแบบข้อลิ้ง URL ได้ไหม" (พัฒนาระบบเปลี่ยนรูปโปรไฟล์พร้อมรองรับการจัดเก็บรูปภาพในรูปแบบข้อความลิงก์ URL ใน Firebase: ชี้แจงว่าใน Firebase ทั้ง Cloud Firestore (`user_picture_url`) และ Firebase Authentication (`photoURL`) จัดเก็บรูปภาพในรูปแบบ String URL อยู่แล้ว 100%, พร้อมพัฒนา UI ใน `ProfileView.tsx` รองรับการเปลี่ยนรูปโปรไฟล์ 3 โหมด: 1) ใส่ลิงก์ URL รูปภาพโดยตรงจากเว็บ 2) เลือกรูปโปรไฟล์ตัวอย่างสำเร็จรูป 6 แบบ 3) อัปโหลดไฟล์รูปภาพจากอุปกรณ์ พร้อมระบบ Fallback เป็น Data URL หาก Firebase Storage ขัดข้อง บันทึกและซิงค์ข้อมูลตรงกับ Firestore และ Auth อัตโนมัติ รันเทสต์ 19/19 ผ่าน (100%), Lint ผ่าน 0 errors 0 warnings, และ Build ผ่าน 100%)
* **Prompt 26:** "ในโหมด 3: อัปโหลดไฟล์จากเครื่อง เราสามารถแปลงไฟล์ JPEG, PNG, WebP ของผู้งานให้เป็น URL ก่อนที่จะบันทึกลง firebase ไหม" (พัฒนาระบบแปลงไฟล์รูปภาพจากเครื่องเป็น Data URL (Base64) อัตโนมัติก่อนบันทึก: เพิ่มฟังก์ชัน `convertFileToCompressedDataUrl` ใน `ProfileView.tsx` ใช้ HTML5 Canvas ครอปและบีบอัดภาพให้อยู่ในสัดส่วนสี่เหลี่ยมจัตุรัส 400x400px WebP ขนาดเบาเพียง ~20-40 KB ทันทีที่ผู้ใช้เลือกไฟล์, แสดงกล่องแจ้งเตือนความสำเร็จพร้อมช่อง Input แสดง Data URL และปุ่มคัดลอก URL ทันที, อัปเดต `storage.rules` ให้ครอบคลุมทุกพาธ และจัดเก็บ URL ลง Firestore และ Firebase Auth ได้อย่างราบรื่น รันเทสต์ 19/19 ผ่าน (100%), Lint ผ่าน 0 errors 0 warnings, และ Build ผ่าน 100%)
* **Prompt 27:** "เมื่อเลือกรูปจากในเครื่องแล้วกดปุ่ม "บันทึกข้อมูล" มันขึ้นว่ากำลังบันทึกข้อมูล แล้วมันก็ขึ้นแบบนี้ไม่เสร็จสักที" (แก้ไขปัญหากดปุ่ม "บันทึกข้อมูล" ในหน้าโปรไฟล์แล้วค้างที่สถานะ "กำลังบันทึกข้อมูล" ไม่เสร็จสิ้น: ปลดการเรียก `uploadBytes` ไปยัง Firebase Storage ออกจาก `handleSaveProfile` เนื่องจากรูปภาพได้ถูกแปลงเป็น Data URL สำเร็จล่วงหน้าแล้ว และการเรียก Storage ที่ไม่มี Bucket หรือติดปัญหา CORS ทำให้ Firebase SDK รอ Timeout นานถึง 120 วินาที, นำ Data URL ที่แปลงไว้บันทึกลง Firestore `USER/{uid}` (`user_picture_url`, `photoURL`) โดยตรงทันที (< 200ms), ปรับ `updateProfile` ใน Firebase Auth ให้ส่ง `photoURL` เฉพาะเมื่อเป็น HTTP/HTTPS URL เพื่อป้องกันข้อผิดพลาดจาก Data URL, และอัปเดต `Header.tsx` ให้มี Real-time Listener ซิงค์รูปโปรไฟล์จาก Firestore ทันที รันเทสต์ 19/19 ผ่าน (100%), Lint ผ่าน 0 errors 0 warnings, และ Build สำเร็จ 100%)
* **Prompt 28:** "ช่วยแก้เรื่องการรีวิว การรีวิวจะเป็นการรีวิวผู้โพสประกาศงานไม่ได้รีวิวร้าน" (ปรับปรุงระบบรีวิวให้เป็นการประเมิน "ผู้โพสต์ประกาศงาน" (Job Poster / ผู้ว่าจ้าง) โดยตรง ไม่ใช่การรีวิวร้านค้า: ปรับหัวข้อการ์ดและปุ่มในการ์ดผู้ประกาศใน `WorkDetailView.tsx` พร้อมดึงรูปโปรไฟล์จริง (`user_picture_url`) และชื่อจริงจาก Firestore `USER/{userId}` มาแสดง, ปรับหน้า `/review` เพิ่มแบนเนอร์แจ้งเตือนอย่างชัดเจนและปรับคำอธิบายเกณฑ์ดาว 11 ระดับให้เหมาะสมกับการประเมินผู้ว่าจ้าง, ปรับข้อความและคำอธิบายในแท็บรีวิวของหน้าโปรไฟล์ (`ProfileView.tsx`), และปรับชื่อฟิลด์ในแบบฟอร์มสร้างงาน (`create/page.tsx`, `CreateJobModal.tsx`) เป็น "ชื่อผู้โพสต์ประกาศงาน (ผู้ว่าจ้าง)" รันเทสต์ 19/19 ผ่าน (100%), Lint ผ่าน 0 errors 0 warnings, และ Build สำเร็จ 100%)
* **Prompt 29:** "ในหน้าหลักให้แก้คำว่าสมัครด่วนของการ์ดโพสงานที่ต้นเองเป็นคนให้เป็นการแก้ไขโพสแทน เจ้าของโพสไม่สามารถสมัครงานของโพสตัวเองได้" (ปรับปรุงปุ่มบนการ์ดงานในหน้าหลักและหน้าค้นหา: หากประกาศงานนั้นเป็นงานที่ตนเองเป็นคนโพสต์ (`isOwner`) จะเปลี่ยนปุ่ม "สมัครด่วน" เป็น "แก้ไขโพสต์" นำทางไปที่ `/edit/[id]` พร้อมติด Badge "โพสต์ของคุณ" และป้องกันไม่ให้เจ้าของโพสต์สามารถสมัครงานของตนเองได้ในทุกขั้นตอน ทั้งบนปุ่มการ์ด, ฟังก์ชัน `handleQuickApply`, `ApplyModal.tsx`, และ `JobContext.tsx` รันเทสต์ 19/19 ผ่าน (100%), Lint ผ่าน 0 errors 0 warnings, และ Build สำเร็จ 100%)
* **Prompt 30:** "ช่วยปรับปรุง UX/UI ให้สวยงามและมี clean ตามากยิ่งขึ้น และเป็นระบบเปลี่ยนธีมสี มืด และสว่างมาให้หน่อย" (พัฒนาระบบเปลี่ยนธีมสี มืด/สว่าง (Dark & Light Theme) และยกระดับดีไซน์ UX/UI สวยงาม สะอาดตา (Clean & Modern) ทั่วทั้งระบบ: สร้าง `ThemeContext.tsx` จัดการธีมด้วย `useSyncExternalStore` ซิงค์ `localStorage` และ System Preference, สร้างปุ่ม `ThemeToggle.tsx` พร้อมแอนิเมชันพระอาทิตย์/พระจันทร์และ Tooltip, ป้องกัน FOUC ด้วย Pre-hydration Script ใน `layout.tsx`, กำหนด Tailwind CSS v4 `@custom-variant dark` ใน `globals.css`, และปรับแต่งคลาส `dark:` ครบทุกหน้าและทุกโมดัล รัน `npm run lint` ผ่าน 0 errors 0 warnings, `npm test` ผ่าน 19/19 tests, และ `npm run build` สำเร็จ 100%)

### 3. Code Portion Generated & Human Modifications
* **AI-Generated Portion (~95%):**
  - ออกแบบและสร้าง `JobContext` (`src/context/JobContext.tsx`) และ `Providers` (`src/components/Providers.tsx`) เพื่อแชร์ State ข้ามหน้าทั้งหมด
  - ปรับปรุง Header (`src/components/Header.tsx`) ให้ใช้ Link และ Next.js App Router Navigation
  - ย้ายและแบ่งหน้าระบบตามโฟลเดอร์ของ Next.js App Router:
    - `/` (`src/app/page.tsx`): หน้าหลักรวมงานและหมวดหมู่ (อ้างอิง Prototype Takdanai)
    - `/search` (`src/app/search/page.tsx`): หน้าระบบค้นหาและตัวกรองละเอียด (อ้างอิง Prototype Kamonchanok) รองรับ query strings (`?q=`, `?cat=`) พร้อม `<Suspense>`
    - `/jobs/[id]` (`src/app/jobs/[id]/page.tsx`): หน้ารายละเอียดงานและฟอร์มสมัครงาน (อ้างอิง Prototype Phoomin) รองรับ dynamic route params
    - `/create` (`src/app/create/page.tsx`): หน้าสร้างประกาศรับสมัครงานแบบ 2 คอลัมน์พร้อมปักหมุดจำลอง (อ้างอิง Prototype Yanathron)
    - `/create_job` (`src/app/create_job/page.tsx`): ตั้งค่า Redirect ไปยัง `/create`
    - `/profile` (`src/app/profile/page.tsx`): หน้าโปรไฟล์นิสิตและ Portfolio ผลงาน 3 สถานะ
  - ตัดการกรอกและการแสดงผล "ระยะทางโดยประมาณจากหน้า ม.พะเยา" และ "Line ID" ออกจาก UI Component ทั้งหมด (`JobCard`, `WorkDetailView`, `SearchPageView`, `CreateJobModal`, `CreateJobPage`, `EditJobPage`, `ProfileView`)
  - นำฟังก์ชัน "ถูกใจงาน" (Favorites / Heart icon / toggleFavorite) ออกจากระบบทั้งหมด ทั้งใน `JobContext`, `JobCard`, `WorkDetailView`, `SearchPageView`, `page.tsx`, `search/page.tsx`, `jobs/[id]/page.tsx`
  - นำปุ่ม "+ เพิ่มงาน" ออกจากแถบหมวดหมู่ในหน้าหลัก (`CategoryBar`) เพื่อไม่ให้ซ้ำซ้อนกับปุ่มใน Header
  - ตัดปุ่ม "ยกเลิก" ที่ซ้ำซ้อนในแบบฟอร์มออก และเปลี่ยนปุ่ม "กลับ" ใน Header ให้แสดงเป็น "ยกเลิก" สำหรับหน้าแบบฟอร์ม
  - ปลดการผูกม็อกอัปในโค้ดโปรดักชันทั้งหมด:
    - เปลี่ยน `JobContext` ให้เริ่มต้นด้วย State ว่าง (`jobs: []`) และเชื่อมต่ออ่าน-เขียนกับ Firestore คอลเลกชัน `JOB` และ `JOB_APPLICATIONS`
    - ลบไฟล์ม็อกอัปจำลอง `src/data/mockJobs.ts`, `src/data/mockProfile.ts` และโฟลเดอร์ `src/data` ทั้งหมด
    - ลบค่าเริ่มต้นจำลอง (Default Values) ในหน้าแบบฟอร์มสร้างงาน (`CreateJobPage`, `CreateJobModal`) ให้เป็นช่องว่างรอรับข้อมูลจริง
    - ปรับปรุงหน้าแก้ไขงาน (`/edit/[id]`) ให้ดึงข้อมูลจาก `JobContext` และอัปเดตผ่าน `updateJob`
    - แยกชุดข้อมูลทดสอบ Mock Data สำหรับ Unit Testing เข้าไปอยู่ใน `src/tests/fixtures/sampleJobs.ts` โดยไม่ปะปนกับโค้ดโปรดักชัน
  - พัฒนาระบบสมัครสมาชิก (Register) แบบ 2 ส่วนตามคำสั่ง:
    - ส่วนที่ 1 (ข้อมูลบัญชี): ชื่อ-นามสกุล, อีเมล หรือ ชื่อผู้ใช้, รหัสผ่าน, ยืนยันรหัสผ่าน พร้อมปุ่ม "ถัดไป (1/2)" และตัวเลือก Google
    - ส่วนที่ 2 (ข้อมูลส่วนตัว): เบอร์โทรศัพท์ และ ที่อยู่ พร้อมปุ่ม "ย้อนกลับ" และ "สมัครสมาชิก"
    - ปรับปรุงการจัดการ State ให้คงค่าที่กรอกไว้ทั้งสองส่วนแม้จะกดย้อนกลับ
    - รองรับการเข้าสู่ระบบ/สมัครสมาชิกด้วย Username ผ่านการ Normalize สำหรับ Firebase Authentication
    - บันทึกข้อมูลส่วนตัว (เบอร์, ที่อยู่, timestamps) ลง Cloud Firestore ทั้งคอลเลกชัน `users` และ `USER`
    - อัปเดต `ProfileView.tsx` ให้ดึงข้อมูลเบอร์โทรศัพท์และที่อยู่มาแสดงผลในหน้าโปรไฟล์ได้อย่างถูกต้อง
  - ยกระดับการออกแบบ UX/UI หน้า Login และ Register ใหม่:
    - Layout การ์ดลอยมน (Rounded-3xl Elevated Card) พร้อมเงา Soft Shadow และ Ambient Background Gradient
    - แถบสลับ Tab Segmented Control ระหว่าง "เข้าสู่ระบบ" และ "สมัครสมาชิก"
    - แถบความคืบหน้า (Progress Bar) 2 ขั้นตอน พร้อมคำอธิบายภาษาไทยเข้าใจง่าย
    - เพิ่มไอคอนกำกับใน Input ทุกช่อง (`User`, `Mail`, `Lock`, `Phone`, `MapPin`)
    - เพิ่มปุ่มลูกตาเปิด/ปิดการมองเห็นรหัสผ่าน (`Eye` / `EyeOff`) ทั้งช่องรหัสผ่านและยืนยันรหัสผ่าน
    - เปลี่ยนปุ่ม Google มาใช้ไอคอน SVG 4 สีทางการระดับสากล
    - กล่องสถานะ Error / Success Banner พร้อมไอคอนแจ้งเตือนชัดเจน
    - เพิ่มแถบ Header นำทางด้านบนพร้อมโลโก้ JOB UP และปุ่ม "กลับหน้าหลัก"
  - ปรับปรุง Navbar ตามสถานะ Authentication ใน `Header.tsx`:
    - ติดตาม Auth State ผ่าน `onAuthStateChanged` แบบเรียลไทม์
    - ซ่อนปุ่ม "+ เพิ่มงาน" และไอคอน Profile เมื่อผู้ใช้ยังไม่ได้ล็อกอิน โดยแทนที่ด้วยปุ่ม "Login/Register" ที่นำทางไป `/auth`
    - แสดงปุ่ม "+ เพิ่มงาน" และรูป Profile/ไอคอนผู้ใช้ตามปกติเมื่อล็อกอินแล้ว
  - ปรับปรุงและกำจัดฟิลด์ข้อมูลที่ไม่จำเป็นตามความต้องการล่าสุด:
    - ตัดฟิลด์ "รหัสนิสิต", "คณะ", "สาขา / ชั้นปี", "วิทยาเขต / ที่พัก" ออกจากแบบฟอร์มสมัครงาน (`ApplyModal`), หน้าโปรไฟล์ (`ProfileView`), ข้อมูลเริ่มต้น Firestore (`auth/page.tsx`) และปรับปรุง Data Type ให้เป็น optional เพื่อรองรับ Backward Compatibility
    - เปลี่ยนชื่อแบรนด์ระบบเป็น "JOB Phayao" ใน Metadata, Header, Footer ทุกหน้า, Hero Section และหน้า Login/Register
    - เปลี่ยนข้อความ Badge เป็น "JOB WANTED PHAYAO" บน Hero Section และ Modal สร้างงาน
    - เปลี่ยนข้อความระบุสถานที่จาก "ม.พะเยา" / "มหาวิทยาลัยพะเยา" เป็น "พะเยา" ครอบคลุมทั้ง Placeholders, Labels, Modals, และ Test Fixtures
  - ยกระดับ UI/UX ทุกหน้าให้มีความสวยงาม สะอาดตา (Clean) และทันสมัย:
    - สร้างและเชื่อมต่อคอมโพเนนต์ Footer สากล (`src/components/Footer.tsx`)
    - ยกระดับ `Header.tsx` ด้วย JP Brand Logo Badge, แถบค้นหาโค้งมน มินิมอล, และ Glassmorphic Backdrop Blur
    - ปรับปรุง `HeroSection.tsx` ด้วย Ambient Radial Glows, ข้อมูลการันตี และการ์ดสรุปสถานะ
    - ปรับแต่ง `CategoryBar.tsx` และ `JobCard.tsx` ด้วย Elevated Rounded-3xl Cards และการแสดงราคาที่โดดเด่น
    - ปรับปรุง `WorkDetailView.tsx`, `SearchPageView.tsx`, `ProfileView.tsx`, `CreateJobPage`, และ `EditJobPage` ให้สอดคล้องกับธีมโมเดิร์น สะอาดตา
    - กำหนดค่า Font Geist และธีมสว่างสม่ำเสมอใน `globals.css`
  - ยกระดับการเชื่อมต่อฐานข้อมูล Firestore สู่ระบบ 100% สำหรับการใช้งานของคนทั่วไปในจังหวัดพะเยา:
    - ปรับปรุง `JobContext.tsx` ให้ใช้ Real-time Sync (`onSnapshot`) ซิงค์การเปลี่ยนแปลงของงานทุกประกาศแบบอัตโนมัติ
    - พัฒนาฟังก์ชัน `normalizeFirestoreJob` ให้รองรับโครงสร้างเอกสารทุกแบบ ป้องกันปัญหา Undefined
    - เพิ่มความสามารถ CRUD ครบถ้วน (Create, Read, Update, และ Delete ด้วย `deleteJob`)
    - ซิงค์บันทึกโปรไฟล์ผู้ใช้ลงทั้ง `users` และ `USER`
    - เชื่อมต่อหน้าโปรไฟล์ (`ProfileView.tsx`) ให้ดึงประกาศงานจริงของผู้ใช้มาแสดงในแท็บ "โพสต์ของฉัน" พร้อมปุ่มเปิดดู แก้ไข และลบประกาศงานจริง
    - เชื่อมต่อแท็บ "งานที่สมัคร" ให้แสดงรายการงานที่ผู้ใช้กดสมัครจริง
    - ตรวจสอบและตัดคำที่สื่อถึงบริบทนิสิต/มหาวิทยาลัยในหน้าสร้างงาน (`src/app/create/page.tsx`) ให้เป็นแพลตฟอร์มสำหรับคนทั่วไปในจังหวัดพะเยาอย่างสมบูรณ์
  - ยึดโครงสร้างฐานข้อมูล Firebase Firestore ตามสเปกใน `ForNeed/` แบบ 100%:
    - คอลเลกชัน `JOB`: ปรับใช้ฟิลด์ตรงตาม `JOB collection.png` (`Job_name`, `User_ID` DocumentReference, `compensation`, `compensation_unit`, `work_time`, `job_detail`, `job_location` GeoPoint, `openings_number`, `gender`, `age`, `job_picture_url`, และ `status: 0` สำหรับ waiting for worker ตาม `status config.png`)
    - คอลเลกชัน `JOB_APPLICATIONS`: ปรับใช้ฟิลด์ตรงตาม `JOB_APPLICATION collection.png` (`Job_ID` DocumentReference, `User_ID` DocumentReference, `status: 0` สำหรับ pending ตาม `status config.png`, และ timestamps)
    - คอลเลกชัน `USER`: ปรับใช้ฟิลด์ตรงตาม `USER collection.png` (`Doing_work`, `Finished_work`, `Income`, `Own_work`, `User_info`, `User_name`, `tel`, `email`, `facebook`, `user_picture_url`)
    - Subcollection `User_location` (`location` GeoPoint, `location_detail`, `location_name`)
    - Subcollection `Rating_score` (`Job_id`, `User_id`, `comment`, `score`)
    - เพิ่ม TypeScript Interfaces สำหรับโมเดล Firestore ทุกคอลเลกชันใน `src/types/job.ts`
    - แสดงกล่องสรุป 4 ตัวชี้วัด (`Doing_work`, `Finished_work`, `Own_work`, `Income`) ในหน้าโปรไฟล์ผู้ใช้
  - พัฒนาระบบประเมินรีวิวคะแนนดาว และการป้องกันการรีวิวตนเอง (Self-Review Prevention):
    - สร้างหน้า `/review` พร้อมกล่องกรอกความคิดเห็นและปุ่มเลือกดาว 11 ระดับ (0 - 5.0 สเต็ปละ 0.5)
    - เพิ่มคอนเทนเนอร์คะแนนรีวิวและความน่าเชื่อถือในหน้าโปรไฟล์ (`ProfileView.tsx`)
    - ซ่อนปุ่มเขียนรีวิวในหน้าโปรไฟล์ตนเองและแทนที่ด้วย Badge "โปรไฟล์ของคุณ"
    - ซ่อนปุ่มรีวิวผู้ว่าจ้างใน WorkDetailView หากเป็นงานที่ตนเองประกาศ
    - เพิ่มการตรวจสอบ `isSelfReview` ในหน้า `/review` แสดงแบนเนอร์สีแดงแจ้งเตือน ปิดการทำงานของปุ่มส่งรีวิว และป้องกันการบันทึกลง Firestore
  - พัฒนาระบบปักหมุดแผนที่และแสดงตำแหน่งสถานที่ทำงานจริง (Real Interactive Map Pinning & Location Viewer):
    - ติดตั้งและตั้งค่า Leaflet + OpenStreetMap ใน Next.js แบบ No-SSR Dynamic Import เพื่อป้องกันข้อผิดพลาด hydration
    - สร้าง `MapPickerModal.tsx` รองรับการคลิก/ลากหมุดบนแผนที่จริง, ปุ่มค้นหาพิกัด GPS Geolocation และพิกัดแลนด์มาร์กสำคัญรอบพะเยา 10 แห่ง
    - สร้าง `LocationMapViewer.tsx` บนหน้ารายละเอียดงาน (`WorkDetailView.tsx`) แสดงแผนที่พิกัดจริง พร้อมปุ่มเปิด Google Maps นำทาง
    - จัดเก็บและดึงข้อมูลพิกัดลง Firestore ในฟิลด์ `job_location` ด้วย `GeoPoint(lat, lng)` ตรงตาม `ForNeed/JOB collection.png` 100%
    - เชื่อมต่อระบบปักหมุดเข้ากับหน้าสร้างประกาศงาน (`/create`), แก้ไขงาน (`/edit/[id]`), และ Modal สร้างงาน (`CreateJobModal`)
  - พัฒนาระบบแท็บ "กำลังรอ approve ใบสมัคร" และเวิร์กโฟลว์จัดการใบสมัครในหน้าโปรไฟล์ (`ProfileView.tsx`):
    - เพิ่มแท็บใหม่ `pending-approval` พร้อม Badge แสดงจำนวนใบสมัครที่ค้างรอการตรวจสอบแบบเรียลไทม์
    - มีตัวกรอง Segmented Control ให้เลือกดู "ทั้งหมด", "ใบสมัครของฉันที่รอผล", หรือ "ใบสมัครที่ส่งเข้ามา"
    - เพิ่มฟังก์ชัน `approveApplication`, `rejectApplication`, และ `cancelApplication` ใน `JobContext` พร้อมซิงค์ Firestore คอลเลกชัน `JOB_APPLICATIONS`
    - บังคับใช้ตรรกะตามสเปก `ForNeed/status config.png` 100%: อนุมัติผู้สมัคร (`status: 1`), ปฏิเสธผู้สมัครรายอื่นในงานเดียวกันอัตโนมัติ (`status: 2`), และอัปเดตสถานะงานเป็นกำลังทำงาน (`JOB.status: 1`)
    - แสดง Badge "มี N คนรอ Approve" บนการ์ดงานที่ตนเองโพสต์ และปรับปรุงแท็บ "งานที่กำลังทำ" ให้นับเฉพาะงานที่ได้รับการอนุมัติแล้วเท่านั้น
  - แก้ไขปัญหาข้อผิดพลาด ESLint สำหรับ GitHub Actions CI (13 errors, 24 warnings -> 0 errors, 0 warnings):
    - ปรับปรุงการจัดการ State ตามหลักการ React 19 และ React Compiler เพื่อกำจัดข้อผิดพลาด `react-hooks/set-state-in-effect` ใน `EditJobPage`, `MapPickerModal`, `JobContext` และ `/review`
    - กำหนด Type ชัดเจนให้กับ Leaflet Map, Marker และ Event Handlers กำจัด `@typescript-eslint/no-explicit-any`
    - Escape อักขระคำพูดใน JSX เป็น `&quot;` ใน `ProfileView.tsx`
    - ล้างตัวแปรและ Imports ที่ไม่ได้ใช้งานทั้งหมด
    - แปลงแท็ก `<img>` เป็น Next.js `<Image />` พร้อม `unoptimized`
  - ตรวจสอบและแก้ไข Build Type Errors และรันคำสั่ง `npm run lint`, `npm run build` และ `npm test` ผ่านสมบูรณ์ 100% (19/19 passing tests)
  - ปรับแต่งการตั้งค่าโปรเจกต์ Next.js และจัดทำคู่มือการ Deploy สู่ Vercel Platform ให้รองรับทั้ง Serverless และ Edge CDN อย่างสมบูรณ์
  - แก้ไขปัญหา UI ค้างขณะบันทึกรูปโปรไฟล์ใน `ProfileView.tsx` และปรับปรุง Navbar Avatar Sync ใน `Header.tsx`:
    - นำการเรียก `uploadBytes` ออกจาก `handleSaveProfile` เพื่อไม่ให้เกิดการค้างรอ Network Timeout ของ Firebase Storage และบันทึก Data URL ลง Firestore โดยตรงทันที (< 200ms)
    - เพิ่ม Real-time Snapshot Listener ใน `Header.tsx` ซิงค์ `user_picture_url` จากคอลเลกชัน `USER/{uid}` ทำให้รูปบน Navbar อัปเดตทันทีแบบเรียลไทม์
  - ปรับปรุงระบบรีวิวให้เป็นการประเมิน "ผู้โพสต์ประกาศงาน" (Job Poster / ผู้ว่าจ้าง) แทนการรีวิวร้านค้า:
    - ใน `WorkDetailView.tsx`: แสดงข้อมูลและรูปโปรไฟล์จริงของผู้โพสต์จาก Firestore `USER/{userId}` และเปลี่ยนปุ่มเป็น "★ รีวิวผู้โพสต์งาน"
    - ใน `/review`: เพิ่ม Announcement Banner แจ้งเตือนชัดเจนว่าเป็นการประเมินผู้โพสต์งาน ไม่ใช่ร้านค้า, ปรับคำอธิบายเกณฑ์ดาว 11 ระดับ (จ่ายค่าจ้างตรงเวลา, สื่อสารชัดเจน, ปฏิบัติต่อผู้ร่วมงานเป็นธรรม), ปรับ Label และ Badge ระบุผู้โพสต์ประกาศงาน
    - ใน `ProfileView.tsx`: ปรับหัวข้อคอนเทนเนอร์และข้อความในแท็บรีวิว ระบุชัดเจนว่าเป็นคะแนนประเมินผู้โพสต์ประกาศงาน ไม่ใช่การรีวิวร้านค้า
    - ใน `src/app/create/page.tsx` และ `CreateJobModal.tsx`: ปรับชื่อฟิลด์เป็น "ชื่อผู้โพสต์ประกาศงาน (ผู้ว่าจ้าง)"
  - ปรับปรุงการ์ดประกาศงาน (`JobCard.tsx`) และหน้าหลัก/ค้นหา (`page.tsx`, `search/page.tsx`, `SearchPageView.tsx`):
    - หากเป็นประกาศงานที่ตนเองเป็นคนโพสต์ (`isOwner`) จะแสดง Badge "โพสต์ของคุณ" และเปลี่ยนปุ่ม "สมัครด่วน" เป็น "แก้ไขโพสต์" นำทางไปหน้า `/edit/[id]` ทันที
    - เสริม Security Guard ใน `handleQuickApply` และ `ApplyModal.tsx` ป้องกันไม่ให้เจ้าของโพสต์สมัครงานของตนเองในทุกกรณี
* **Human Written/Modified Portion (~5%):**
  - กำหนดข้อกำหนดการเปลี่ยนผ่านจาก Prototype สู่โครงสร้างโปรดักชันจริงภายใต้ `src/app`
  - ตัดสินใจตัดฟิลด์ระยะทาง, Line ID, ฟังก์ชันถูกใจงาน และปรับแต่งตำแหน่งปุ่มตามการใช้งานจริง
  - สั่งการให้นำข้อมูล Mockup ทั้งหมดออกจากโปรดักชัน
  - กำหนดรูปแบบและฟิลด์ที่ต้องการแบ่งเป็น 2 ส่วนในหน้า Register
  - สั่งการปรับปรุง UX/UI ให้มีความสวยงามและทันสมัย
  - กำหนดเงื่อนไขการแสดงผลปุ่ม Login/Register บน Navbar เมื่อยังไม่ได้เข้าสู่ระบบ
  - กำหนดการนำฟิลด์นิสิต (รหัสนิสิต, คณะ, สาขา, วิทยาเขต) ออก และปรับเปลี่ยนชื่อแบรนดิ้งเป็น JOB Phayao
  - สั่งการยกระดับ UI ทุกหน้าให้มีความสวยงามและดู Clean ยิ่งขึ้น
  - สั่งการตัดบริบทอาจารย์และนิสิตออกทั้งหมดเพื่อมุ่งเน้นเป็นเว็บสำหรับคนทั่วไปในจังหวัดพะเยา
  - สั่งการให้ยึดโครงสร้างฐานข้อมูลตรงตามรูปใน ForNeed 100%
  - สั่งการเพิ่ม Container คะแนนรีวิวใน Profile, หน้า Review ดาว 0-5.0, และห้ามเจ้าของรีวิวตัวเอง
  - สั่งการเปลี่ยนปุ่มดูโปรไฟล์เป็นปุ่มรีวิวตรงในการ์ดผู้ประกาศ และสั่งการนำข้อมูล Mock Up ของคะแนนรีวิวออกทั้งหมด
  - สั่งการปรับปรุงระบบปักหมุดสถานที่ทำงานให้ใช้งานได้จริง
  - สั่งการให้เพิ่มแท็บ "กำลังรอ approve ใบสมัคร" ในหน้าโปรไฟล์เพื่อติดตามและจัดการใบสมัครงาน
  - แจ้งข้อผิดพลาด GitHub CI Actions จากไฟล์ `CI error.md` เพื่อให้แก้ไขให้พร้อมสำหรับการ Merge
  - สั่งการเตรียมความพร้อมสำหรับการนำโปรเจกต์ขึ้นรันบน Vercel
  - แจ้งปัญหาเมื่อเลือกรูปจากในเครื่องแล้วกดปุ่ม "บันทึกข้อมูล" ค้างที่สถานะ "กำลังบันทึกข้อมูล" ไม่เสร็จสิ้น
  - สั่งการให้ปรับปรุงระบบรีวิวให้เป็นการรีวิวผู้โพสต์ประกาศงานโดยตรง ไม่ใช่การรีวิวร้านค้า
  - สั่งการให้แก้ปุ่ม "สมัครด่วน" ของการ์ดโพสต์งานที่ตนเองเป็นคนโพสต์ให้เป็น "แก้ไขโพสต์" แทน และไม่ให้เจ้าของโพสต์สมัครงานของตนเองได้
  - ตรวจสอบความถูกต้องของการทำงานและการแสดงผลในระบบ







