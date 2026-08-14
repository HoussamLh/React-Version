import type { ContactSubmissionStatus } from "../types/contactSubmissions.types";

export const statusOptions: ContactSubmissionStatus[] = [
  "new",
  "contacted",
  "closed",
];

export const statusMeta: Record<
  ContactSubmissionStatus,
  {
    label: string;
    description: string;
  }
> = {
  new: {
    label: "New",
    description: "Needs first response",
  },
  contacted: {
    label: "Contacted",
    description: "Follow-up in progress",
  },
  closed: {
    label: "Closed",
    description: "No further action needed",
  },
};
