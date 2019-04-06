export interface JobFilters {
  positionTags?: string[];
  salaryMin?: number;
  salaryMax?: number;
  currency?: 'USD' | 'EUR';
  remote?: boolean;
}
