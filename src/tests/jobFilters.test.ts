import test from 'node:test';
import assert from 'node:assert/strict';
import { initialJobs } from '@/data/mockJobs';
import { filterJobs, sortJobs } from '@/utils/jobFilters';

test('filterJobs returns all jobs when default options are passed', () => {
  const result = filterJobs(initialJobs);
  assert.strictEqual(result.length, initialJobs.length);
});

test('filterJobs filters by category correctly', () => {
  const partTimeJobs = filterJobs(initialJobs, { category: 'part-time' });
  assert.ok(partTimeJobs.length > 0);
  assert.ok(partTimeJobs.every((job) => job.category === 'part-time'));

  const freelanceJobs = filterJobs(initialJobs, { category: 'freelance' });
  assert.ok(freelanceJobs.length > 0);
  assert.ok(freelanceJobs.every((job) => job.category === 'freelance'));
});

test('filterJobs filters by query string across title, location, description, or employer', () => {
  const baristaResults = filterJobs(initialJobs, { query: 'กาแฟ' });
  assert.ok(baristaResults.length > 0);
  assert.ok(
    baristaResults.every(
      (job) =>
        job.title.includes('กาแฟ') ||
        job.description.includes('กาแฟ') ||
        job.location.includes('กาแฟ')
    )
  );

  const nonExistent = filterJobs(initialJobs, { query: 'XYZNonExistentWord12345' });
  assert.strictEqual(nonExistent.length, 0);
});

test('filterJobs filters by minSalary', () => {
  const minSalary = 60;
  const highPayingJobs = filterJobs(initialJobs, { minSalary });
  assert.ok(highPayingJobs.every((job) => job.salary >= minSalary));
});

test('filterJobs filters by maxDistance', () => {
  const maxDistance = 700;
  const nearbyJobs = filterJobs(initialJobs, { maxDistance });
  assert.ok(nearbyJobs.every((job) => job.distance <= maxDistance));
});

test('filterJobs filters by open status', () => {
  const openJobs = filterJobs(initialJobs, { showOpenOnly: true });
  assert.ok(openJobs.every((job) => job.status === 'open'));
});

test('sortJobs sorts by salary descending', () => {
  const sorted = sortJobs(initialJobs, 'salary-desc');
  for (let i = 0; i < sorted.length - 1; i++) {
    assert.ok(sorted[i].salary >= sorted[i + 1].salary);
  }
});

test('sortJobs sorts by salary ascending', () => {
  const sorted = sortJobs(initialJobs, 'salary-asc');
  for (let i = 0; i < sorted.length - 1; i++) {
    assert.ok(sorted[i].salary <= sorted[i + 1].salary);
  }
});

test('sortJobs sorts by distance ascending', () => {
  const sorted = sortJobs(initialJobs, 'distance-asc');
  for (let i = 0; i < sorted.length - 1; i++) {
    assert.ok(sorted[i].distance <= sorted[i + 1].distance);
  }
});
