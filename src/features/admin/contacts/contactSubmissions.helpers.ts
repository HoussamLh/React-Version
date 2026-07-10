import type { ContactSubmission } from "./contactSubmissions.types";

export const getContactSubmissionMailtoHref = (
  submission: ContactSubmission,
) => {
  const subject = `DevBySam enquiry: ${submission.service}`;
  const body = `Hi ${submission.name},\n\nThank you for contacting DevBySam about ${submission.service}.\n\n`;

  return `mailto:${submission.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
};

export const getContactSubmissionSearchableText = (
  submission: ContactSubmission,
) => {
  return [
    submission.name,
    submission.email,
    submission.phone,
    submission.service,
    submission.message,
    submission.status,
    submission.source,
  ]
    .join(" ")
    .toLowerCase();
};
