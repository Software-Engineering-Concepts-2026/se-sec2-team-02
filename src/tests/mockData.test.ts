import test from 'node:test';
import assert from 'node:assert/strict';
import { initialJobs } from '@/data/mockJobs';

test('initialJobs has at least 5 job items', () => {
  assert.ok(initialJobs.length >= 5, `Expected >= 5 jobs, got ${initialJobs.length}`);
});

test('every job in initialJobs has required valid fields', () => {
  const allowedCategories = ['all', 'part-time', 'full-time', 'freelance', 'errand', 'other'];
  const allowedSalaryUnits = ['ชั่วโมง', 'วัน', 'เดือน', 'งาน'];
  const allowedStatuses = ['open', 'closed'];

  const ids = new Set<string>();

  for (const job of initialJobs) {
    // Unique ID
    assert.ok(job.id, 'Job must have an ID');
    assert.ok(!ids.has(job.id), `Duplicate job ID detected: ${job.id}`);
    ids.add(job.id);

    // Title & location
    assert.ok(job.title && job.title.trim().length > 0, `Job ${job.id} has invalid title`);
    assert.ok(job.location && job.location.trim().length > 0, `Job ${job.id} has invalid location`);

    // Salary & distance
    assert.ok(typeof job.salary === 'number' && job.salary > 0, `Job ${job.id} has invalid salary`);
    assert.ok(typeof job.distance === 'number' && job.distance >= 0, `Job ${job.id} has invalid distance`);
    assert.ok(allowedSalaryUnits.includes(job.salaryUnit), `Job ${job.id} has invalid salaryUnit: ${job.salaryUnit}`);

    // Category
    assert.ok(allowedCategories.includes(job.category), `Job ${job.id} has invalid category: ${job.category}`);

    // Status
    assert.ok(allowedStatuses.includes(job.status), `Job ${job.id} has invalid status: ${job.status}`);

    // Employer
    assert.ok(job.employer, `Job ${job.id} missing employer`);
    assert.ok(job.employer.name, `Job ${job.id} missing employer name`);
    assert.ok(job.employer.rating >= 0 && job.employer.rating <= 5, `Job ${job.id} has invalid rating`);
  }
});
