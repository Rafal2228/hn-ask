export interface JobOffer {
  commentId: number;
  by: string;
  company: string;
  position: string;
  positionTags: string[];
  minSalary: number | null;
  maxSalary: number | null;
  currency: 'USD' | 'EUR' | null;
  remote: boolean;
  description: string;
}
