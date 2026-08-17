import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { getProjectActivities } from "../activities/projectActivity.services";
import type { ProjectActivity } from "../activities/projectActivity.types";

export const useProjectActivityTimeline = (projectRequestId: string) => {
  const [activities, setActivities] = useState<ProjectActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const result = await getProjectActivities(projectRequestId);
        if (mounted) setActivities(result);
      } catch (error) {
        if (mounted) console.error("Could not load project activities:", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    void load();
    return () => { mounted = false; };
  }, [projectRequestId]);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    const channel = client.channel(`project-activities-${projectRequestId}`).on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "project_activities", filter: `project_request_id=eq.${projectRequestId}` },
      (payload) => {
        const row = payload.new as { id: string; project_request_id: string; type: string; message: string; created_at: string };
        const next: ProjectActivity = { id: row.id, projectRequestId: row.project_request_id, type: row.type, message: row.message, createdAt: row.created_at };
        setActivities((current) => current.some((item) => item.id === next.id) ? current : [...current, next]);
      },
    ).subscribe();
    return () => { void client.removeChannel(channel); };
  }, [projectRequestId]);

  return { activities, isLoading };
};
