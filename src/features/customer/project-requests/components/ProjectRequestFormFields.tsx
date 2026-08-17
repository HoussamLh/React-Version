import React from "react";
import { colors, radius, spacing } from "../../../../design-system";
import type {
  ProjectRequestFormValues,
  ProjectRequestPackageCategory,
  ProjectRequestType,
} from "../types/projectRequests.types";

type ProjectRequestFormFieldsProps = {
  values: ProjectRequestFormValues;
  setTitle: (value: string) => void;
  setProjectType: (value: ProjectRequestType) => void;
  setPackageCategory: (value: ProjectRequestPackageCategory) => void;
  setSelectedPackage: (value: string) => void;
  setBudgetRange: (value: string) => void;
  setTimeline: (value: string) => void;
  setDescription: (value: string) => void;
  setGoals: (value: string) => void;
};

export const ProjectRequestFormFields: React.FC<ProjectRequestFormFieldsProps> = ({
  values,
  setTitle,
  setProjectType,
  setPackageCategory,
  setSelectedPackage,
  setBudgetRange,
  setTimeline,
  setDescription,
  setGoals,
}) => (
  <>
    <div style={styles.grid}>
      <Field label="Project title">
        <input style={styles.input} value={values.title} placeholder="Business website redesign" onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="Project type">
        <select style={styles.input} value={values.projectType} onChange={(e) => setProjectType(e.target.value as ProjectRequestType)}>
          <option value="website">Website</option>
          <option value="mobile_app">Mobile app</option>
          <option value="backend_system">Backend system</option>
          <option value="maintenance">Maintenance</option>
          <option value="other">Other</option>
        </select>
      </Field>
      <Field label="Package category">
        <select style={styles.input} value={values.packageCategory} onChange={(e) => setPackageCategory(e.target.value as ProjectRequestPackageCategory)}>
          <option value="custom">Custom</option>
          <option value="build_plan">Build plan</option>
          <option value="maintenance_plan">Maintenance plan</option>
        </select>
      </Field>
      <Field label="Selected package">
        <input style={styles.input} value={values.selectedPackage} placeholder="Optional" onChange={(e) => setSelectedPackage(e.target.value)} />
      </Field>
      <Field label="Budget range">
        <input style={styles.input} value={values.budgetRange} placeholder="Example: £1,000 - £3,000" onChange={(e) => setBudgetRange(e.target.value)} />
      </Field>
      <Field label="Timeline">
        <input style={styles.input} value={values.timeline} placeholder="Example: 4-6 weeks" onChange={(e) => setTimeline(e.target.value)} />
      </Field>
    </div>
    <Field label="Project description">
      <textarea style={styles.textarea} value={values.description} placeholder="Describe what you want to build..." onChange={(e) => setDescription(e.target.value)} />
    </Field>
    <Field label="Main goals">
      <textarea style={styles.textarea} value={values.goals} placeholder="Example: generate leads, improve conversions, automate bookings..." onChange={(e) => setGoals(e.target.value)} />
    </Field>
  </>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label style={styles.field}>
    <span style={styles.label}>{label}</span>
    {children}
  </label>
);

const styles = {
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
    gap: spacing.lg, 
  },
  field: { 
    display: "flex" as const, 
    flexDirection: "column" as const, 
    gap: spacing.sm, 
  },
  label: { 
    color: colors.text.main, 
    fontSize: "11px", 
    letterSpacing: "0.08em", 
    textTransform: "uppercase" as const, 
  },
  input: { 
    width: "100%", 
    boxSizing: "border-box" as const, 
    border: `1px solid ${colors.border.default}`, 
    borderRadius: radius.md, 
    backgroundColor: colors.background.dark, 
    color: colors.text.main, 
    padding: `13px ${spacing.md}`, 
    outline: "none", fontSize: "14px", 
  },
  textarea: { 
    width: "100%", 
    minHeight: "120px", 
    boxSizing: "border-box" as const, 
    border: `1px solid ${colors.border.default}`, 
    borderRadius: radius.md, 
    backgroundColor: colors.background.dark, 
    color: colors.text.main, 
    padding: `13px ${spacing.md}`, 
    outline: "none", 
    fontSize: "14px", 
    lineHeight: "22px", 
    resize: "vertical" as const, 
  },
};
