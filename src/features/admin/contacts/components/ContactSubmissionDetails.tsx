import React from "react";
import type {
  ContactSubmission,
  ContactSubmissionStatus,
} from "../types/contactSubmissions.types";
import { ContactSubmissionHeader } from "./ContactSubmissionHeader";
import { ContactSubmissionInfoGrid } from "./ContactSubmissionInfoGrid";
import { ContactSubmissionMessage } from "./ContactSubmissionMessage";

type ContactSubmissionDetailsProps = {
  submission: ContactSubmission;
  isCompactContacts: boolean;
  isNarrowContacts: boolean;
  isUpdatingStatus: boolean;
  copiedField: "email" | "phone" | null;
  onStatusChange: (
    submissionId: string,
    status: ContactSubmissionStatus,
  ) => void | Promise<void>;
  onCopy: (value: string, field: "email" | "phone") => void | Promise<void>;
};

export const ContactSubmissionDetails: React.FC<
  ContactSubmissionDetailsProps
> = ({
  submission,
  isCompactContacts,
  isNarrowContacts,
  isUpdatingStatus,
  copiedField,
  onStatusChange,
  onCopy,
}) => {
  return (
    <>
      <ContactSubmissionHeader
        submissionId={submission.id}
        name={submission.name}
        status={submission.status}
        createdAt={submission.createdAt}
        isCompactContacts={isCompactContacts}
        isNarrowContacts={isNarrowContacts}
        isUpdatingStatus={isUpdatingStatus}
        onStatusChange={onStatusChange}
      />

      <ContactSubmissionInfoGrid
        submission={submission}
        isCompactContacts={isCompactContacts}
        isNarrowContacts={isNarrowContacts}
        copiedField={copiedField}
        onCopy={onCopy}
      />

      <ContactSubmissionMessage
        submission={submission}
        isNarrowContacts={isNarrowContacts}
      />
    </>
  );
};
