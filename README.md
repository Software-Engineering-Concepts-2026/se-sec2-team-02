# Project: Jobs Phayao
Theme : Community Conector

 A website developed to serve as a hub for connecting job seekers with employers in Phayao province, focusing on part-time, freelance, and general job opportunities in the area.

 Team: 2 หาร
- ญาณาธร ภาชนะ, GitHub: `YanathronPhachana`
- กมลชนก คำนาค, GitHub: `67020724-glitch`
- ภูมินทร์ อุ่นคำ, GitHub: `phoomin2005`
- ทักษ์ดนัย พรมปัญญา, GitHub: `67020971`

--------------------------------------------------------------------------------------------------------------------------

## 🚀 Getting Started

This section explains how to get a local copy of the project up and running for development and testing purposes.

🔧 Tool

- Git hub
- NodeJS
- NextJs
- Firebase
- TypeScript
- VisualCode Studio
- Antigravity CLI
- Codex

---------------------------------------------------------------------------------------------------------------------------

# Step Github command and Befor running the Application

1.  ** Clone the repository: **
    git clone [your-repository-url]

2.  **Configure Firebase Authentication**
   คัดลอก `.env.example` เป็น `.env.local` แล้วกรอก Web app config จาก Firebase Console ในตัวแปร `NEXT_PUBLIC_FIREBASE_*`
   เปิดใช้งาน Email/Password และ Google ในเมนู Authentication > Sign-in method และเพิ่ม `localhost` ใน Authorized domains สำหรับการพัฒนา
   สร้าง Cloud Firestore database และเปิดใช้ Cloud Storage ใน Firebase Console จากนั้น publish rules จาก `firestore.rules` และ `storage.rules` หรือหลังล็อกอิน Firebase CLI แล้วรัน `npx firebase-tools deploy --only firestore:rules,storage`

3.  **Install dependencies**
  - ใช้คำสั่ง `npm install`
  - ใช้คำสั่ง `firebase install`
    
# Running the Application
- Create PR and merge to branch "main"
- WebApp Domain name : https://job-wanted-phayao.vercel.app/

-----------------------------------------------------------------------------------------------------------------------------

## 🏛️ Architecture & Design

Key architectural decisions and diagrams are documented in the `/docs/architecture` directory.

- **[C4 Models & Tech Stack](./docs/architecture/README.md)**
- **[Architectural Decision Records (ADRs)](./docs/architecture/adr/)**
- **[Base Tracer Bullet](./prototypes/sprint1)**
- Base Design of UX/UI : https://www.figma.com/design/3rQGngRwTVC1QRPCzGxyHq/Untitled?node-id=0-1&t=dBZF32uYMfoiRiUk-1&fbclid=PAT01DUAUEeNpwZG9mAmV4dG4DYWVtAjEwAHNydGMGYXBwX2lkDzU2NzA2NzM0MzM1MjQyNwABp6ReXHS-DOc3L_JuNu_B9zOjg_WtC_zbHRnF6Lg84efkyqJNB7klxrY8F3EY_aem_2JSF5m3c5XfJ0tsdamU0YA

## 👥 Requirements

User personas and key scenarios that drive our development are located in the `/docs/requirements` directory.

- **[User Personas](./docs/requirements/personas/)**
- **[Main User Scenario](./docs/requirements/main_scenario.md)**


## Main Function

EN-In the Jobs Phayao web application, upon successfully logging in using a username and password or via a Google account, users are directed to the main page. This page displays various information, such as available job openings and their brief descriptions, along with the status of each job indicating whether it is currently open or closed.

If users want to look for a specific job or job category, they can click the Search button to access the job search page. This page includes a filter window that allows them to narrow down and find exactly what they are looking for.

For users logging in as employers seeking workers, they can post their own job announcements by filling in details such as the job type, wage rate, and the pinned location of the workplace.

Additionally, the user profile page displays personal information, work performance ratings from reviews, and dedicated sections showing a history of posted jobs, past work experiences, and current job applications.

TH-ในเว็บแอพ Jobs Phayao หากทำการเข้าสู่ระบบด้วยการกรอก username และ password หรือเข้าสู่ระบบผ่าน google email สำเร็จแล้ว ผู้ใช้จะเข้าสู่หน้าหลักที่จะแสดงข้อมูลต่างๆเช่น งานที่เปิดรับ และรายระเอียดคร่าวๆของงานนั้น และจะมีสถานะของงานในหน้าว่าปิดรับ หรือยังเปิดรับอยู่ และหากต้องการหางาน หรือประเภทงานที่มีในใจผู้ใช้ก็สามารถกดปุ่ม Search เพื่อเข้าหน้า Search หางานได้โดยที่จะมีหน้าต่าง filter ให้ผู้ใช้สามารถคัดกรองงานที่ต้องการได้ และหากผู้ใช้เข้ามาในฐานะผู้ที่ต้องการหาคนทำงานให้ ผู้ใช้สามารถประกาศเพิ่มงานได้เองโดยใส่รายระเอียดต่างๆ เช่น ประเภทงาน อัตราค่าจ้าง หรือมาร์คพิกัดของสถานที่ทำงาน เป็นต้น และในหน้า profile ของผู้ใช้ยังแสดงข้อมูลต่างๆ เช่น ข้อมูลส่วนตัว คะแนนการทำงานที่มีคนรีวิวให้ หรือส่วนที่เอาไว้แสดงข้อมูลของงานที่เคยโพส งานที่เคยทำ งานที่กำลังยื่นสมัคร เป็นต้น
