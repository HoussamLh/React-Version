export type ContactSubmissionStatus = "new" | "contacted" | "closed";

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: ContactSubmissionStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
};
