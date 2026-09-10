import test from 'node:test';
import assert from 'node:assert/strict';
import { initialJobs } from '@/data/mockJobs';
import { submitApplication, type ApplicationStore, type NotificationService } from '@/services/jobApplication';
import type { JobApplication } from '@/types/job';

test('the application flow connects the job catalogue, store, and notification boundary', () => {
  const job = initialJobs.find((candidate) => candidate.status === 'open');
  assert.ok(job);

  const savedApplications: JobApplication[] = [];
  const notifications: Array<{ to: string; subject: string; body: string }> = [];
  const applicationStore: ApplicationStore = {
    save: (application) => savedApplications.push(application)
  };
  const notificationService: NotificationService = {
    send: (message) => notifications.push(message)
  };

  const result = submitApplication(
    job.id,
    {
      applicantName: 'Integration Student',
      studentId: '65000002',
      faculty: 'Information Technology',
      phone: '081-000-0000',
      freeScheduleNote: 'Available after class',
      appliedAt: '2026-09-09T00:00:00.000Z'
    },
    {
      jobRepository: { findById: (jobId) => initialJobs.find((candidate) => candidate.id === jobId) },
      applicationStore,
      notificationService
    }
  );

  assert.strictEqual(result.ok, true);
  assert.strictEqual(savedApplications.length, 1);
  assert.strictEqual(savedApplications[0].jobId, job.id);
  assert.strictEqual(notifications.length, 1);
  assert.strictEqual(notifications[0].to, job.employer.name);
});
