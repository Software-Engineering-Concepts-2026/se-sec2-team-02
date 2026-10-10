import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleTestJobs } from './fixtures/sampleJobs';
import {
  submitApplication,
  type ApplicationDetails,
  type ApplicationStore,
  type JobRepository,
  type NotificationService
} from '@/services/jobApplication';

class InMemoryApplicationStore implements ApplicationStore {
  private readonly applications = new Map<string, ApplicationDetails & { jobId: string }>();

  save(application: ApplicationDetails & { jobId: string }): void {
    this.applications.set(`${application.jobId}:${application.studentId}`, application);
  }

  get(jobId: string, studentId: string): (ApplicationDetails & { jobId: string }) | undefined {
    return this.applications.get(`${jobId}:${studentId}`);
  }
}

class NotificationMock implements NotificationService {
  readonly calls: Array<{ to: string; subject: string; body: string }> = [];

  send(message: { to: string; subject: string; body: string }): void {
    this.calls.push(message);
  }
}

const application: ApplicationDetails = {
  applicantName: 'Test Student',
  studentId: '65000001',
  faculty: 'Computer Science',
  phone: '080-000-0000',
  freeScheduleNote: 'Available on weekends',
  appliedAt: '2026-09-09T00:00:00.000Z'
};

test('submitApplication accepts an open job using a repository stub', () => {
  const openJob = sampleTestJobs.find((job) => job.status === 'open');
  assert.ok(openJob);

  const repositoryStub: JobRepository = {
    findById: () => openJob
  };
  const store = new InMemoryApplicationStore();
  const notifier = new NotificationMock();

  const result = submitApplication(openJob.id, application, {
    jobRepository: repositoryStub,
    applicationStore: store,
    notificationService: notifier
  });

  assert.deepStrictEqual(result, {
    ok: true,
    application: { ...application, jobId: openJob.id }
  });
  assert.deepStrictEqual(store.get(openJob.id, application.studentId), {
    ...application,
    jobId: openJob.id
  });
});

test('submitApplication notifies the employer exactly once using a mock', () => {
  const openJob = sampleTestJobs.find((job) => job.status === 'open');
  assert.ok(openJob);
  const notifier = new NotificationMock();

  submitApplication(openJob.id, application, {
    jobRepository: { findById: () => openJob },
    applicationStore: new InMemoryApplicationStore(),
    notificationService: notifier
  });

  assert.strictEqual(notifier.calls.length, 1);
  assert.deepStrictEqual(notifier.calls[0], {
    to: openJob.employer.name,
    subject: `New application: ${openJob.title}`,
    body: `${application.applicantName} applied for ${openJob.title}.`
  });
});

test('submitApplication rejects a missing or closed job without side effects', () => {
  const closedJob = sampleTestJobs.find((job) => job.status === 'closed');
  assert.ok(closedJob);
  const store = new InMemoryApplicationStore();
  const notifier = new NotificationMock();
  const dependencies = {
    jobRepository: { findById: (jobId: string) => (jobId === closedJob.id ? closedJob : undefined) },
    applicationStore: store,
    notificationService: notifier
  };

  assert.deepStrictEqual(submitApplication('missing-job', application, dependencies), {
    ok: false,
    reason: 'job-not-found'
  });
  assert.deepStrictEqual(submitApplication(closedJob.id, application, dependencies), {
    ok: false,
    reason: 'job-closed'
  });
  assert.strictEqual(notifier.calls.length, 0);
  assert.strictEqual(store.get(closedJob.id, application.studentId), undefined);
});
