export const IconBox: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <div style={styles.iconWrapper}>{children}</div>;
};

const styles = {
  iconWrapper: {
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    backgroundColor: "rgba(116, 245, 66, 0.08)",
  },
};
