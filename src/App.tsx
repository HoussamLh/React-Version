import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RootLayout } from "./layouts/rootLayout";
import { Home } from "./routes/Home";
import { About } from "./routes/About";
import { Services } from "./routes/Services";
import { Projects } from "./routes/Projects";
import { Pricing } from "./routes/Pricing";
import { Contact } from "./routes/Contact";
import { LiveChatBubble } from "./features/live-chat";

import {
  AdminChatPage,
  AdminDashboard,
  AdminLayout,
  AdminLogin,
  ContactSubmissionsPage,
  ProtectedAdminRoute,
} from "./features/admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<RootLayout><Home /></RootLayout>}/>
        <Route path="/about" element={<RootLayout><About /></RootLayout>}/>
        <Route path="/services" element={<RootLayout><Services /></RootLayout>}/>
        <Route path="/projects" element={<RootLayout><Projects /></RootLayout>}/>
        <Route path="/pricing" element={<RootLayout><Pricing /></RootLayout>}/>
        <Route path="/contact" element={<RootLayout><Contact /></RootLayout>}/>

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="chat" element={<AdminChatPage />} />
          <Route path="contacts" element={<ContactSubmissionsPage />} />
        </Route>
      </Routes>

      <LiveChatBubble />
    </BrowserRouter>
  );
}

export default App;
