import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import {
  createCustomerProjectRequest,
  getCustomerProjectRequests,
} from "../services/projectRequests.service";
import { getCustomerUnreadMessageCounts } from "../messages/ProjectRequestsUnread.service";
import type {
  ProjectRequest,
  ProjectRequestFormValues,
} from "../types/projectRequests.types";

type UseCustomerProjectRequestsOptions = {
  initialRequestValues?: Partial<ProjectRequestFormValues>;
  onClearInitialRequestIntent?: () => void;
};

export const useCustomerProjectRequests = ({
  initialRequestValues,
  onClearInitialRequestIntent,
}: UseCustomerProjectRequestsOptions) => {
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(
    Boolean(initialRequestValues?.selectedPackage),
  );
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");

  const loadUnreadCounts = useCallback(async () => {
    try {
      setUnreadCounts(await getCustomerUnreadMessageCounts());
    } catch (error) {
      console.error("Failed to load unread message counts:", error);
    }
  }, []);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const results = await getCustomerProjectRequests();
      setRequests(results);
      await loadUnreadCounts();
    } catch {
      setLoadError("Could not load your project requests.");
    } finally {
      setIsLoading(false);
    }
  }, [loadUnreadCounts]);

  useEffect(() => {
    let isMounted = true;
    const timer = window.setTimeout(() => {
      if (isMounted) void loadRequests();
    }, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timer);
    };
  }, [loadRequests]);

  useEffect(() => {
    if (!supabase) return;

    const client = supabase;
    const channel = client
      .channel("customer-project-message-badges")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "project_messages",
          filter: "sender_type=eq.admin",
        },
        () => void loadUnreadCounts(),
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "project_messages",
          filter: "sender_type=eq.admin",
        },
        () => void loadUnreadCounts(),
      )
      .subscribe();

    return () => {
      void client.removeChannel(channel);
    };
  }, [loadUnreadCounts]);

  const toggleForm = () => {
    setFormError("");

    if (isFormOpen) {
      setIsFormOpen(false);
      onClearInitialRequestIntent?.();
      return;
    }

    setIsFormOpen(true);
  };

  const handleCreateRequest = async (values: ProjectRequestFormValues) => {
    setIsCreatingRequest(true);
    setFormError("");

    try {
      await createCustomerProjectRequest(values);
      setIsFormOpen(false);
      onClearInitialRequestIntent?.();
      await loadRequests();
    } catch {
      setFormError("Could not submit your project request. Please try again.");
    } finally {
      setIsCreatingRequest(false);
    }
  };

  return {
    requests,
    unreadCounts,
    isLoading,
    isFormOpen,
    isCreatingRequest,
    loadError,
    formError,
    toggleForm,
    handleCreateRequest,
  };
};
