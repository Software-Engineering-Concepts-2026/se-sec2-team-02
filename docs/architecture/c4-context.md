# C4 Model - Level 1: System Context Diagram

```mermaid
C4Context
    title System Context Diagram for Community Connector (JOB UP)

    Person(student, "นิสิต ม.พะเยา", "ผู้หางานพาร์ตไทม์ ค้นหา กรอง และยื่นสมัครงาน")
    Person(employer, "ผู้ประกอบการ / ร้านค้า", "ผู้โพสต์ประกาศรับสมัครงาน และคัดเลือกผู้สมัคร")

    System(job_up, "Community Connector (JOB UP)", "ระบบศูนย์กลางจับคู่และค้นหางานพาร์ตไทม์รอบ ม.พะเยา")

    System_Ext(line, "LINE Notify API", "ส่งข้อความแจ้งเตือนสถานะการสมัครงาน")
    System_Ext(google_maps, "Google Maps API", "แสดงตำแหน่งและคำนวณระยะทางร้านค้า")

    Rel(student, job_up, "ค้นหา กรอง และยื่นสมัครงาน", "HTTPS")
    Rel(employer, job_up, "โพสต์ประกาศงาน และจัดการผู้สมัคร", "HTTPS")
    Rel(job_up, line, "ส่งแจ้งเตือนการตอบรับเข้าทำงาน", "HTTPS/REST")
    Rel(job_up, google_maps, "ดึงข้อมูลพิกัดและแผนที่ร้านค้า", "HTTPS/REST")
    