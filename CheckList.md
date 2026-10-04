# Lab07-W7_Refactoring_Milestone1

# ใบงานปฏิบัติการ Lab 7

# Refactoring Commit + Milestone 1 Submission

> **รายวิชา**: แนวคิดวิศวกรรมซอฟต์แวร์ · **รหัสวิชา**: 225311
**สัปดาห์ที่ 7 · ภาคเรียนที่ 1 ปีการศึกษา 2569เวลา**: 2 ชั่วโมง (ห้องปฏิบัติการ) · **คะแนน**: 3.5% (Lab) + **Milestone 1 = 7.5%** (เพิ่มเติม)
⚠️ **CHECKPOINT กลางภาค** — Milestone 1 ใช้เป็นฐานประเมิน 20% (MS1 7.5% + Final 12.5%)
**อาจารย์ผู้สอน**: ธรรมรัตน์ ธรรมา · สาขาวิทยาการคอมพิวเตอร์ คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา
**ส่งงานผ่าน**: GitHub Pull Request (refactor) + GitHub Release Tag v0.1.0 (Milestone 1) + reflect.md จาก Post-quiz 7
> 

---

## 1. วัตถุประสงค์เชิงพฤติกรรม (Behavioral Objectives)

เมื่อทำ Lab นี้เสร็จ นิสิตสามารถ

1. **ระบุ** code smell ใน codebase ของทีม โดยใช้ SCG Ch.7 workflow (ให้ AI ช่วย list smells)
2. **Refactor** โค้ดอย่างมีวินัย — Tests pass ก่อน, commit บ่อย, ไม่ผสม feature (PP Tip 65)
3. **ใช้ AI** ในการ refactor แบบ “explain → propose → apply → test” โดยทีมเขียนเอง ≥ 70%
4. **บันทึก** Refactoring Journal ที่อธิบาย smell · AI usage · Before/After · lesson learned
5. **ส่ง Milestone 1** — Project Management + Requirements & Design + Code Quality + Repo & Docker ครบทั้ง 4 ส่วน (7.5%)
6. **สร้าง GitHub Release Tag v0.1.0** พร้อม Release Notes สรุปสิ่งที่ทำได้และทำไม่ได้ (deliberately)

**สอดคล้องกับ Learning Outcomes**: LO1, LO2, LO5, LO6, LO9

**อ้างอิงเนื้อหาบทเรียน**: บทที่ 7 — การเขียนโค้ดอย่างมีคุณภาพและปรัชญา Pragmatic

---

## 2. เนื้อหาที่ต้องอ่านก่อนทำ Lab (Pre-lab Reading)

กรุณาอ่านเนื้อหาก่อนเข้าห้องปฏิบัติการ (อ่านจาก slide deck ของบทที่ 7 หรือ PDF ตำรา):

- **[PP] Ch.2** — ETC · DRY (5 duplication types) · Orthogonality · Reversibility
- **[PP] Ch.7 T40** — Refactoring (Fowler): tests pass ก่อน
- **[PP] Ch.7 T65** — Software is Like a Garden · Refactor Early, Refactor Often
- **[PP] Ch.7 T74** — Naming: role-focused, semantic drift = rename ทันที
- **[SE] Ch.7** — Implementation, code quality
- **[SCG] Ch.7** — Reading Code Bases with GenAI (workflow: explain → propose → apply → test)
- **ทีมของคุณ’s codebase** (จาก Sprint 1–2) — source code + tests

**คำถามนำก่อนทำ Lab** (ให้คิดมาก่อนเข้าคาบ):
- *ทีมเจอ code smell อะไรที่ “เห็นได้ชัด” และแก้ได้ใน 30 นาที?*
- *Tests ของทีม pass อยู่ไหม? ถ้าไม่ → ต้องแก้ tests ก่อน refactor (Fowler)*

---

## 3. เครื่องมือและบัญชีที่ต้องเตรียม (Materials & Tools)

| รายการ | รายละเอียด |
| --- | --- |
| **GitHub Account** | บัญชีส่วนตัว (ใช้ account เดียวกับ Lab 1–6) |
| **Team Repository** | Sprint 1–2 source code + tests + Docker setup |
| **AI Tool** | GitHub Copilot (IDE) หรือ ChatGPT/Claude (web) — เลือก 1 ตัว |
| **Project Board** | GitHub Projects — มี issues 8+ ใน Done/Review พร้อม label |
| **Post-quiz 7** | `reflect.md` จากคาบบรรยาย (DRY Hunt + Orthogonality Check + Refactoring Plan) |
| **Test Runner** | `npm test` / `pytest` / `go test` — ต้องรันได้ |

---

## 4. สิ่งที่ต้องส่ง (Deliverables)

