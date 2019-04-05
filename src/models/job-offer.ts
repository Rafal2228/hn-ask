export interface JobOffer {
  commentId: number;
  by: string;
  company?: string;
  position?: string;
  minSalary?: string | null;
  maxSalary?: string | null;
  currency?: string | null;
  remote?: boolean;
  description?: string;
}
