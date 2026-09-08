import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { RootLayout } from "./layouts/rootLayout";
import { Home } from "./routes/Home";

const About = lazy(() =>
  import("./routes/About").then(({ About }) => ({ default: About })),
);
const Services = lazy(() =>
  import("./routes/Services").then(({ Services }) => ({ default: Services })),
);
const Projects = lazy(() =>
  import("./routes/Projects").then(({ Projects }) => ({ default: Projects })),
);
const Pricing = lazy(() =>
  import("./routes/Pricing").then(({ Pricing }) => ({ default: Pricing })),
);
const Contact = lazy(() =>
  import("./routes/Contact").then(({ Contact }) => ({ default: Contact })),
);

const CustomerSignInPage = lazy(() =>
  import("./features/customer/auth/CustomerSignInPage").then(
    ({ CustomerSignInPage }) => ({ default: CustomerSignInPage }),
  ),
);
const CustomerSignUpPage = lazy(() =>
  import("./features/customer/auth/CustomerSignUpPage").then(
    ({ CustomerSignUpPage }) => ({ default: CustomerSignUpPage }),
  ),
);
const ProtectedCustomerRoute = lazy(() =>
  import("./features/customer/auth/ProtectedCustomerRoute").then(
    ({ ProtectedCustomerRoute }) => ({ default: ProtectedCustomerRoute }),
  ),
);
const CustomerDashboardPage = lazy(() =>
  import("./features/customer/dashboard/CustomerDashboardPage").then(
    ({ CustomerDashboardPage }) => ({ default: CustomerDashboardPage }),
  ),
);
const ProjectRequestsDetailsPage = lazy(() =>
  import(
    "./features/customer/project-requests/components/ProjectRequestsDetailsPage"
  ).then(({ ProjectRequestsDetailsPage }) => ({
    default: ProjectRequestsDetailsPage,
  })),
);

const AdminLogin = lazy(() =>
  import("./features/admin/auth/AdminLogin").then(({ AdminLogin }) => ({
    default: AdminLogin,
  })),
);
const ProtectedAdminRoute = lazy(() =>
  import("./features/admin/auth/ProtectedAdminRoute").then(
    ({ ProtectedAdminRoute }) => ({ default: ProtectedAdminRoute }),
  ),
);
const AdminLayout = lazy(() =>
  import("./features/admin/layout/AdminLayout").then(({ AdminLayout }) => ({
    default: AdminLayout,
  })),
);
const AdminDashboard = lazy(() =>
  import("./features/admin/dashboard/AdminDashboard").then(
    ({ AdminDashboard }) => ({ default: AdminDashboard }),
  ),
);
const AdminProjectsPage = lazy(() =>
  import("./features/admin/projects/components/AdminProjectsPage").then(
    ({ AdminProjectsPage }) => ({ default: AdminProjectsPage }),
  ),
);
const AdminProjectRequestsPage = lazy(() =>
  import("./features/admin/project-requests/AdminProjectRequestsPage").then(
    ({ AdminProjectRequestsPage }) => ({ default: AdminProjectRequestsPage }),
  ),
);
const AdminServicesPage = lazy(() =>
  import("./features/admin/services/AdminServicesPage").then(
    ({ AdminServicesPage }) => ({ default: AdminServicesPage }),
  ),
);
const AdminPricingPage = lazy(() =>
  import("./features/admin/pricing/AdminPricingPage").then(
    ({ AdminPricingPage }) => ({ default: AdminPricingPage }),
  ),
);
const AdminTeamPage = lazy(() =>
  import("./features/admin/team/AdminTeamPage").then(({ AdminTeamPage }) => ({
    default: AdminTeamPage,
  })),
);
const AdminChatPage = lazy(() =>
  import("./features/admin/chat/components/AdminChatPage").then(
    ({ AdminChatPage }) => ({ default: AdminChatPage }),
  ),
);
const ContactSubmissionsPage = lazy(() =>
  import("./features/admin/contacts/ContactSubmissionsPage").then(
    ({ ContactSubmissionsPage }) => ({ default: ContactSubmissionsPage }),
  ),
);

const RouteLoadingFallback = () => (
  <div aria-live="polite" style={styles.routeLoading}>
    Loading page...
  </div>
);

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
              <Suspense fallback={<RouteLoadingFallback />}>
                <About />
              </Suspense>
            </RootLayout>
          }
        />
        <Route
          path="/services"
          element={
            <RootLayout>
              <Suspense fallback={<RouteLoadingFallback />}>
                <Services />
              </Suspense>
            </RootLayout>
          }
        />
        <Route
          path="/projects"
          element={
            <RootLayout>
              <Suspense fallback={<RouteLoadingFallback />}>
                <Projects />
              </Suspense>
            </RootLayout>
          }
        />
        <Route
          path="/pricing"
          element={
            <RootLayout>
              <Suspense fallback={<RouteLoadingFallback />}>
                <Pricing />
              </Suspense>
            </RootLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <RootLayout>
              <Suspense fallback={<RouteLoadingFallback />}>
                <Contact />
              </Suspense>
            </RootLayout>
          }
        />
        <Route
          path="/get-started"
          element={
            <RootLayout>
              <Suspense fallback={<RouteLoadingFallback />}>
                <CustomerSignUpPage />
              </Suspense>
            </RootLayout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <RootLayout>
              <Suspense fallback={<RouteLoadingFallback />}>
                <CustomerSignInPage />
              </Suspense>
            </RootLayout>
          }
        />
        <Route
          path="/customer"
          element={<Navigate to="/customer/dashboard" replace />}
        />

        <Route
          path="/customer/dashboard"
          element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <ProtectedCustomerRoute>
                <RootLayout>
                  <CustomerDashboardPage />
                </RootLayout>
              </ProtectedCustomerRoute>
            </Suspense>
          }
        />

        <Route
          path="/customer/projects/:id"
          element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <ProtectedCustomerRoute>
                <RootLayout>
                  <ProjectRequestsDetailsPage />
                </RootLayout>
              </ProtectedCustomerRoute>
            </Suspense>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            </Suspense>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route
            path="projects"
            element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <AdminProjectsPage />
              </Suspense>
            }
          />
          <Route
            path="project-requests"
            element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <AdminProjectRequestsPage />
              </Suspense>
            }
          />
          <Route
            path="services"
            element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <AdminServicesPage />
              </Suspense>
            }
          />
          <Route
            path="pricing"
            element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <AdminPricingPage />
              </Suspense>
            }
          />
          <Route
            path="team"
            element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <AdminTeamPage />
              </Suspense>
            }
          />
          <Route
            path="chat"
            element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <AdminChatPage />
              </Suspense>
            }
          />
          <Route
            path="contacts"
            element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <ContactSubmissionsPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>

    </BrowserRouter>
  );
}

export default App;

const styles = {
  routeLoading: {
    minHeight: "50vh",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    color: "var(--text-muted)",
  },
};