ส่งผ่าน **GitHub Pull Request + Release Tag** ภายในสิ้นสุด Lab (2 ชม.):

### 4.1 Lab 7 — Refactoring Commit (3.5%)

| ไฟล์/Artifact | เนื้อหา | เกณฑ์ |
| --- | --- | --- |
| **PR** `feature/lab7-refactor-<smell-name>` | Refactor ≥ 1 code smell + tests pass | Diff สะอาด · commit message ชัด |
| `docs/refactoring-journal.md` | Smell · AI usage · Before/After · Lesson | ครบทั้ง 4 sections |
| `reflect.md` (root) | Post-quiz 7 (merge จาก feature branch) | 3 reflection |
| `AI_USAGE.md` (root) | อัปเดต: prompts · parts received from AI | ครบทั้ง 3 sections |

### 4.2 Milestone 1 Submission (7.5%) — **ต้องครบทุกข้อ**

| ส่วน | คะแนน | ไฟล์/Artifact |
| --- | --- | --- |
| **1. Project Management & Process** | 1.5% | Project Board + DoD + Sprint retrospective |
| **2. Requirements & Design Artifacts** | 1.5% | personas · scenarios · user-stories · C4 · ADR |
| **3. Code Quality** | 3% | source code · tests pass · refactor · DRY/Orthogonality |
| **4. Repository & Docker Documentation** | 1.5% | README · docker/README.md · Dockerfile · image |

**Release Tag**: `v0.1.0` + Release Notes (สรุปสิ่งที่ทำได้ + ทำไม่ได้ deliberately)

---

## 5. ขั้นตอนการปฏิบัติ (Step-by-Step)

> **ก่อนเริ่ม Lab 7** — ตรวจสอบว่านิสิตได้ทำ Post-quiz จากคาบบรรยายแล้ว (จาก §7.7 ในบทเรียน)
- ถ้ายังไม่ได้ทำ → ให้ทำ Post-quiz 3 ข้อ (DRY Hunt + Orthogonality Check + Refactoring Plan) ใน 15 นาทีแรกของ Lab
- **ทั้ง 3 reflection** จะถูกใช้เป็น starter สำหรับ Lab 7 ทั้ง 3 exercise + ส่วนหนึ่งของ Milestone 1
> 

### Step 1: ทบทวน Artifacts + ตั้งเป้า (15 นาที)

1. ทบทวน artifacts ที่ส่งมาแล้ว (Lab 1–6) — มีอะไรขาด? อะไรยังไม่ทำงาน?
2. ทีมตั้งเป้า: **refactor ≥ 1 smell ที่ “เห็นได้ชัด”** ใน 1 ชม. ที่เหลือ
3. ตรวจสอบ Milestone 1 checklist (ดู §6) — แต่ละข้อต้องครบ

### Step 2: ระบุ Code Smell ด้วย AI (15 นาที)

1. ใช้ **SCG Ch.7 workflow**: ให้ AI อ่าน codebase แล้ว list smells:
    
    > *“อ่าน `src/` ของโปรเจกต์นี้ แล้ว list 5 code smells ที่เจอบ่อยที่สุด พร้อม file/line และเหตุผล”*
    > 
2. ทีมเลือก **1 smell ที่**:
    - เห็นชัดเจน
    - แก้ได้ใน **30 นาที** (ไม่ใช่ architectural refactor)
    - Tests pass หลังแก้ (ถ้ายังไม่มี test → ต้องเขียนก่อน)
3. **ตัวอย่าง smell ที่ดี**: Long method · Magic number · Duplicated code · Poor naming (semantic drift)

### Step 3: Refactor ด้วย AI Workflow (45 นาที)

1. Branch ใหม่ `feature/lab7-refactor-<smell-name>`
2. **เขียน test ก่อน refactor** (ถ้ายังไม่มี) — เพื่อยืนยัน behavior คงเดิม
3. Refactor ด้วย workflow **explain → propose → apply → test** (อ้าง SCG Ch.10):
    
    ```
    1. Explain:  ให้ AI อธิบาย code smell + ทำไมถึงเป็น smell
    2. Propose:  ให้ AI เสนอ refactor — ทีมต้องเข้าใจก่อน apply
    3. Apply:    ทีมเขียนเอง ≥ 70%, AI ช่วยเป็น snippet
    4. Test:     รัน tests + manual smoke test
    ```
    
4. **สำคัญ**: ทีมต้องอธิบายได้ว่าทำไมเปลี่ยนแบบนี้ (PP Tip 62 — deliberate programming)
5. Commit message ที่ชัดเจน:
    
    ```
    refactor: extract method `calculateDiscount` from `processOrder`
    
    - Reduces Long Method (45 lines → 3 calls)
    - Improves testability
    - AI-assisted (Copilot suggested extraction, team reviewed)
    - Tests pass
    ```
    

