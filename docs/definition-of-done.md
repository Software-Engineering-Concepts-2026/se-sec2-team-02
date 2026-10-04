# Definition of Done (DoD)

งานของทีมจะถือว่าเสร็จสมบูรณ์เมื่อผ่านเกณฑ์ต่อไปนี้ครบถ้วน:

- [ ] **Acceptance Criteria:** Acceptance Criteria ของ User Story ผ่านครบทุกข้อ รวมทั้ง Happy Path และ Edge Case ที่เกี่ยวข้อง
- [ ] **Test:** มีการเพิ่มหรือปรับปรุง Automated Test ที่เหมาะสม และ Test Suite ผ่านทั้งหมด
- [ ] **Lint:** คำสั่ง `npm run lint` ทำงานสำเร็จโดยไม่มี error
- [ ] **Build:** คำสั่ง `npm run build` ทำงานสำเร็จ และไม่มี warning ที่กระทบการส่งมอบ
- [ ] **PR Review:** Pull Request ได้รับการตรวจสอบจากสมาชิกทีมอย่างน้อย 1 คน และไม่มีข้อคิดเห็นที่ยังค้างอยู่
- [ ] **Documentation:** เอกสารที่เกี่ยวข้อง เช่น Requirements, Scenario และ README ถูกอัปเดตให้ตรงกับพฤติกรรมจริงของระบบ
- [ ] **Security & Hygiene:** ไม่มี Secret, Credential หรือไฟล์ชั่วคราวถูก commit และการเปลี่ยนแปลงไม่ทำให้ฟีเจอร์เดิมเสียหาย
