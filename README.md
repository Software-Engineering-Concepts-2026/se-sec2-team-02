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

