import type { Job, JobApplication } from '@/types/job';

export type ApplicationDetails = Omit<JobApplication, 'jobId'>;

export interface JobRepository {
  findById(jobId: string): Job | undefined;
}

export interface ApplicationStore {
  save(application: JobApplication): void;
}

export interface NotificationService {
  send(message: { to: string; subject: string; body: string }): void;
}

export interface JobApplicationDependencies {
  jobRepository: JobRepository;
  applicationStore: ApplicationStore;
  notificationService: NotificationService;
}

export type SubmitApplicationResult =
  | { ok: true; application: JobApplication }
  | { ok: false; reason: 'job-not-found' | 'job-closed' };

/**
 * Coordinates an application without coupling the workflow to a real database
 * or notification provider. Those dependencies can be replaced by test doubles.
 */
export function submitApplication(
  jobId: string,
  application: ApplicationDetails,
  dependencies: JobApplicationDependencies
): SubmitApplicationResult {
  const job = dependencies.jobRepository.findById(jobId);

  if (!job) {
    return { ok: false, reason: 'job-not-found' };
  }

  if (job.status !== 'open') {
    return { ok: false, reason: 'job-closed' };
  }

  const savedApplication: JobApplication = { ...application, jobId };
  dependencies.applicationStore.save(savedApplication);
  dependencies.notificationService.send({
    to: job.employer.name,
    subject: `New application: ${job.title}`,
    body: `${application.applicantName} applied for ${job.title}.`
  });

  return { ok: true, application: savedApplication };
}
