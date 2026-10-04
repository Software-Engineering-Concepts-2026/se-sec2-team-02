# GitHub Project Board Plan: Job Wanted UP

เอกสารนี้เป็นรายการตั้งต้นสำหรับ GitHub Project Board ของ Sprint 1 โดยใช้ 5 คอลัมน์ดังนี้:

**Backlog → Ready → In Progress → Review → Done**

## Labels

- `user-story` — งานที่ส่งมอบคุณค่าให้ผู้ใช้
- `documentation` — งานแก้ไข Proposal, Persona, Scenario หรือ NFR
- `quality` — งาน Test, Lint, Build และ DoD
- `management` — งาน Board, Review และการจัดการ Sprint

## Issue Cards

| Issue | รายการ | Column เริ่มต้น | Labels |
|---|---|---|---|
| #1 | จัดทำ Definition of Done | Done | documentation, quality |
| #2 | ปรับ Project Proposal ให้ครบ 6 sections | Done | documentation |
| #3 | ปรับ Persona หลักและ Persona รองให้สอดคล้อง Proposal | Done | documentation, user-story |
| #4 | เพิ่ม Scenarios ให้ครบอย่างน้อย 3 ต่อ Persona | Done | documentation, user-story |
| #5 | เพิ่ม Acceptance Criteria ให้ US-06 ถึง US-08 | Done | documentation, user-story |
| #6 | เพิ่ม Feature Quality Bar 4 ข้อ | Done | documentation, quality |
| #7 | เพิ่ม NFR หมวด Maintainability และ Metrics | Done | documentation, quality |
| #8 | เขียน Post-quiz 3 ใน reflect.md | Done | documentation, management |

เมื่อสร้าง Board บน GitHub ให้ใช้ชื่อตารางนี้เป็น Checklist อ้างอิง และย้าย Issue ไปตามสถานะจริงของ Pull Request
