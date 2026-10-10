import { Job, JobCategory } from '@/types/job';

export interface FilterJobsOptions {
  query?: string;
  category?: JobCategory;
  minSalary?: number;
  maxDistance?: number;
  showOpenOnly?: boolean;
}

export type SortJobsOption = 'latest' | 'salary-desc' | 'salary-asc' | 'distance-asc';

/**
 * Pure function to filter a list of jobs based on multiple criteria.
 * Matches existing behavior in Homepage and SearchPage.
 */
export function filterJobs(jobs: Job[], options: FilterJobsOptions = {}): Job[] {
  const {
    query = '',
    category = 'all',
    minSalary = 0,
    maxDistance = Infinity,
    showOpenOnly = false
  } = options;

  const q = query.trim().toLowerCase();

  return jobs.filter((job) => {
    // 1. Keyword search (case-insensitive across title, location, description, employer.name)
    const matchSearch =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      job.description.toLowerCase().includes(q) ||
      job.employer.name.toLowerCase().includes(q);

    // 2. Category
    const matchCategory = category === 'all' || job.category === category;

    // 3. Minimum Salary
    const matchSalary = job.salary >= minSalary;

    // 4. Maximum Distance
    const matchDistance = job.distance === undefined || job.distance <= maxDistance;

    // 5. Open status
    const matchStatus = !showOpenOnly || job.status === 'open';

    return matchSearch && matchCategory && matchSalary && matchDistance && matchStatus;
  });
}

/**
 * Pure function to sort a list of jobs.
 */
export function sortJobs(jobs: Job[], sortBy: SortJobsOption = 'latest'): Job[] {
  return [...jobs].sort((a, b) => {
    if (sortBy === 'salary-desc') return b.salary - a.salary;
    if (sortBy === 'salary-asc') return a.salary - b.salary;
    if (sortBy === 'distance-asc') return (a.distance ?? 0) - (b.distance ?? 0);
    return 0; // 'latest' keeps natural order
  });
}
