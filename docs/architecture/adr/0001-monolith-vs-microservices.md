# ADR 0001: เริ่มต้นพัฒนาด้วย Monolith Architecture

## Status
Accepted — 2026-08-25

## Context
- ทีมพัฒนาประกอบด้วยนิสิต 4 คน ระยะเวลาดำเนินงานรวม 8 สัปดาห์
- ระบบเป้าหมายคือ Community Connector (JOB UP) สำหรับรองรับผู้ใช้งานนิสิต ม.พะเยา ช่วงเริ่มต้นคาดการณ์ผู้ใช้งาน ~200-500 คน/วัน
- ต้องนำเสนอ MVP/Interactive Prototype ที่ทำงานได้ครบวงจรใน Sprint 2
- ทีมไม่มี DevOps Specialist โดยเฉพาะสำหรับดูแล Infrastructure ขนาดใหญ่

## Decision
เลือกใช้สถาปัตยกรรมแบบ **Monolith (Modular Monolith)** โดยเขียน Backend ด้วย Node.js + Express ที่แยกโครงสร้าง Logic ภายในเป็น Module ชัดเจน (เช่น Auth Module, Job Module, Application Module) และรันระบบทั้งหมดบน Process เดียวกัน

## Consequences
- ✅ **ข้อดี:** สะดวกต่อการพัฒนา Build และ Deploy ในระยะเวลาสั้น
- ✅ **ข้อดี:** ลดความซับซ้อนด้าน Network, Distributed Tracing และ Infrastructure
- ✅ **ข้อดี:** พัฒนาทดสอบ End-to-End ได้ง่ายโดยไม่ติดปัญหาสภาพแวดล้อมระบบ
- ❌ **ข้อเสีย:** หากในอนาคตมี Traffic สูงขึ้นมาก จะไม่สามารถแยก Scale เฉพาะ Module ที่มีการใช้งานหนักได้ทันที
- ❌ **ข้อเสีย:** ทุกระบบย่อยต้องใช้ Tech Stack เดียวกันทั้งหมด

## Alternatives Considered
- **Microservices Architecture:** ถูกปฏิเสธ เนื่องจากสร้าง Overhead ในการจัดทำ Deployment Pipeline, Service Discovery และเครือข่ายระหว่าง Microservices สูงเกินกว่าศักยภาพของทีมในช่วงเวลาที่กำหนด
- **Serverless Architecture:** ถูกปฏิเสธ เนื่องจากมีโอกาสเกิดปัญหา Cold Start และจัดการยากในขั้นตอนการทดสอบพัฒนาแบบ Local