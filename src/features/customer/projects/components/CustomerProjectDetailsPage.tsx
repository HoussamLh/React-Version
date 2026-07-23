import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { colors, radius, spacing, typography } from "../../../../design-system";
import { getCustomerProjectRequestById } from "../services/customerProjects.service";
import { markCustomerProjectMessagesAsRead } from "../messages/customerProjectMessages.service";
import type { CustomerProjectRequest } from "../types/customerProjects.types";
import { ProjectStatusTimeline } from "./ProjectStatusTimeline";
import { ProjectMessagesPanel } from "../messages/components/ProjectMessagesPanel";
import { ProjectActivityTimeline } from "./ProjectActivityTimeline";

export const CustomerProjectDetailsPage: React.FC = () => {
  const { id } = useParams();

  const [project, setProject] = useState<CustomerProjectRequest | null>(null);

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

        if (!mounted) {
          return;
        }

        setProject(result);
      } catch {
        if (!mounted) {
          return;
        }

        setError("Could not load project details.");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProject();

    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!project?.id) {
      return;
    }

    let cancelled = false;

    const markMessagesAsRead = async () => {
      try {
        await markCustomerProjectMessagesAsRead(project.id);

        if (cancelled) {
          return;
        }
      } catch (error) {
        console.error(
          "Failed to mark customer project messages as read:",
          error,
        );
      }
    };

    void markMessagesAsRead();

    return () => {
      cancelled = true;
    };
  }, [project?.id]);

  if (isLoading) {
    return (
      <main style={styles.page}>
        <p style={styles.message}>Loading project...</p>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <p style={styles.error}>{error || "Project not found."}</p>

          <Link to="/customer/dashboard" style={styles.link}>
            Back to dashboard
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <Link to="/customer/dashboard" style={styles.backLink}>
          ← Back to dashboard
        </Link>

        <section style={styles.card}>
          <span style={styles.badge}>Customer Project</span>

          <h1 style={styles.title}>{project.title}</h1>

          <p style={styles.subtitle}>
            Created {new Date(project.createdAt).toLocaleDateString()}
          </p>

          <ProjectStatusTimeline status={project.status} />
          <ProjectActivityTimeline project={project} />
        </section>

        <section style={styles.card}>
          <h2 style={styles.heading}>Project Information</h2>

          <Detail label="Project Type" value={project.projectType} />

          <Detail label="Package" value={project.selectedPackage} />

          <Detail label="Category" value={project.packageCategory} />

          <Detail label="Budget" value={project.budgetRange} />

          <Detail label="Timeline" value={project.timeline} />
        </section>

        <section style={styles.card}>
          <h2 style={styles.heading}>Description</h2>

          <p style={styles.text}>
            {project.description || "No description provided."}
          </p>

          <h2 style={styles.heading}>Goals</h2>

          <p style={styles.text}>{project.goals || "No goals provided."}</p>
        </section>

        <section style={styles.card}>
          <h2 style={styles.heading}>Admin Notes</h2>

          <p style={styles.text}>{project.adminNotes || "No updates yet."}</p>
        </section>
        <ProjectMessagesPanel projectRequestId={project.id} />
      </section>
    </main>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div style={styles.detail}>
    <span style={styles.label}>{label}</span>

    <span style={styles.value}>{value || "Not provided"}</span>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "calc(100vh - 90px)",
    backgroundColor: colors.background.dark,
    padding: spacing.xl,
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: spacing.xl,
  },

  card: {
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius["2xl"],
    padding: spacing.xl,
  },

  badge: {
    color: colors.accent.green,
    fontSize: "11px",
    fontWeight: typography.fontWeight.black,
    textTransform: "uppercase",
  },

  title: {
    color: colors.text.main,
    fontSize: "36px",
    margin: `${spacing.md} 0`,
  },

  subtitle: {
    color: colors.text.muted,
  },

  heading: {
    color: colors.text.main,
    fontSize: "20px",
    marginBottom: spacing.md,
  },

  text: {
    color: colors.text.muted,
    lineHeight: "24px",
  },

  detail: {
    display: "flex",
    justifyContent: "space-between",
    padding: `${spacing.sm} 0`,
    borderBottom: `1px solid ${colors.border.default}`,
  },

  label: {
    color: colors.text.muted,
  },

  value: {
    color: colors.text.main,
    fontWeight: typography.fontWeight.bold,
  },

  link: {
    color: colors.accent.green,
  },

  backLink: {
    color: colors.accent.green,
    textDecoration: "none",
  },

  message: {
    color: colors.text.muted,
  },

  error: {
    color: "#ff7777",
  },
};
