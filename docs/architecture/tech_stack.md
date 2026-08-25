# Tech Stack Rationale & Alternatives

| Layer | Technology Choice | Rationale (Context-based) | Alternative Considered |
| :--- | :--- | :--- | :--- |
| **Frontend** | React (Vite) + Tailwind CSS | พัฒนา UI ไว โครงสร้าง Component นำกลับมาใช้ใหม่ได้ง่าย มี Ecosystem กว้างขวาง เหมาะกับเวลาพัฒนาที่จำกัด | Vue.js / Svelte (rejected: ทีมมีความคุ้นเคยกับ React มากกว่า) |
| **Backend** | Node.js + Express.js | ทีมมีความคุ้นเคยสูง รองรับ I/O แบบ Asynchronous ได้ดี เหมาะกับระบบที่เน้น API CRUD สำหรับประกาศงาน | Python FastAPI (rejected: ไม่ต้องการเพิ่มความซับซ้อนในการจัดการ Runtime หลายตัว) |
| **Database** | PostgreSQL | เป็น Relational Database ที่มี ACID Compliance สูง ปลอดภัยสำหรับข้อมูลผู้ใช้และการยื่นสมัครงาน | MongoDB (rejected: ข้อมูลมีความสัมพันธ์ชัดเจน เช่น User vs Job Posting) |
| **Hosting & Infra** | Docker + Render / Railway | รองรับ Containerization ทำให้ Deploy บน Cloud ได้สะดวก มี Free Tier เหมาะกับการทดสอบและ Demo | AWS ECS / GCP (rejected: มีความซับซ้อนในการตั้งค่า Infrastructure มากเกินไป) |
| **Authentication** | JWT (JSON Web Token) | เป็น Stateless Authentication ไม่ต้องเก็บ Session บน Server เหมาะสำหรับการขยายระบบในอนาคต | Session-based / OAuth2 (rejected: เพิ่ม Complexity และต้องใช้ Redis เก็บ Session) |