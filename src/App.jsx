import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StaffLoginPage from "./pages/staff/StaffLoginPage";
import StaffRegisterPage from "./pages/staff/StaffRegisterPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminRegisterPage from "./pages/admin/AdminRegisterPage";
import CustomerHome from "./pages/CustomerHome";
import MoviesPage from "./pages/MoviesPage";
import ShowtimesPage from "./pages/ShowtimesPage";
import TheatersPage from "./pages/TheatersPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import ProfilePage from "./pages/Profile";
import BookTicketsPage from "./pages/BookTicketsPage";
import BookTime from "./pages/BookTime";
import BookSeats from "./pages/BookSeats";
import BookPaymentPage from "./pages/BookPayment";
import BookingConfirmed from "./pages/BookingConfirmed";
import MovieDetailPage from "./pages/MovieDetailPage";
import MoviesWatchedPage from "./pages/MoviesWatchedPage";
import BookingHistoryPage from "./pages/BookingHistoryPage";
import LoyaltyPointsPage from "./pages/LoyaltyPointsPage";
import SpendingHistoryPage from "./pages/SpendingHistoryPage";
import FavoriteTheaters from "./pages/FavoriteTheaters";
import WatchlistPage from "./pages/Watchlist";
import ChangePassword from "./pages/ChangePassword";
import LoginHistory from "./pages/LoginHistory";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffSchedule from "./pages/staff/StaffSchedule";
import StaffTimesheet from "./pages/staff/StaffTimesheet";
import StaffTasks from "./pages/staff/StaffTasks";
import StaffProfile from "./pages/staff/StaffProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMovies from "./pages/admin/AdminMovies";
import AdminShowtimes from "./pages/admin/AdminShowtimes";
import AdminTheaters from "./pages/admin/AdminTheaters";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminMovieEdit from "./pages/admin/AdminMovieEdit";
import AdminSchedule from "./pages/admin/AdminSchedule";
import AdminApiKeys from "./pages/admin/AdminApiKeys";
import AdminLoginHistory from "./pages/admin/AdminLoginHistory";
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
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/staff/login" element={<StaffLoginPage />} />
        <Route path="/staff/register" element={<StaffRegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/register" element={<AdminRegisterPage />} />

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

        {/* ✅ Movie Detail Page (View Detail) */}
        <Route
          path="/customer/movies/:id"
          element={
            <ProtectedRoute>
              <RoleRoute allowRole="CUSTOMER">
                <MovieDetailPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* (Optional alias) */}
        <Route
          path="/customer/movie/:id"
          element={
            <ProtectedRoute>
              <RoleRoute allowRole="CUSTOMER">
                <MovieDetailPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

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

        <Route
          path="/customer/profile"
          element={
            <ProtectedRoute>
              <RoleRoute allowRole="CUSTOMER">
                <ProfilePage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Booking Flow */}
        <Route
          path="/customer/book"
          element={
            <ProtectedRoute>
              <RoleRoute allowRole="CUSTOMER">
                <BookTicketsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/book/time"
          element={
            <ProtectedRoute>
              <RoleRoute allowRole="CUSTOMER">
                <BookTime />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/book/seats"
          element={
            <ProtectedRoute>
              <RoleRoute allowRole="CUSTOMER">
                <BookSeats />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/book/payment"
          element={
            <ProtectedRoute>
              <RoleRoute allowRole="CUSTOMER">
                <BookPaymentPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/book/confirmed"
          element={
            <ProtectedRoute>
              <RoleRoute allowRole="CUSTOMER">
                <BookingConfirmed />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/movies-watched"
          element={
            <ProtectedRoute>
              <RoleRoute allowRole="CUSTOMER">
                <MoviesWatchedPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/booking-history"
          element={
            <ProtectedRoute>
              <RoleRoute allowRole="CUSTOMER">
                <BookingHistoryPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/loyalty"
          element={
            <ProtectedRoute>
              <RoleRoute allowRole="CUSTOMER">
                <LoyaltyPointsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/spending-history"
          element={
            <ProtectedRoute >
              <RoleRoute allowRole="CUSTOMER">
                <SpendingHistoryPage/>
              </RoleRoute>
            </ProtectedRoute>
          }
        />
<Route path="/customer/favorite-theaters" element={<FavoriteTheaters />} />
<Route path="/customer/watchlist" element={<WatchlistPage />} />
<Route path="/customer/change-password" element={<ChangePassword />} />
<Route path="/customer/login-history" element={<LoginHistory />} />
{/* STAFF ROUTES */}
<Route path="/staff" element={<StaffDashboard />} />
<Route path="/staff/schedule" element={<StaffSchedule />} />
<Route path="/staff/timesheet" element={<StaffTimesheet />} />
<Route path="/staff/tasks" element={<StaffTasks />} />
<Route path="/staff/profile" element={<StaffProfile />} />
      {/* ADMIN ROUTES */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/movies" element={<AdminMovies />} />
      <Route path="/admin/showtimes" element={<AdminShowtimes />} />
      <Route path="/admin/theaters" element={<AdminTheaters />} />
      <Route path="/admin/team" element={<AdminTeam />} />
      <Route path="/admin/profile" element={<AdminProfile />} />
      <Route path="/admin/api-keys" element={<AdminApiKeys />} />
      <Route path="/admin/login-history" element={<AdminLoginHistory />} />
      <Route path="/admin/movies/edit/:id" element={<AdminMovieEdit />} />
      <Route path="/admin/showtimes/schedule/:id" element={<AdminSchedule />} />
      
        {/* Default / fallback */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