### Step 4: Refactoring Journal (10 นาที)

1. เขียน `docs/refactoring-journal.md` ที่ root ของ repo:
    - **Smell ที่เจอ**: อะไร, ที่ไหน (file/line), ทำไมถือว่า smell
    - **AI usage**: prompt ที่ใช้ + output (ถ้ามี) + ส่วนที่ทีมเขียนเอง
    - **Before/After**: ความยาว function, coupling, testability
    - **Lesson**: อะไรที่เรียนรู้ + AI workflow ที่ใช้

### Step 5: Milestone 1 Submission (35 นาที)

1. ตรวจสอบ Milestone 1 checklist (ดู §6) — แต่ละข้อต้องครบ
2. สร้าง **GitHub Release Tag** `v0.1.0`:
    
    ```bash
    git tag -a v0.1.0 -m "Milestone 1: Sprint 0-2 complete"
    git push origin v0.1.0
    ```
    
3. เขียน **Release Notes** ใน GitHub Release — สรุปว่ามีอะไร, ทำอะไรได้, ทำอะไรไม่ได้ (deliberately)
4. PR ปิด Lab 7 (refactor) แยกจาก Milestone 1 — merge ทั้งคู่ก่อนหมดเวลา

---

## 6. Milestone 1 Rubric (7.5%)

### 1. Project Management & Process (1.5%)

| Full (1.5%) | Partial (0.75%) | None (0%) |
| --- | --- | --- |
| Project Board มี issues 8+ ใน Done/Review พร้อม label ที่ถูก; DoD ใน `docs/`; Sprint Zero + Sprint 1 มีหลักฐาน retrospective | Board มีแต่ไม่ครบทุก issue / ไม่มี DoD | ไม่มี Board |

### 2. Requirements & Design Artifacts (1.5%)

| Full (1.5%) | Partial (0.75%) | None (0%) |
| --- | --- | --- |
| personas.md + scenarios.md + user-stories.md + nfr.md ครบ; C4 Context + Container render ได้; ADR ≥ 1 ฉบับ | ขาด 1–2 files หรือ ADR ไม่ครบ | ขาด ≥ 2 files |

### 3. Code Quality (3%)

| Full (3%) | Partial (1.5%) | None (0%) |
| --- | --- | --- |
| source code ≥ 1 user story ทำงานได้จริง + ≥ 1 unit test pass + refactor ≥ 1 smell + DRY/Orthogonality ชัด | ทำงานได้แต่ไม่มี test หรือ refactor | build ไม่ผ่านหรือไม่ทำงาน |

### 4. Repository & Docker Documentation (1.5%)

| Full (1.5%) | Partial (0.75%) | None (0%) |
| --- | --- | --- |
| README.md ครบ (install/run/architecture); docker/README.md ครบ; Dockerfile build + run ได้; image บน Docker Hub | ขาด Dockerfile หรือ README ไม่ครบ | ไม่มี docs |

> **หมายเหตุ**: Milestone 1 เป็น **Completion and Effort** — ต้องได้ครบทุกส่วนเพื่อ full score
> 

---

## 7. นโยบายการใช้ Generative AI (AI Usage Guidance)

| ✅ อนุญาต | ❌ ไม่อนุญาต |
| --- | --- |
| ใช้ AI list smells (อ่าน codebase + suggest) | **ห้าม** apply AI’s refactor โดยไม่เข้าใจ — ทีมต้องอธิบายได้ (PP T62 deliberate) |
| ใช้ AI propose refactor strategy (อธิบาย + เสนอทางเลือก) | **ห้าม** ให้ AI เขียน refactor ทั้งหมด — ทีมเขียนเอง ≥ 70% |
| ใช้ AI อธิบาย layer ที่ซับซ้อน (regex, recursion) | **ห้าม** refactor + feature ใน commit เดียว (ละเมิด PP T65) |
| ใช้ AI suggest test cases | ห้ามแก้ tests เพื่อให้ pass — tests ต้องสะท้อน behavior จริง |

**ต้องเปิดเผย** ใน `AI_USAGE.md`:
- เครื่องมือ: <Copilot/ChatGPT/Claude/etc.>
- Prompts ที่ใช้ (≥ 3 prompts: list smells · propose refactor · explain layer)
- ส่วนที่รับจาก AI ตรง ๆ (ไม่แก้)

---

## 8. ข้อควรระวัง (Common Pitfalls)

> **❌ Refactor + เพิ่ม feature พร้อมกัน** — ละเมิด PP Tip 65 (Software is Like a Garden) · ทำทีละอย่าง
> 

