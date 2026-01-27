import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import CustomerLayout from "./pages/CustomerLayout";

import CustomerHome from "./pages/CustomerHome";
import MoviesPage from "./pages/MoviesPage";
import ShowtimesPage from "./pages/ShowtimesPage";
import TheatersPage from "./pages/TheatersPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import ProfilePage from "./pages/Profile";

import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";

function getUser() {
  try {
    const raw = localStorage.getItem("cinemaFlow_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* CUSTOMER (Navbar + Footer applied here) */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <RoleRoute allowRole="CUSTOMER">
                <CustomerLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerHome />} />
          <Route path="movies" element={<MoviesPage />} />
          <Route path="showtimes" element={<ShowtimesPage />} />
          <Route path="theaters" element={<TheatersPage />} />
          <Route path="tickets" element={<MyTicketsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

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

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
