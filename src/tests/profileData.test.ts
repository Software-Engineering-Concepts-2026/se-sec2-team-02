import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mockUserProfile,
  initialMyPosts,
  mockCompletedWorks,
  mockOngoingJobs
} from '@/data/mockProfile';

test('mockUserProfile has complete student information', () => {
  assert.ok(mockUserProfile.name.length > 0);
  assert.ok(mockUserProfile.studentId.length > 0);
  assert.ok(mockUserProfile.faculty.length > 0);
  assert.ok(mockUserProfile.phone.length > 0);
  assert.ok(mockUserProfile.rating >= 0 && mockUserProfile.rating <= 5);
});

test('initialMyPosts contains valid user-posted jobs', () => {
  assert.ok(initialMyPosts.length >= 2);
  for (const post of initialMyPosts) {
    assert.ok(post.id);
    assert.ok(post.title);
    assert.ok(post.wage);
    assert.ok(['open', 'closed'].includes(post.status));
  }
});

test('mockCompletedWorks contains valid completed work portfolio', () => {
  assert.ok(mockCompletedWorks.length >= 3);
  for (const work of mockCompletedWorks) {
    assert.ok(work.id);
    assert.ok(work.title);
    assert.ok(work.workplace);
    assert.ok(work.earnings);
    assert.ok(work.rating >= 0 && work.rating <= 5);
  }
});

test('mockOngoingJobs contains valid active ongoing jobs', () => {
  assert.ok(mockOngoingJobs.length >= 2);
  for (const job of mockOngoingJobs) {
    assert.ok(job.id);
    assert.ok(job.title);
    assert.ok(job.workplace);
    assert.ok(job.progressPercent >= 0 && job.progressPercent <= 100);
  }
});
