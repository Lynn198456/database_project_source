import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import LoginPage from "./pages/LoginPage";
import CustomerHome from "./pages/CustomerHome";
import MoviesPage from "./pages/MoviesPage";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import ShowtimesPage from "./pages/ShowtimesPage";
import TheatersPage from "./pages/TheatersPage";
import MyTicketsPage from "./pages/MyTicketsPage";
/*
  localStorage user example:
  key: cinemaFlow_user
  value: { email: "test@mail.com", role: "CUSTOMER" }
*/
function getUser() {
  try {
    const raw = localStorage.getItem("cinemaFlow_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/* ---------- AUTH GUARDS ---------- */

function ProtectedRoute({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RoleRoute({ allowRole, children }) {
  const user = getUser();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== allowRole) {
    if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
    if (user.role === "STAFF") return <Navigate to="/staff" replace />;
    return <Navigate to="/customer" replace />;
  }

  return children;
}

/* ---------- APP ---------- */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* CUSTOMER ROUTES */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <RoleRoute allowRole="CUSTOMER">
                <CustomerHome />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/movies"
          element={
            <ProtectedRoute>
              <RoleRoute allowRole="CUSTOMER">
                <MoviesPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* (Later you will create these pages) */}
        <Route
  path="/customer/showtimes"
  element={
    <ProtectedRoute>
      <RoleRoute allowRole="CUSTOMER">
        <ShowtimesPage />
      </RoleRoute>
    </ProtectedRoute>
  }
/>


        <Route
          path="/customer/theaters"
          element={
            <ProtectedRoute>
              <RoleRoute allowRole="CUSTOMER">
                <TheatersPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
<Route
  path="/customer/tickets"
  element={
    <ProtectedRoute>
      <RoleRoute allowRole="CUSTOMER">
        <MyTicketsPage />
      </RoleRoute>
    </ProtectedRoute>
  }
/>

        

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowRole="ADMIN">
                <AdminDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* STAFF */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <RoleRoute allowRole="STAFF">
                <StaffDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Default / fallback */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}