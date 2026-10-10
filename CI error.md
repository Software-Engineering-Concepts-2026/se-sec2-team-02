
แก้ปัญหาที่ CI ล้มเหลว
ปัญหาหลักคือ ESLint พังจากข้อผิดพลาด 13 รายการ โดยส่วนใหญ่เป็น:

setState ถูกเรียกใน useEffect
any ที่ TypeScript ไม่ยอม
JSX มีเครื่องหมายคำพูดที่ไม่ได้ escape
import ที่ไม่ได้ใช้
สิ่งที่ต้องแก้
1) setState ใน useEffect
นี่คือสาเหตุหลักที่ lint บอกว่า:

react-hooks/set-state-in-effect
ตัวอย่างจากไฟล์:

src/app/edit/[id]/page.tsx
src/app/review/page.tsx
src/components/MapPickerModal.tsx
src/context/JobContext.tsx
สิ่งที่ควรทำคือ:

ตรวจให้แน่ใจว่า state อัปเดตอยู่ภายใน if ที่มีเงื่อนไขที่เหมาะสม
หรือหลีกเลี่ยงการตั้งค่า state จาก effect โดยตรงถ้าสามารถคำนวณได้จาก props/state เอง
ตัวอย่าง:

TSX
useEffect(() => {
  if (!originalJob) return;

  setTitle(originalJob.title);
  setSalary(originalJob.salary);
  setSalaryUnit(originalJob.salaryUnit);
}, [originalJob]);
ถ้า isEffect นี้ทำให้มี render ซ้ำเพราะ update state เยอะเกินไป ให้เปลี่ยนเป็นวิธีที่ไม่ sync state ทันที เช่น:

ใช้ useMemo หรือคำนวณค่าเริ่มต้นได้ล่วงหน้า
หรือ set state เฉพาะเมื่อข้อมูลเปลี่ยนจริง
2) ใช้ any ใน TypeScript
Lint บอก:

Unexpected any. Specify a different type
พบที่:

src/components/LocationMapViewer.tsx
src/components/MapPickerModal.tsx
ต้องแทนที่ด้วย type ที่ชัดเจน เช่น:

TSX
const mapInstanceRef = useRef<L.Map | null>(null);
const markerInstanceRef = useRef<L.Marker | null>(null);
หรือถ้า import จาก leaflet แบบพิเศษ:

TSX
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
แล้ว:

TSX
const mapInstanceRef = useRef<LeafletMap | null>(null);
const markerInstanceRef = useRef<LeafletMarker | null>(null);
3) escape quotes ใน JSX
พบที่:

src/components/ProfileView.tsx
ตัวอย่างปัญหา:

TSX
<span>• เวลาที่สะดวก: "{app.freeScheduleNote}"</span>
ควรเป็น:

TSX
<span>• เวลาที่สะดวก: &quot;{app.freeScheduleNote}&quot;</span>
หรือ:

TSX
<span>{`• เวลาที่สะดวก: "${app.freeScheduleNote}"`}</span>
4) import ที่ไม่ได้ใช้
หลายไฟล์มี import ที่ไม่ได้ใช้ เช่น:

Link ใน src/app/review/page.tsx
Navigation ใน LocationMapViewer.tsx
Search ใน MapPickerModal.tsx
ให้ลบออก:

TSX
import Link from 'next/link'; // ถ้าไม่ใช้ ให้ลบ
ตัวอย่าง Fix ที่แนะนำ
src/components/LocationMapViewer.tsx
TSX
import React, { useEffect, useRef } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import type { Map as LeafletMap } from 'leaflet';
import { Coordinates } from '@/types/job';

const mapInstanceRef = useRef<LeafletMap | null>(null);
src/components/MapPickerModal.tsx
TSX
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Check, X, Compass, Layers } from 'lucide-react';
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';

const mapInstanceRef = useRef<LeafletMap | null>(null);
const markerInstanceRef = useRef<LeafletMarker | null>(null);
src/components/ProfileView.tsx
TSX
<p className="mt-3 text-xs sm:text-sm text-zinc-700 leading-relaxed whitespace-pre-line pl-2.5 border-l-2 border-amber-300">
  &quot;{r.comment}&quot;
</p>
สรุป
คำสั่งที่ควรทำตอนท้ายคือ:

bash
npm run lint
และหลังแก้ให้โค้ดสะอาด lint จะผ่านได้


