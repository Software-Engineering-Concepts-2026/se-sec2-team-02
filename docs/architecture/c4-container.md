# C4 Model - Level 2: Container Diagram

```mermaid
C4Container
    title Container Diagram for Community Connector (JOB UP)

    Person(student, "นิสิต ม.พะเยา", "ผู้หางานพาร์ตไทม์")
    Person(employer, "ผู้ประกอบการ", "ผู้โพสต์งาน")

    System_Boundary(job_up_boundary, "Community Connector System") {
        Container(web_app, "Single-Page Application", "React + Vite", "หน้าจอผู้ใช้งานสำหรับค้นหางาน โพสต์งาน และจัดการสถานะ")
        Container(api_app, "API Application", "Node.js + Express", "ให้บริการ RESTful API ประมวลผล Business Logic และ Authentication")
        ContainerDb(database, "Database", "PostgreSQL", "เก็บข้อมูลผู้ใช้งาน ประกาศงาน ประวัติการสมัครงาน")
    }

    System_Ext(line, "LINE Notify API", "บริการส่งข้อความแจ้งเตือน")
    System_Ext(google_maps, "Google Maps API", "บริการข้อมูลแผนที่")

    Rel(student, web_app, "ใช้งานผ่าน Browser", "HTTPS")
    Rel(employer, web_app, "ใช้งานผ่าน Browser", "HTTPS")
    
    Rel(web_app, api_app, "เรียกใช้งาน API", "HTTPS/JSON")
    Rel(api_app, database, "อ่านและบันทึกข้อมูล", "SQL/TCP")
    
    Rel(api_app, line, "ส่งข้อความแจ้งเตือน", "HTTPS/JSON")
    Rel(api_app, google_maps, "ขอข้อมูลพิกัดสถานที่", "HTTPS/JSON")