# 📋 รายการสิ่งที่ยังขาดตกบกพร่องในโปรเจกต์ (Project Deficiencies & Pending Deliverables)

เอกสารนี้รวบรวมรายการสิ่งที่ยังขาดตกบกพร่อง (Deficiencies), ไฟล์ที่ยังไม่สมบูรณ์ และสิ่งที่ต้องดำเนินการเพิ่มเติมตามข้อกำหนดในใบงานปฏิบัติการ โดยแยกรายละเอียดตามรายแล็บ เพื่อให้ทีมสามารถตรวจสอบและแก้ไขปรับปรุงคะแนนได้อย่างตรงจุด

---

## 📦 หมวดที่ 1: รายการสิ่งที่ยังขาดใน Lab 2 (Sprint Zero Setup)
> **สถานะคะแนน:** ⚠️ Partial (50%) — อ้างอิง [`scoring.md`](file:///D:/School%20Work/งานอาจารย์กิ๊ก/main-work/scoring.md)

### ❌ 1.1 ไฟล์ที่ยังขาดหายไป (Missing Deliverables)
- [ ] **`docs/definition-of-done.md`** *(เกณฑ์ Rubric: Definition of Done 5+ items)*
  - **สถานะ:** ยังไม่มีไฟล์นี้ในโปรเจกต์
  - **สิ่งที่ต้องทำ:** สร้างไฟล์ `docs/definition-of-done.md` โดยกำหนดเกณฑ์เสร็จสิ้นของงาน (DoD) ของทีมอย่างน้อย **5 ข้อขึ้นไป** ที่สะท้อนบริบทจริงของทีม (อ้างอิง ESP §2.4) เช่น:
    1. ฟังก์ชันต้องผ่านการทดสอบ Automated Unit Test (`npm test`) 100%
    2. โค้ดต้องผ่านเกณฑ์ ESLint (`npm run lint`) และ Build ผ่าน (`npm run build`)
    3. พัฒนาบน Feature branch และส่งผ่าน Pull Request (PR) เท่านั้น ไม่อนุญาตให้ push ตรงเข้า `main`
    4. ต้องได้รับการ Review และ Approve จากเพื่อนร่วมทีมอย่างน้อย 1 คน
    5. มีการทดสอบ Acceptance Criteria บน UI จริงครบทุกข้อก่อนปิด Issue
    6. มีการบันทึกเครื่องมือ AI และ Prompts ที่ใช้ลงใน [`AI_USAGE.md`](file:///D:/School%20Work/งานอาจารย์กิ๊ก/main-work/AI_USAGE.md) ตามจริง

### ⚠️ 1.2 ไฟล์ที่มีแล้ว แต่เนื้อหายังไม่ครบตามเกณฑ์ (Incomplete Content)
- [ ] **[`docs/project-proposal.md`](file:///D:/School%20Work/งานอาจารย์กิ๊ก/main-work/docs/project-proposal.md)** *(เกณฑ์ Rubric: ครบ 6 sections)*
  - [ ] **Section 1: Theme** — ปัจจุบันมีเพียงชื่อ `Community Connector` **ยังขาดเหตุผลในการเลือก 2–3 ประโยค**
  - [ ] **Section 3: Persona หลัก** — ปัจจุบันมีเพียงระบุชื่อและคณะ 1 บรรทัด **ยังขาดบริบทและพฤติกรรมความจำเป็นในการใช้งาน 1 ย่อหน้าเต็ม (Paragraph)**
  - [ ] **Section 5: MoSCoW priorities** — ปัจจุบันเขียนรวมกันเป็นประโยคเดียว **ต้องแยกหัวข้อชัดเจนเป็น 4 กลุ่ม (Must Have, Should Have, Could Have, Won't Have this term) รวม 4–6 ฟีเจอร์**
  - [ ] **Section 6: Risks & assumptions** — ปัจจุบันระบุเพียงความเสี่ยง 1 ข้อเรื่องขนาดงาน **ยังขาด Assumptions (สมมติฐานที่ต้องตรวจสอบ) และความเสี่ยงด้านอื่น ๆ (เช่น ความน่าเชื่อถือ/ความปลอดภัยในการจ้างงาน)**

### 🌐 1.3 รายการที่ต้องดำเนินการบนระบบ GitHub (GitHub Platform Deliverables)
- [ ] **GitHub Project Board:**
  - ตั้งชื่อตามรูปแบบ: `<team-name> — SE Concepts` (เช่น `2 หาร — SE Concepts`)
  - กำหนดคอลัมน์ให้ครบ 5 คอลัมน์: $\text{Backlog} \rightarrow \text{Todo} \rightarrow \text{In Progress} \rightarrow \text{Review} \rightarrow \text{Done}$
  - เปิดใช้งาน **Insights** (Settings → Insights) เพื่อแทร็ก cycle time / velocity
- [ ] **Product Backlog (5–10 GitHub Issues):**
  - สร้าง Issue 5–10 รายการบน GitHub Repository
  - ใช้ Action-oriented Title: `As a [persona], I want [goal], so that [benefit]`
  - Body มี Persona + Goal + Benefit + Acceptance Criteria (3–5 ข้อ)
  - ติด Labels ครบ 3 มิติ: `theme:community`, `priority:<high|medium|low>`, `size:<S|M|L>` พร้อม Milestone

### 🔄 1.4 กระบวนการ Git PR Flow & Role-play
- [ ] **PR Workflow:** สร้าง Branch `feature/lab2-proposal`, Commit/Push, เปิด PR, Tag Reviewer 1 คน, ได้รับ Approve ก่อน Merge เข้า `main`
- [ ] **กิจกรรมจำลอง:** บันทึกข้อสรุป Daily Standup (3 คำถาม) และ Sprint Retrospective สั้น ๆ

---

## 📦 หมวดที่ 2: รายการสิ่งที่ยังขาดใน Lab 3 (Requirements Documents)
> **สถานะคะแนน:** ⚠️ Partial (50%) — อ้างอิง [`scoring.md`](file:///D:/School%20Work/งานอาจารย์กิ๊ก/main-work/scoring.md): *“เคร่ง rubric — personas/nfr ไม่ครบตาม L3.1 (ขาด 5 elements / <5 measurable NFR) → Partial 1.75%”*

### ⚠️ 2.1 ไฟล์ `docs/requirements/personas.md` (ไม่ครบ 5 Elements / ไม่สอดคล้องกับ Proposal)
*เกณฑ์ประเมินตาราง L3.1: 1–3 personas, ครบ 5 elements × grounded ใน domain จริง*
- [ ] **ความขัดแย้งของ Persona หลัก (Inconsistent Primary Persona):**
  - ใน [`docs/requirements/personas.md`](file:///D:/School%20Work/งานอาจารย์กิ๊ก/main-work/docs/requirements/personas.md) ระบุ Persona 1 เป็น **"น้องมิ้นท์" (นิสิต คณะ ICT)**
  - แต่ใน [`docs/project-proposal.md`](file:///D:/School%20Work/งานอาจารย์กิ๊ก/main-work/docs/project-proposal.md) และ [`docs/requirements/main_scenario.md`](file:///D:/School%20Work/งานอาจารย์กิ๊ก/main-work/docs/requirements/main_scenario.md) ระบุ Persona หลักเป็น **"แนน (นันทิดา)" นิสิต คณะบริหารธุรกิจ**
  - **สิ่งที่ต้องทำ:** ปรับให้ Persona หลักใน `personas.md` สอดคล้องกับ Proposal และ Main Scenario หรือกำหนดบทบาทให้ชัดเจน (เช่น แนน = ผู้จ้างงาน/ผู้รับงานหลัก, น้องมิ้นท์ = นิสิตรับงานสายไอที, พี่เอก = ผู้ประกอบการ)
- [ ] **ความครบถ้วนของ 5 Elements (ขาดความลึกซึ้งตาม ESP §3.3):**
  - ปัจจุบันแต่ละหัวข้อ (Personalization, Job, Education, Relevance, Frequency of use) มีเพียง 1 ประโยคสั้น ๆ ทำให้ถูกตัดคะแนน rubric
  - **สิ่งที่ต้องทำ:** ขยายรายละเอียดให้ครบ 5 มิติที่แท้จริง (Personalization, Job, Education, Relevance, Frequency of use)
- [ ] **ไฟล์เปล่าตกค้างในโฟลเดอร์ Personas:**
  - ไฟล์ [`docs/requirements/personas/phuoomin.md`](file:///D:/School%20Work/งานอาจารย์กิ๊ก/main-work/docs/requirements/personas/phuoomin.md) ปัจจุบันมีขนาด **0 bytes (ว่างเปล่า)** ต้องเติมเนื้อหาหรือลบออกหากไม่ใช้งาน

### ❌ 2.2 ไฟล์ `docs/requirements/scenarios.md` (จำนวน Scenarios ไม่ครบตามเกณฑ์)
*เกณฑ์ประเมินตาราง L3.1: 3+ scenarios/persona, narrative (เล่าเรื่อง) ครอบคลุม happy path + edge cases*
- [ ] **จำนวน Scenario ไม่ถึงเกณฑ์ขั้นต่ำ:**
  - ใบงานกำหนด: **3–4 scenarios ต่อ 1 persona**
  - ปัจจุบันมี: Persona 1 มี 2 ข้อ, Persona 2 มี 2 ข้อ (รวมทั้งไฟล์มีเพียง 4 Scenarios ขาดไปอย่างน้อย 2–4 Scenarios)
  - **สิ่งที่ต้องทำ:** เพิ่ม Scenario ให้ได้ 3–4 ข้อต่อ Persona (รวมอย่างน้อย 6 ข้อ)
- [ ] **รูปแบบการเขียนยังไม่เป็น Narrative เต็มรูปแบบ:**
  - ปัจจุบันในส่วน `Action Sequence` ยังเขียนเป็นรายการตัวเลข `1. 2. 3. 4. 5.`
  - **สิ่งที่ต้องทำ:** ปรับ Action Sequence ให้เป็นเนื้อความร้อยแก้ว (Narrative Paragraph) เล่าเหตุการณ์ต่อเนื่องอย่างมีชีวิตชีวา

### ⚠️ 2.3 ไฟล์ `docs/requirements/user-stories.md` (Acceptance Criteria ไม่ครอบคลุม)
*เกณฑ์ประเมินตาราง L3.1: 8+ stories มี AC ครบ + quality bar*
- [ ] **Acceptance Criteria (AC) ไม่ครอบคลุมในหลาย Story:**
  - `US-06`, `US-07`, `US-08` มี AC เพียง **1 ข้อ**
  - **สิ่งที่ต้องทำ:** เพิ่ม AC ให้มีอย่างน้อย **2–4 ข้อต่อ Story** โดยครอบคลุมทั้ง Happy Path และ Negative/Edge Cases
- [ ] **ขาดการระบุ Feature Quality Bar Check (ESP §3.5):**
  - เพิ่มส่วน Cross-check 4 คำถามสู้ Feature Creep (Independent, Coherent, Relevant, Value)

### ❌ 2.4 ไฟล์ `docs/requirements/nfr.md` (ไม่ครบ 4 ประเภท / ขาดความชัดเจนของ Metric)
*เกณฑ์ประเมินตาราง L3.1: 5+ measurable NFR ครอบคลุม ≥ 4 ประเภท (Performance / Security / Usability / Maintainability)*
- [ ] **ขาดประเภท Maintainability:** ปัจจุบันไม่มีหมวด Maintainability ที่ระบุในเกณฑ์ใบงานโดยตรง
- [ ] **ระบุเงื่อนไขการทดสอบ Metric ให้เป็นรูปธรรม:** เสริมสภาพแวดล้อมและเกณฑ์วัดผลของ NFR ทุกข้อ

### ❌ 2.5 ไฟล์ `reflect.md` ระดับ Root ว่างเปล่า (Post-quiz 3 / Exit Ticket 3)
- [ ] ไฟล์ [`reflect.md`](file:///D:/School%20Work/งานอาจารย์กิ๊ก/main-work/reflect.md) มีขนาด **0 bytes (ว่างเปล่า)** ต้องเขียนตอบ Post-quiz 3 ครบทั้ง 3 ข้อ (Magic Shipping, NFR Metric, User Story & AC)

### 🌐 2.6 งานบนระบบ GitHub & PR Flow ของ Lab 3
- [ ] สร้าง GitHub Issues 8–15 รายการ ติด label `user-story`, Milestone `Sprint 1`, ลิงก์กลับ scenario
- [ ] แบ่งเป็น 4 PRs ย่อย: `lab3-personas`, `lab3-scenarios`, `lab3-stories`, `lab3-nfr` และ `exit-ticket-3`

---

## 📦 หมวดที่ 3: รายการสิ่งที่ยังขาดใน Lab 6 (First Container — Dockerfile + Build + Push)
> **สถานะคะแนน:** ⚠️ Partial (50%) — อ้างอิง [`scoring.md`](file:///D:/School%20Work/งานอาจารย์กิ๊ก/main-work/scoring.md)

### ⚠️ 3.1 ไฟล์ `docker/README.md` (เนื้อหายังขาดหลายส่วนตาม Rubric ตาราง L6.1)
*เกณฑ์ประเมินตาราง L6.1: ครบ + อ้าง ESP §5.4 (Container vs VM) + วิธี build/run/test*
- [ ] **ขาดการเปรียบเทียบเชิงสถาปัตยกรรม (Container vs VM Trade-offs):**
  - **ทำไมเลือก Container:** อ้างอิง **ESP §5.4** — น้ำหนักเบา, สตาร์ตระดับวินาที, ประหยัด RAM, กำหนด Dependencies สม่ำเสมอ
  - **ทำไมไม่ใช้ VM:** VM มี Hypervisor และ Full Guest OS ก่อให้เกิด Overhead มหาศาล เปลืองพื้นที่ และ Boot ช้า
- [ ] **ขาดข้อมูลสเปก Image และ Runtime:** ยังไม่ระบุ Image Size จริง ($< 500\text{ MB}$), Port Mapping และ Environment Variables
- [ ] **ขาดคำสั่งการรันและขั้นตอนทดสอบผลลัพธ์:** ขาดคำสั่ง `docker run -d -p 3000:3000 ...` และการทดสอบ HTTP Response 2xx
- [ ] **ขาดข้อมูล Registry & Repository Link:** ยังไม่ระบุ URL ลิงก์ของ Docker Hub หรือ ghcr.io

### ❌ 3.2 การนำ Image ขึ้น Container Registry (Docker Hub หรือ ghcr.io)
*เกณฑ์ประเมินตาราง L6.1: tag ชัด (เช่น `v0.1.0`) + public + screenshot ใน PR description (local ได้แค่ Partial 1.75%)*
- [ ] Tag Image ระบุเวอร์ชันชัดเจน (ห้ามใช้ `:latest`): `docker tag job-up-app:v0.1.0 <username>/job-up-app:v0.1.0`
- [ ] Push ขึ้น Registry: `docker push <username>/job-up-app:v0.1.0` และตั้งค่า Visibility เป็น **Public**
- [ ] บันทึกภาพ Screenshot หน้า Docker Hub / ghcr.io เพื่อนำไปแนบใน PR Description

### ❌ 3.3 ไฟล์ `reflect.md` ระดับ Root ว่างเปล่า (Post-quiz 6)
- [ ] เขียนตอบ Post-quiz 6 ครบ 3 ข้อ: 1. Dockerfile Draft (B1), 2. Service Decomposition Rule of Twos (B2), 3. REST Endpoint Design (B3)

### ⚠️ 3.4 การเปิดเผยการใช้งาน AI ใน `AI_USAGE.md` สำหรับ Lab 6
- [ ] เพิ่มบันทึกหมวด Lab 6 ใน `AI_USAGE.md` (Tools, Prompts $\ge 2$ คำสั่ง, สัดส่วนโค้ดที่สร้างโดย AI เทียบกับการปรับแต่งโดยมนุษย์)

### 🔍 3.5 การปรับปรุง Dockerfile ของ Services หลังบ้าน (Best Practice Enhancement)
- [ ] เพิ่มคำสั่ง `USER node` ใน stage production runner ของ [`services/stats-service/Dockerfile`](file:///D:/School%20Work/งานอาจารย์กิ๊ก/main-work/services/stats-service/Dockerfile)

### 🔄 3.6 กระบวนการ Pull Request (PR Workflow ของ Lab 6)
- [ ] สร้าง Branch: `feature/lab6-dockerfile` แนบภาพ Screenshot จาก Registry ใน PR Description และผ่านการ Review ก่อน Merge

---

## 📦 หมวดที่ 4: รายการสิ่งที่ยังขาดใน Lab 7 (Refactoring Commit) & Milestone 1 (M1 Checkpoint)
> **สถานะคะแนน:** ⚠️ Partial (50% ทั้ง Lab 7 และ M1) — อ้างอิง [`scoring.md`](file:///D:/School%20Work/งานอาจารย์กิ๊ก/main-work/scoring.md)  
> **คะแนนรวมส่วนนี้:** Lab 7 = 3.5% + Milestone 1 = 7.5% **(รวม 11.0% ของวิชา — CHECKPOINT กลางภาค)**  
> **อ้างอิงใบงาน:** [`CheckList.md`](file:///D:/School%20Work/งานอาจารย์กิ๊ก/main-work/CheckList.md) (Lab07-W7_Refactoring_Milestone1)

### ❌ 4.1 ไฟล์ `reflect.md` ระดับ Root ว่างเปล่า (Post-quiz 7)
*เกณฑ์ข้อ 4.1 และข้อ 10.3 ใน CheckList.md: reflect.md (Post-quiz 7) — 3 reflections (DRY Hunt + Orthogonality + Refactoring Plan)*
- [ ] **สถานะปัจจุบัน:** ไฟล์ [`reflect.md`](file:///D:/School%20Work/งานอาจารย์กิ๊ก/main-work/reflect.md) มีขนาด **0 bytes (ว่างเปล่า 100%)**
- [ ] **สิ่งที่ต้องทำ:** เขียนบันทึกการตอบคำถาม Post-quiz 7 (§7.7 ในบทเรียน) ครบทั้ง 3 ประเด็น:
  1. **DRY Hunt (B1):** การสแกนหา Code Duplication 5 รูปแบบใน codebase (Imposed, Inadvertent, Impatient, Interdeveloper) และแนวทางรวมให้เป็น Single Source of Truth
  2. **Orthogonality Check (B2):** การวิเคราะห์ความอิสระของ Component/Module ในระบบ (เปลี่ยนส่วน A ไม่กระทบส่วน B เช่น การแยก Presentation ออกจาก Filter Logic)
  3. **Refactoring Plan (B3):** แผนการปรับปรุงโครงสร้างโค้ดอย่างเป็นระบบ โดยยึดหลัก Tests pass ก่อน, ไม่ผสม Feature (PP Tip 65) และ commit สม่ำเสมอ

---

### ❌ 4.2 สิ่งที่ยังขาดใน Milestone 1 ส่วนที่ 1: Project Management & Process (1.5%)
*เกณฑ์ประเมินตาราง L7.1: Project Board มี issues 8+ ใน Done/Review + DoD ใน docs/ + Retrospective*
- [ ] **ไฟล์ `docs/definition-of-done.md` ยังขาดหายไป (Missing DoD):**
  - ยังไม่มีไฟล์ `docs/definition-of-done.md` ในโปรเจกต์
  - **สิ่งที่ต้องทำ:** จัดทำเอกสาร DoD กำหนดเกณฑ์เสร็จสิ้นของงานอย่างน้อย 5 ข้อขึ้นไป (Tests ผ่าน 100%, ESLint/Build ผ่าน, PR review, AC verified บน UI)
- [ ] **หลักฐาน Sprint Retrospective (Sprint Zero + Sprint 1):**
  - ยังไม่มีเอกสารบันทึก Retrospective ของทีมใน `docs/`
  - **สิ่งที่ต้องทำ:** จัดทำบันทึก Retrospective สรุปสิ่งที่ทำได้ดี (What went well), ปัญหาที่พบ (What didn't go well), และสิ่งที่ทีมตั้งใจปรับปรุงใน Sprint ถัดไป
- [ ] **GitHub Project Board Status:**
  - ต้องมี Issues อย่างน้อย 8 รายการที่ย้ายไปอยู่ในคอลัมน์ **Done** หรือ **Review** พร้อมติด Labels ถูกต้อง (`user-story`, `priority`, `size`)

---

### ⚠️ 4.3 สิ่งที่ยังขาดใน Milestone 1 ส่วนที่ 2: Requirements & Design Artifacts (1.5%)
*เกณฑ์ประเมินตาราง L7.1: personas, scenarios, user-stories, nfr ครบ; C4 Context + Container render ได้; ADR ≥ 1 ฉบับ*
- [ ] **ปรับปรุงเอกสาร Requirements ให้สมบูรณ์:**
  - [`docs/requirements/personas.md`](file:///D:/School%20Work/งานอาจารย์กิ๊ก/main-work/docs/requirements/personas.md): ปรับ Persona หลักให้ตรงกับ Proposal ("แนน") และเขียนครบ 5 elements เชิงลึก
  - [`docs/requirements/scenarios.md`](file:///D:/School%20Work/งานอาจารย์กิ๊ก/main-work/docs/requirements/scenarios.md): เพิ่ม Scenario ให้ได้ 3–4 ข้อ/persona (ปัจจุบันมีแค่ 2 ข้อ/persona) และปรับเป็น Narrative
  - [`docs/requirements/user-stories.md`](file:///D:/School%20Work/งานอาจารย์กิ๊ก/main-work/docs/requirements/user-stories.md): เพิ่ม Acceptance Criteria ให้ครอบคลุมทุก Story (อย่างน้อย 2–4 ข้อ)
  - [`docs/requirements/nfr.md`](file:///D:/School%20Work/งานอาจารย์กิ๊ก/main-work/docs/requirements/nfr.md): เพิ่มหมวด Maintainability ให้ครบ 4 ด้าน
- [ ] *(หมายเหตุ: C4 Context, C4 Container และ ADR 2 ฉบับ มีความพร้อมและ Render ได้สมบูรณ์แล้ว)*

---

### ⚠️ 4.4 สิ่งที่ยังขาดใน Milestone 1 ส่วนที่ 3: Code Quality (3.0%)
*เกณฑ์ประเมินตาราง L7.1: source code ≥ 1 user story ทำงานได้จริง + ≥ 1 unit test pass + refactor ≥ 1 smell + DRY/Orthogonality ชัด*
- [ ] **กำจัดไฟล์เปล่าตกค้างในโฟลเดอร์ Tests:**
  - ไฟล์ [`src/tests/test_unit.py`](file:///D:/School%20Work/งานอาจารย์กิ๊ก/main-work/src/tests/test_unit.py) มีขนาด **0 bytes** ควรลบออกหรือใส่โค้ดทดสอบจริง เพื่อไม่ให้เกิด Broken Windows
- [ ] **ความพร้อมของส่วนอื่น ๆ (สถานะสมบูรณ์แล้ว):**
  - ✅ Source code Next.js ทำงานได้จริงครอบคลุมทั้งหน้าหลัก, หน้าค้นหา, รายละเอียดงาน และโปรไฟล์
  - ✅ Automated Tests: รันผ่าน 19/19 tests (`npm test`)
  - ✅ Refactoring Journal: บันทึกครบทั้ง 4 ส่วนใน [`docs/refactoring-journal.md`](file:///D:/School%20Work/งานอาจารย์กิ๊ก/main-work/docs/refactoring-journal.md)

---

### ❌ 4.5 สิ่งที่ยังขาดใน Milestone 1 ส่วนที่ 4: Repository & Docker Documentation (1.5%)
*เกณฑ์ประเมินตาราง L7.1: README.md ครบ + docker/README.md ครบ + Dockerfile build/run ได้ + Image บน Docker Hub*
- [ ] **ปรับปรุง `docker/README.md` ให้ครบตาม ESP §5.4:**
  - เพิ่มการเปรียบเทียบเชิงสถาปัตยกรรม (ทำไมเลือก Container, ทำไมไม่ใช้ VM)
  - เพิ่มคำสั่ง `docker run` และตัวอย่างผลการทดสอบเรียก endpoint ตอบกลับ 2xx
  - ระบุ Image size จริง ($< 500\text{ MB}$)
- [ ] **Push Image ขึ้น Container Registry จริง:**
  - ปัจจุบัน Image อยู่เฉพาะ Local ต้อง Push ขึ้น Docker Hub หรือ ghcr.io พร้อม tag ระบุเวอร์ชัน (เช่น `v0.1.0`)

---

### ❌ 4.6 การสร้าง GitHub Release Tag `v0.1.0` และ Release Notes
*เกณฑ์ส่งงาน Milestone 1: Release Tag v0.1.0 + Release Notes สรุปสิ่งที่ทำได้และทำไม่ได้ (deliberately)*
- [ ] **สร้าง Release Tag บน Git Repository:**
  ```bash
  git tag -a v0.1.0 -m "Milestone 1: Sprint 0-2 complete"
  git push origin v0.1.0
  ```
- [ ] **เผยแพร่ Release Notes บน GitHub Releases:**
  - เขียนสรุป **สิ่งที่ทำได้จริง (What's Implemented):** เช่น Next.js UI, Category Filtering, Detailed Search, Modal Popups, Automated Test Suite 19 tests, Modular Backend Stats Service
  - เขียนสรุป **สิ่งที่ทำไม่ได้โดยเจตนา (Deliberately Out of Scope):** เช่น การต่อ Real Database (ยังใช้ Mock Data), ระบบ Authentication เต็มรูปแบบ

---

### 🔄 4.7 กระบวนการ Pull Request (PR Workflow ของ Lab 7)
- [ ] ส่ง PR Refactoring ผ่าน branch: `feature/lab7-refactor-<smell-name>`
- [ ] ตรวจสอบว่า Diff สะอาด ไม่มีการผสม Feature ใหม่เข้ากับ Commit ของการ Refactor (ตามกฎ Two Hats Rule / PP Tip 65)
- [ ] แนบลิงก์ไปยัง `docs/refactoring-journal.md` และ merge ควบคู่กับ `reflect.md` (Post-quiz 7)

---

## 📊 ตารางเปรียบเทียบสิ่งที่ต้องทำเพื่อปลดล็อกคะแนนเต็ม (Score Recovery Matrix รวมทุก Lab)

| Lab / Milestone | รายการที่ประเมิน (Rubric) | สถานะเดิมในโปรเจกต์ | สิ่งที่ต้องแก้ไขเพื่อได้ Full Score |
|:---:|:---|:---:|:---|
| **Lab 2** | `docs/definition-of-done.md` | ❌ ยังไม่มีไฟล์ | สร้างไฟล์กำหนด DoD อย่างน้อย 5 ข้อขึ้นไป (Test, Lint, Build, PR review, AC) |
| **Lab 2** | `docs/project-proposal.md` | ⚠️ เนื้อหาไม่ครบ 6 sections | เพิ่มเหตุผล Theme, ขยายบริบท Persona 1 ย่อหน้า, แยก MoSCoW 4 กลุ่ม, เติม Assumptions |
| **Lab 2** | GitHub Project Board | ⚠️ ยังไม่มี Board และ Issues | ตั้ง Board 5 คอลัมน์, สร้าง Issues 5–10 รายการ ติด label ครบ 3 มิติ |
| **Lab 3** | `docs/requirements/personas.md` | ⚠️ ขาด 5 elements ลึกซึ้ง, ขัดแย้ง Proposal | ปรับ Persona หลักให้ตรงกับ Proposal ("แนน"), เขียนครบ 5 elements เชิงลึก, ลบหรือเติมไฟล์เปล่า `phuoomin.md` |
| **Lab 3** | `docs/requirements/scenarios.md` | ❌ มีแค่ 2 ข้อ/persona (รวม 4), เขียนเป็น bullet | เพิ่มให้ได้ 3–4 ข้อ/persona (รวม $\ge 6$ ข้อ), ปรับ Action Sequence ให้เป็น Narrative เล่าเรื่อง |
| **Lab 3** | `docs/requirements/user-stories.md` | ⚠️ มี 8 stories แต่ US-06..08 มี AC แค่ 1 ข้อ | เพิ่ม AC เป็น 2–4 ข้อต่อ story ครอบคลุม edge case, สรุป 4 คำถาม Quality Bar |
| **Lab 3** | `docs/requirements/nfr.md` | ❌ ขาดหมวด Maintainability, ตัวเลขไม่ครบ 4 ด้าน | เพิ่มหมวด Maintainability (Test coverage, Architecture), ระบุตัวเลข Metric วัดผลได้ชัดเจน |
| **Lab 3** | `reflect.md` (Post-quiz 3) | ❌ ไฟล์ว่างเปล่า (0 bytes) | เขียนตอบ Post-quiz 3 ครบทั้ง 3 ข้อ |
| **Lab 6** | `docker/README.md` | ❌ มีแค่ 12 บรรทัด ขาดคำอธิบายสำคัญ | เพิ่มการเปรียบเทียบ Container vs VM (ESP §5.4), ระบุ Image size, วิธี run และผล test 2xx |
| **Lab 6** | Image บน Registry | ❌ อยู่เฉพาะบน Local ยังไม่ push | Tag เวอร์ชั่น `v0.1.0`, Push ขึ้น Docker Hub/ghcr.io (Public) และแคปภาพแนบใน PR |
| **Lab 6** | `reflect.md` (Post-quiz 6) | ❌ ไฟล์ว่างเปล่า (0 bytes) | ตอบ Post-quiz 6 ครบ 3 ข้อ (Dockerfile draft, Service decomposition Rule of Twos, REST) |
| **Lab 6** | `AI_USAGE.md` | ⚠️ ยังไม่มีหมวด Lab 6 | เพิ่ม Tools, Prompts $\ge 2$, และสัดส่วนโค้ด AI/มนุษย์ สำหรับงาน Dockerfile |
| **Lab 6** | Non-root User ใน stats-service | ⚠️ `stats-service/Dockerfile` ยังรัน root | เพิ่ม `USER node` ใน stage runner ของ `services/stats-service/Dockerfile` |
| **Lab 6** | PR Workflow | ⚠️ ยังไม่มี PR แยกพร้อม Screenshot | ส่งผ่าน branch `feature/lab6-dockerfile` แนบภาพ Screenshot จาก Registry ใน PR |
| **Lab 7** | `reflect.md` (Post-quiz 7) | ❌ ไฟล์ว่างเปล่า (0 bytes) | เขียนตอบ Post-quiz 7 ครบ 3 ข้อ (DRY Hunt, Orthogonality, Refactoring Plan) |
| **Lab 7** | PR Refactor Branch | ⚠️ รวม commit ไว้ใน main | แตก branch `feature/lab7-refactor-<smell-name>` ยืนยัน tests pass และ diff สะอาด |
| **M1** | Part 1: Management (1.5%) | ❌ ขาด DoD + Retrospective | เพิ่มไฟล์ `definition-of-done.md`, บันทึก Retrospective, Issues 8+ ใน Done/Review |
| **M1** | Part 2: Design (1.5%) | ⚠️ ขาด Scenarios & Maintainability NFR | ปรับแก้ Personas, Scenarios ($\ge 6$ ข้อ), User Stories AC, และ NFR ให้ครบตามเกณฑ์ |
| **M1** | Part 3: Code Quality (3.0%) | ⚠️ มีไฟล์ขยะ `test_unit.py` (0 bytes) | ลบไฟล์ `test_unit.py` ออก, โค้ด Next.js และ 19 tests ผ่าน 100% |
| **M1** | Part 4: Docker Docs (1.5%) | ❌ `docker/README.md` ไม่ครบ & ยังไม่ push | อัปเดต `docker/README.md` (ESP §5.4) และ Push image ขึ้น Docker Hub |
| **M1** | Release Tag & Notes | ❌ ยังไม่ได้สร้าง Release Tag | ติด Release Tag `v0.1.0` และเผยแพร่ Release Notes (ทำได้ vs ทำไม่ได้ deliberately) |