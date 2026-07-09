import React from "react";
import { Outlet } from "react-router-dom";
import { colors } from "../../../design-system";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

export const AdminLayout: React.FC = () => {
  return (
    <div style={styles.shell}>
      <AdminSidebar />

      <main style={styles.main}>
        <AdminHeader />

        <div style={styles.content}>
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

  main: {
    flex: 1,
    minWidth: 0,
  },

  content: {
    padding: "32px",
  },
};
