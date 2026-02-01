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
