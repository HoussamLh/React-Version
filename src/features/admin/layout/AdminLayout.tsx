import React, { useSyncExternalStore } from "react";
import { Outlet } from "react-router-dom";
import { colors } from "../../../design-system";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

const subscribeToCompactLayout = (callback: () => void) => {
  const mediaQuery = window.matchMedia("(max-width: 900px)");

  mediaQuery.addEventListener("change", callback);

  return () => {
    mediaQuery.removeEventListener("change", callback);
  };
};

const getCompactLayoutSnapshot = () => {
  return window.matchMedia("(max-width: 900px)").matches;
};

const getServerCompactLayoutSnapshot = () => false;

export const AdminLayout: React.FC = () => {
  const isCompactLayout = useSyncExternalStore(
    subscribeToCompactLayout,
    getCompactLayoutSnapshot,
    getServerCompactLayoutSnapshot,
  );

  return (
    <div
      style={{
        ...styles.shell,
        ...(isCompactLayout ? styles.shellCompact : {}),
      }}
    >
      <AdminSidebar isCompactLayout={isCompactLayout} />

      <main style={styles.main}>
        <AdminHeader isCompactLayout={isCompactLayout} />

        <div
          style={{
            ...styles.content,
            ...(isCompactLayout ? styles.contentCompact : {}),
          }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const styles = {
  shell: {
    minHeight: "100vh",
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    display: "flex",
  },

  shellCompact: {
    flexDirection: "column" as const,
  },

  main: {
    flex: 1,
    minWidth: 0,
  },

  content: {
    padding: "32px",
  },

  contentCompact: {
    padding: "16px",
  },
};
