# Project: Jobs Wanted Up
Theme : Community Conector

 Team: 2 หาร
- ญาณาธร ภาชนะ, GitHub: `YanathronPhachana`
- กมลชนก คำนาค, GitHub: `67020724-glitch`
- ภูมินทร์ อุ่นคำ, GitHub: `phoomin2005`
- ทักษ์ดนัย พรมปัญญา, GitHub: `67020971`

--------------------------------------------------------------------------------------------------------------------------

## 🚀 Getting Started

This section explains how to get a local copy of the project up and running for development and testing purposes.

🔧 Tool

- Git
- NodeJS
- NextJs
- Firebase
- Typesript
- VisualCode Studio
- Antigravity CLI

---------------------------------------------------------------------------------------------------------------------------

# Step Github command and Befor running the Application

1.  ** Clone the repository: **
    git clone [your-repository-url]

2.  ** .env  add**
   เพิ่มไฟล์ใหม่ที่ @root folder แล้วตั้งชื่อไฟล์ว่า .env
   และนำ code ข้างล่างนี้ไปว่างไว้ในไฟล์ .env
   [API KEY for Firebase]

3.  ** install firebase framework **
   ใช้คำสั่ง npm install firebase

4.  ** install nodejs.module libary **
   ใช้คำสั่ง npm install
    
# Running the Application

1.  ** Run the services: **
    
    # Example for a single service
    cd services/stats-service
    docker build -t your-team/stats-service .
    docker run -p 5001:5000 your-team/stats-service
    ```

-----------------------------------------------------------------------------------------------------------------------------

## 🏛️ Architecture & Design

Key architectural decisions and diagrams are documented in the `/docs/architecture` directory.

- **[C4 Models & Tech Stack](./docs/architecture/README.md)**
- **[Architectural Decision Records (ADRs)](./docs/architecture/adr/)**

## 👥 Requirements

User personas and key scenarios that drive our development are located in the `/docs/requirements` directory.

- **[User Personas](./docs/requirements/personas/)**
- **[Main User Scenario](./docs/requirements/main_scenario.md)**
