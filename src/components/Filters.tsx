import { JobFilters } from '../models/job-filters';

export interface FiltersProps {
  filters: JobFilters | null;

  onChangeFilters(filters: JobFilters): void;
}

export function Filters(props: FiltersProps) {
  return null;
}
