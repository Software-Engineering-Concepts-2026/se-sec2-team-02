'use client';

import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Job, JobApplication } from '@/types/job';

interface ApplyModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSubmitApplication: (application: JobApplication) => void;
}

export default function ApplyModal({
  job,
  isOpen,
  onClose,
  onSubmitApplication
}: ApplyModalProps) {
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [freeScheduleNote, setFreeScheduleNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !phone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const application: JobApplication = {
        jobId: job.id,
        applicantName,
        phone,
        freeScheduleNote,
        appliedAt: new Date().toISOString()
      };
      onSubmitApplication(application);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      {/* Container: Sized appropriately with max height 90vh and clean header/body/footer */}
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-zinc-200/80 animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Fixed Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              ยื่นใบสมัครงาน
            </span>
            <h2 className="text-lg sm:text-xl font-black text-zinc-900 leading-tight mt-0.5">
              {job.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="applyJobForm" onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto space-y-3.5 flex-1 text-sm">
          {/* Quick Job Context */}
          <div className="p-3 bg-zinc-50 rounded-xl text-xs text-zinc-600 flex items-center justify-between border border-zinc-100">
            <span className="truncate max-w-[240px]">{job.location}</span>
            <span className="font-bold text-zinc-900">{job.salary} บาท/{job.salaryUnit}</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              ชื่อ - นามสกุล <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              placeholder="เช่น นันทิดา ศรีสุวรรณ"
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 focus:border-zinc-900 focus:outline-hidden text-xs sm:text-sm text-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              เบอร์โทรศัพท์ติดต่อ <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="เช่น 089-123-4567"
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 focus:border-zinc-900 focus:outline-hidden text-xs sm:text-sm text-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              ช่วงเวลาว่างที่พร้อมทำงาน / ข้อมูลเพิ่มเติม
            </label>
            <textarea
              rows={2}
              value={freeScheduleNote}
              onChange={(e) => setFreeScheduleNote(e.target.value)}
              placeholder="เช่น พร้อมทำงานวันจันทร์-พฤหัสบดี หลัง 17:00 น. หรือวันเสาร์-อาทิตย์"
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 focus:border-zinc-900 focus:outline-hidden text-xs sm:text-sm text-zinc-900 resize-none"
            />
          </div>
        </form>

        {/* Fixed Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-100 flex items-center justify-end gap-3 shrink-0 bg-zinc-50/80 backdrop-blur-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-200/70 transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            form="applyJobForm"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <span>กำลังส่งข้อมูล...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>ยืนยันการสมัคร</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