> **❌ Tests fail หลัง refactor** — ไม่ผ่าน Milestone 1 · ต้อง revert + แก้ tests ก่อน
> 

> **❌ Milestone ส่งโดยไม่ทดสอบ end-to-end** — `docker compose up` แล้วพัง — ทดสอบจริงก่อน release tag
> 

> **❌ Release notes ว่างเปล่า** (“initial commit”) — ผู้ตรวจไม่รู้ว่าส่งอะไร
> 

> **❌ “AI ทำให้หมด”** ใน refactor — ทีมต้องอธิบายได้ว่าทำไมเปลี่ยนแบบนี้
> 

> **❌ Refactor ครั้งใหญ่** — เปลี่ยน 100 จุดใน 1 PR — review ยาก merge conflict
> 

> **❌ Tests ผ่านเพราะแก้ test** — tests ต้องสะท้อน behavior จริง ไม่ใช่ผ่านเพราะเปลี่ยน assertion
> 

> **❌ ไม่ merge reflect.md** — ขาด input สำคัญของ Milestone
> 

---

## 9. ความท้าทายเพิ่มเติม (Stretch Goals)

สำหรับนิสิตที่ทำเสร็จก่อน — ลองทำเพิ่ม (ไม่บังคับ ไม่คิดคะแนนเพิ่ม):

- **Refactor หลาย smell** พร้อมกัน (≥ 3 PRs แยก) — แต่ละ PR เล็ก ง่ายต่อ review
- **Property-Based Test** (PP Tip 71) กับ business rule — ทดสอบ edge cases อัตโนมัติ
- **ตั้ง CI workflow** (Lab 10 preview) — `npm test` ทุก PR
- **เขียน ADR ที่ 2-3** — database, auth, deployment — เก็บ institutional memory
- **Refactoring workshop ข้ามทีม** — อ่าน ADR/code ทีมอื่น + comment suggestion

---

## 10. การส่งงาน

1. **Pull Request** `feature/lab7-refactor-<smell-name>` — refactor + tests pass — merge ก่อนหมดเวลา
2. **`docs/refactoring-journal.md`** — ครบทั้ง 4 sections (Smell · AI usage · Before/After · Lesson)
3. **`reflect.md`** (root) — Post-quiz 7 (merge จาก feature branch)
4. **`AI_USAGE.md`** (root) — อัปเดต
5. **GitHub Release Tag** `v0.1.0` — push แล้ว
6. **Release Notes** — สรุปสิ่งที่ทำได้ + ทำไม่ได้ deliberately

> **Due**: สิ้นสุด Lab ภายใน 2 ชั่วโมง (MS1 ส่งช้า = หักคะแนนรายวัน)
> 

---

## 11. เชื่อมโยงบทเรียน

แนวคิดที่ใช้ใน Lab 7 นี้จะถูกนำไปใช้ตลอดภาคการศึกษา:

- **ETC** → เกณฑ์ตัดสิน design ทุกข้อ — “เปลี่ยนง่ายไหม?”
- **DRY (5 types)** → ตรวจ codebase ทุก sprint — ลด technical debt สะสม
- **Orthogonality** → เปลี่ยน A ไม่กระทบ B — ทำให้ deploy ปลอดภัย
- **Refactor discipline** → tests pass ก่อน · commit บ่อย · ไม่ผสม feature
- **Naming** → role-focused · semantic drift = rename ทันที
- **AI as co-pilot** → explain → propose → apply → test — เขียนเอง ≥ 70%
- **Post-quiz** → ใช้ในทุกบทเพื่อเตรียม Sprint ถัดไป + Milestone
- **AI_USAGE.md** → ใช้ในทุก Lab / Sprint — ต้องอัปเดต

---

## 12. บรรณานุกรมประจำ Lab

- Hunt, A., & Thomas, D. (2019). *The Pragmatic Programmer: Your Journey to Mastery* (2nd ed.). Addison-Wesley Professional. Tips 14–18, 40, 45–46, 62, 65, 74.
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley.
- Martin, R. C. (2008). *Clean Code*. Prentice Hall.
- Sommerville, I. (2016). *Software Engineering* (10th ed.). Pearson. Chapter 7.
- Herszfang, H. P., & Henstock, P. V. (2025). *Supercharged Coding with GenAI*. Packt Publishing. Chapter 7, 10.
- เอกสารประกอบการสอน บทที่ 7 — การเขียนโค้ดอย่างมีคุณภาพและปรัชญา Pragmatic

---

*ใบงานนี้จัดทำโดย: ธรรมรัตน์ ธรรมา · สาขาวิทยาการคอมพิวเตอร์ คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา · ภาคเรียนที่ 1 ปีการศึกษา 2569*