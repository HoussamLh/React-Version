import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { getCustomerProjectRequestById } from "../services/projectRequests.service";
import { markCustomerProjectMessagesAsRead } from "../messages/ProjectRequestsMessages.service";
import type { ProjectRequest } from "../types/projectRequests.types";

export const useProjectRequestDetails = (id?: string) => {
  const [project, setProject] = useState<ProjectRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadProject = async () => {
      if (!id) {
        setError("Project id is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const result = await getCustomerProjectRequestById(id);
        if (mounted) setProject(result);
      } catch {
        if (mounted) setError("Could not load project details.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    void loadProject();
    return () => { mounted = false; };
  }, [id]);

  useEffect(() => {
    if (!project?.id) return;
    let cancelled = false;

    const markMessagesAsRead = async () => {
      try {
        await markCustomerProjectMessagesAsRead(project.id);
      } catch (error) {
        if (!cancelled) console.error("Failed to mark customer project messages as read:", error);
      }
    };

    void markMessagesAsRead();
    return () => { cancelled = true; };
  }, [project?.id]);

  useEffect(() => {
    if (!supabase || !project?.id) return;

    const client = supabase;
    const channel = client
      .channel(`project-request-status-${project.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "project_requests", filter: `id=eq.${project.id}` },
        (payload) => {
          const updated = payload.new as Pick<ProjectRequest, "status"> & {
            admin_notes: string;
            updated_at: string;
          };
          setProject((current) => current ? {
            ...current,
            status: updated.status,
            adminNotes: updated.admin_notes,
            updatedAt: updated.updated_at,
          } : current);
        },
      )
      .subscribe();

    return () => { void client.removeChannel(channel); };
  }, [project?.id]);

  return { project, isLoading, error };
};
