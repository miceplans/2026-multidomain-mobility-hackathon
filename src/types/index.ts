export const APPLICANT_TYPES = ['일반', '기업'] as const;
export const COMPANY_REGIONS = ['부산', '울산', '경남'] as const;
export const GENDERS = ['남', '여'] as const;
export type FaqItem = { question: string; answer: string };
export type SiteSettings = {
  is_public: boolean;
  editing_enabled: boolean;
  completion_message: string;
  contact: string | null;
  completion_email_body: string | null;
  item_summary_max_length: number | null;
  evidence_label: string | null;
  evidence_purpose: string | null;
  privacy_retention_policy: string | null;
  faqs: FaqItem[];
};
