import type {
  ContactSubmissionStatus,
  SubmissionFilter,
} from "../types/contactSubmissions.types";

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

export const filterOptions: {
  label: string;
  value: SubmissionFilter;
}[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Closed", value: "closed" },
];
