import React from "react";
import {radius, colors, spacing} from "../../../../design-system";
import { Link, useParams } from "react-router-dom";
import { ProjectActivityTimeline } from "../activities/ProjectActivityTimeline";
import { ProjectMessagesPanel } from "../messages/components/ProjectMessagesPanel";
import { ProjectStatusTimeline } from "../status/ProjectStatusTimeline";
import { useProjectRequestDetails } from "../hooks/useProjectRequestDetails";
import { ProjectRequestContentCard } from "./ProjectRequestContentCard";
import { ProjectRequestDetailsHeader } from "./ProjectRequestDetailsHeader";
import { ProjectRequestInfoCard } from "./ProjectRequestInfoCard";

export const ProjectRequestsDetailsPage: React.FC = () => {
  const { id } = useParams();
  const { project, isLoading, error } = useProjectRequestDetails(id);

  if (isLoading) {
    return <main style={styles.page}><p style={styles.message}>Loading project...</p></main>;
  }

  if (error || !project) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <p style={styles.error}>{error || "Project not found."}</p>
          <Link to="/customer/dashboard" style={styles.link}>Back to dashboard</Link>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <ProjectRequestDetailsHeader project={project} />
        <section style={styles.card}>
          <ProjectStatusTimeline status={project.status} />
          <ProjectActivityTimeline projectRequestId={project.id} />
        </section>
        <section style={styles.card}><ProjectRequestInfoCard project={project} /></section>
        <section style={styles.card}><ProjectRequestContentCard project={project} /></section>
        <ProjectMessagesPanel projectRequestId={project.id} />
      </section>
    </main>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { 
    minHeight: "calc(100vh - 90px)", 
    backgroundColor: colors.background.dark, 
    padding: spacing.xl, 
  },
  container: { 
    maxWidth: "900px", 
    margin: "0 auto", 
    display: "flex" as const, 
    flexDirection: "column" as const, 
    gap: spacing.xl, 
  },
  card: { 
    backgroundColor: colors.background.card, 
    border: `1px solid ${colors.border.default}`, 
    borderRadius: radius["2xl"], 
    padding: spacing.xl, 
  },
  message: { color: colors.text.muted },
  error: { color: "#ff7777" },
  link: { color: colors.accent.green },
};
