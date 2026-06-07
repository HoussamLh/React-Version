import { RootLayout } from "./layouts/rootLayout";

function App() {
  return (
    <RootLayout>
      <div
        style={{
          padding: "120px 8%",
          textAlign: "center",
          color: "var(--text-muted)",
        }}
      >
        <h2 style={{ color: "#fff" }}>Home Page</h2>
      </div>
    </RootLayout>
  );
}

export default App;
