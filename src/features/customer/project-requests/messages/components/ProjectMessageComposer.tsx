import React from "react";
import { colors, radius, spacing, typography } from "../../../../../design-system";

type Props = { 
  value: string; 
  isSending: boolean; 
  onChange: (value: string) => void; 
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void };

export const ProjectMessageComposer: React.FC<Props> = ({ 
  value, isSending, 
  onChange, 
  onSubmit }) => (
  <form style={styles.form} 
  onSubmit={onSubmit}>
    <textarea 
    style={styles.input} 
    value={value} 
    placeholder="Write a message..." 
    onChange={(event) => onChange(event.target.value)} />

    <button 
    type="submit" 
    style={styles.button} 
    disabled={isSending}>
      {isSending ? "Sending..." : "Send"}</button>
  </form>
);

const styles = {
  form: { 
    display: "flex" as const, 
    flexDirection: "column" as const, 
    gap: spacing.md, 
    marginTop: spacing.lg 
  },
  input: { 
    minHeight: "100px", 
    resize: "vertical" as const, 
    padding: spacing.md, 
    borderRadius: radius.md, 
    border: `1px solid ${colors.border.default}`, 
    backgroundColor: colors.background.dark, 
    color: colors.text.main },
  button: { 
    alignSelf: "flex-end" as const, 
    border: "none", 
    borderRadius: radius.md, 
    backgroundColor: colors.accent.green, 
    color: colors.background.dark, 
    padding: "12px 20px", 
    fontWeight: typography.fontWeight.black, 
    cursor: "pointer" },
};
