import { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminConversations } from "../../chat/services/adminChat.service";
import type { AdminConversation } from "../../chat/types/adminChat.types";
import { getContactSubmissions } from "../../contacts/services/contactSubmissions.service";
import type { ContactSubmission } from "../../contacts/types/contactSubmissions.types";
import {
  getAdminDashboardStats,
  type AdminDashboardStats,
} from "../helpers/adminDashboard.helpers";

export const useAdminDashboard = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [conversations, setConversations] = useState<AdminConversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [nextSubmissions, nextConversations] = await Promise.all([
        getContactSubmissions(),
        getAdminConversations(),
      ]);

      setSubmissions(nextSubmissions);
      setConversations(nextConversations);
    } catch {
      setError("Could not load dashboard overview.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const timeoutId = window.setTimeout(() => {
      if (!isMounted) return;
      void loadDashboard();
    }, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [loadDashboard]);

  const stats = useMemo<AdminDashboardStats>(
    () => getAdminDashboardStats(submissions, conversations),
    [conversations, submissions],
  );

  return {
    submissions,
    conversations,
    stats,
    isLoading,
    error,
    loadDashboard,
  };
};
