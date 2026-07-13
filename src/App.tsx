import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { RootLayout } from "./layouts/rootLayout";
import { Home } from "./routes/Home";
import { About } from "./routes/About";
import { Services } from "./routes/Services";
import { Projects } from "./routes/Projects";
import { Pricing } from "./routes/Pricing";
import { Contact } from "./routes/Contact";
import { CustomerSignInPage, CustomerSignUpPage } from "./features/customer";
import { LiveChatBubble } from "./features/live-chat";

import {
  AdminChatPage,
  AdminDashboard,
  AdminLayout,
  AdminLogin,
  AdminPricingPage,
  AdminProjectsPage,
  AdminServicesPage,
  AdminTeamPage,
  ContactSubmissionsPage,
  ProtectedAdminRoute,
} from "./features/admin";

const LiveChatVisibility = () => {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return null;
  }

  return <LiveChatBubble />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <RootLayout>
              <Home />
            </RootLayout>
          }
        />
        <Route
          path="/about"
          element={
            <RootLayout>
              <About />
            </RootLayout>
          }
        />
        <Route
          path="/services"
          element={
            <RootLayout>
              <Services />
            </RootLayout>
          }
        />
        <Route
          path="/projects"
          element={
            <RootLayout>
              <Projects />
            </RootLayout>
          }
        />
        <Route
          path="/pricing"
          element={
            <RootLayout>
              <Pricing />
            </RootLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <RootLayout>
              <Contact />
            </RootLayout>
          }
        />
        <Route
          path="/get-started"
          element={
            <RootLayout>
              <CustomerSignUpPage />
            </RootLayout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <RootLayout>
              <CustomerSignInPage />
            </RootLayout>
          }
        />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="pricing" element={<AdminPricingPage />} />
          <Route path="team" element={<AdminTeamPage />} />
          <Route path="chat" element={<AdminChatPage />} />
          <Route path="contacts" element={<ContactSubmissionsPage />} />
        </Route>
      </Routes>

      <LiveChatVisibility />
    </BrowserRouter>
  );
}

export default App;
