# Prototype Document: Community Connector (Sprint 1)

## Feature & User Story Reference
* **Feature:** ระบบค้นหาและตัวกรองงานพาร์ตไทม์ (Search & Filter)
* **User Story:** `[US-01] ค้นหางานตามตัวกรองช่วงเวลาและสถานที่` (Must Priority)
* **Owner:** Kamolchanok (`kamolchanok_search_prototype.html`)

## Architecture Choice: Tracer Bullet vs Prototype
* **ประเภท:** **Tracer Bullet**
* **เหตุผล:** พัฒนาด้วยโครงสร้าง HTML/CSS/JS จริง ที่สามารถนำไปเชื่อมต่อกับ API/Database เพื่อใช้งานต่อใน Sprint 2 ได้ทันที ไม่ต้องรื้อทิ้ง

## Scope of Implementation

### สิ่งที่ทำได้ (Implemented)
1. แสดงรายการงานพาร์ตไทม์พร้อมรายละเอียดสถานที่ เวลา และอัตราค่าตอบแทน
2. มีระบบค้นหาและตัวกรองงานตามเงื่อนไขสถานที่และเวลา
3. แสดงผลแบบ Interactive บน Browser รันได้จริงโดยไม่พึ่ง Framework

### สิ่งที่ไม่ได้ทำ (Deliberately Out of Scope)
1. การเชื่อมต่อฐานข้อมูล Database จริง (ยังใช้ Mock Data)
2. ระบบตรวจสอบสิทธิ์เข้าใช้งาน (Authentication)
3. การส่งข้อมูลใบสมัครเข้าสู่ระบบหลังบ้านจริง

## Next Steps (Sprint 2)
1. เชื่อมต่อ Backend API เพื่อดึงข้อมูลงานจาก Database
2. เพิ่มระบบกดยืนยันการสมัครงานแบบบันทึกข้อมูลจริง