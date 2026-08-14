import { useCallback, useEffect, useMemo, useState } from "react";
import { copyTextToClipboard } from "../../utils";
import {
  getContactSubmissions,
  updateContactSubmissionStatus,
} from "../services/contactSubmissions.service";
import { getContactSubmissionSearchableText } from "../helpers/contactSubmissions.helpers";
import {
  statusMeta,
  statusOptions,
} from "../configuration/contactSubmissions.status";
import type {
  ContactSubmission,
  ContactSubmissionStatus,
  SubmissionFilter,
} from "../types/contactSubmissions.types";

export const useContactSubmissions = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ContactSubmission | null>(null);

  const [submissionFilter, setSubmissionFilter] =
    useState<SubmissionFilter>("all");

  const [searchQuery, setSearchQuery] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [copiedField, setCopiedField] = useState<"email" | "phone" | null>(
    null,
  );

  const filterCounts = useMemo(() => {
    const statusCounts = statusOptions.reduce(
      (counts, status) => ({
        ...counts,
        [status]: submissions.filter(
          (submission) => submission.status === status,
        ).length,
      }),
      {} as Record<ContactSubmissionStatus, number>,
    );

    return {
      all: submissions.length,

      active: submissions.filter((submission) => submission.status !== "closed")
        .length,

      ...statusCounts,
    };
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    return submissions.filter((submission) => {
      const matchesFilter =
        submissionFilter === "all" ||
        (submissionFilter === "active" && submission.status !== "closed") ||
        submission.status === submissionFilter;

      if (!matchesFilter) {
        return false;
      }

      if (!normalizedSearchQuery) {
        return true;
      }

      return getContactSubmissionSearchableText(submission).includes(
        normalizedSearchQuery,
      );
    });
  }, [searchQuery, submissionFilter, submissions]);

  const hasActiveFilters =
    submissionFilter !== "all" || searchQuery.trim().length > 0;

  const loadSubmissions = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const nextSubmissions = await getContactSubmissions();

      setSubmissions(nextSubmissions);

      setSelectedSubmission((currentSubmission) => {
        if (!currentSubmission) {
          return nextSubmissions[0] ?? null;
        }

        return (
          nextSubmissions.find(
            (submission) => submission.id === currentSubmission.id,
          ) ??
          nextSubmissions[0] ??
          null
        );
      });
    } catch {
      setError("Could not load contact submissions.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    window.setTimeout(() => {
      if (!isMounted) {
        return;
      }

      void loadSubmissions();
    }, 0);

    return () => {
      isMounted = false;
    };
  }, [loadSubmissions]);

  const showSuccessMessage = useCallback((message: string) => {
    setSuccessMessage(message);

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 2200);
  }, []);

  const handleStatusChange = useCallback(
    async (submissionId: string, status: ContactSubmissionStatus) => {
      if (status === "closed") {
        const confirmed = window.confirm(
          "Are you sure you want to close this contact submission?",
        );

        if (!confirmed) {
          return;
        }
      }

      setIsUpdatingStatus(true);
      setError("");
      setSuccessMessage("");

      try {
        await updateContactSubmissionStatus({
          submissionId,
          status,
        });

        await loadSubmissions();

        showSuccessMessage(
          `Submission marked as ${statusMeta[status].label.toLowerCase()}.`,
        );
      } catch {
        setError("Could not update submission status.");
      } finally {
        setIsUpdatingStatus(false);
      }
    },
    [loadSubmissions, showSuccessMessage],
  );

  const handleCopy = useCallback(
    async (value: string, field: "email" | "phone") => {
      setError("");

      try {
        await copyTextToClipboard(value);

        setCopiedField(field);

        window.setTimeout(() => {
          setCopiedField(null);
        }, 1600);
      } catch {
        setError("Could not copy to clipboard.");
      }
    },
    [],
  );

  const handleResetFilters = useCallback(() => {
    setSubmissionFilter("all");
    setSearchQuery("");
  }, []);

  return {
    submissions,
    selectedSubmission,
    submissionFilter,
    searchQuery,

    filterCounts,
    filteredSubmissions,
    hasActiveFilters,

    isLoading,
    isUpdatingStatus,
    error,
    successMessage,
    copiedField,

    setSelectedSubmission,
    setSubmissionFilter,
    setSearchQuery,

    loadSubmissions,
    handleStatusChange,
    handleCopy,
    handleResetFilters,
  };
};
