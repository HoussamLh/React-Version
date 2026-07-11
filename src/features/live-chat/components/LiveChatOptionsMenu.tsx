import React from "react";
import { Download, Maximize2 } from "lucide-react";
import { colors, radius, spacing } from "../../../design-system";

type LiveChatOptionsMenuProps = {
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onDownloadTranscript: () => void;
};

export const LiveChatOptionsMenu: React.FC<LiveChatOptionsMenuProps> = ({
  isExpanded,
  onToggleExpanded,
  onDownloadTranscript,
}) => {
  return (
    <div style={styles.optionsMenu}>
      <button
        type="button"
        style={styles.menuButton}
        onClick={onToggleExpanded}
      >
        <Maximize2 size={16} style={styles.optionIcon} />
        <span>{isExpanded ? "Collapse window" : "Expand window"}</span>
      </button>

      <button
        type="button"
        style={styles.menuButton}
        onClick={onDownloadTranscript}
      >
        <Download size={16} style={styles.optionIcon} />
        <span>Download transcript</span>
      </button>
    </div>
  );
};

const styles = {
  optionsMenu: {
    position: "absolute" as const,
    top: "40px",
    right: 0,
    width: "210px",
    padding: "8px",
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    boxShadow: "0 18px 45px rgba(0, 0, 0, 0.35)",
    zIndex: 20,
  },

  menuButton: {
    width: "100%",
    border: "none",
    backgroundColor: "transparent",
    color: colors.text.main,
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    padding: "10px 12px",
    borderRadius: radius.sm,
    fontSize: "14px",
    cursor: "pointer",
    textAlign: "left" as const,
  },

  optionIcon: {
    color: colors.accent.pink,
    flexShrink: 0,
  },
};
