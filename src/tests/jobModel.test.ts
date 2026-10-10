import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleTestJobs } from './fixtures/sampleJobs';

test('every job conforms to the production Job model schema', () => {
  const allowedCategories = ['all', 'part-time', 'full-time', 'freelance', 'errand', 'other'];
  const allowedSalaryUnits = ['ชั่วโมง', 'วัน', 'เดือน', 'งาน'];
  const allowedStatuses = ['open', 'closed'];

  for (const job of sampleTestJobs) {
    assert.ok(job.id, 'Job must have an ID');
    assert.ok(job.title && job.title.trim().length > 0, `Job ${job.id} has invalid title`);
    assert.ok(job.location && job.location.trim().length > 0, `Job ${job.id} has invalid location`);
    assert.ok(typeof job.salary === 'number' && job.salary > 0, `Job ${job.id} has invalid salary`);
    assert.ok(allowedSalaryUnits.includes(job.salaryUnit), `Job ${job.id} has invalid salaryUnit: ${job.salaryUnit}`);
    assert.ok(allowedCategories.includes(job.category), `Job ${job.id} has invalid category: ${job.category}`);
    assert.ok(allowedStatuses.includes(job.status), `Job ${job.id} has invalid status: ${job.status}`);
    assert.ok(job.employer && job.employer.name, `Job ${job.id} missing employer name`);
  }
});
