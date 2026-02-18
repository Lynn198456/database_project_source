import "../styles/customer.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getBooking, listBookings } from "../api/bookings";
import { listMovies } from "../api/movies";
import { listShowtimes } from "../api/showtimes";
import Navbar from "../components/customer/Navbar";
import Footer from "../components/customer/Footer";
import TicketsSummary from "../components/customer/TicketsSummary";
import UpcomingTickets from "../components/customer/UpcomingTickets";
import PastTicketsTable from "../components/customer/PastTicketsTable";

const FALLBACK_POSTER =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=60";

function formatDateTime(ts) {
  const d = new Date(ts);
  return {
    date: d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  };
}

export default function MyTicketsPage() {
  const navigate = useNavigate();
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcoming: 0,
    attended: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem("cinemaFlow_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadTickets() {
      if (!user?.id) {
        setError("Please log in to view tickets.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [bookings, showtimes, movies] = await Promise.all([
          listBookings({ userId: user.id, limit: 300 }),
          listShowtimes({ limit: 500 }),
          listMovies({ limit: 500 })
        ]);

        const seatsByBookingId = {};
        await Promise.all(
          bookings.map(async (b) => {
            try {
              const detail = await getBooking(b.id);
              seatsByBookingId[b.id] = (detail.seats || []).map((s) => s.seat_label);
            } catch {
              seatsByBookingId[b.id] = [];
            }
          })
        );

        const showtimeMap = new Map(showtimes.map((s) => [Number(s.id), s]));
        const moviePosterMap = new Map(movies.map((m) => [String(m.title || "").toLowerCase(), m.poster_url || FALLBACK_POSTER]));

        const now = Date.now();
        const normalized = bookings.map((b) => {
          const st = showtimeMap.get(Number(b.showtime_id));
          const dt = formatDateTime(b.start_time);
          const startMs = new Date(b.start_time).getTime();
          const isCancelled = String(b.status || "").toUpperCase() === "CANCELLED";
          const isUpcoming = !isCancelled && startMs >= now;
          const statusLabel = isCancelled ? "Cancelled" : isUpcoming ? "Confirmed" : "Attended";

          return {
            id: b.id,
            title: b.movie_title || "-",
            poster: moviePosterMap.get(String(b.movie_title || "").toLowerCase()) || FALLBACK_POSTER,
            status: statusLabel,
            theater: st ? `${st.theater_name} - ${st.screen_name}` : "-",
            date: dt.date,
            time: dt.time,
            seats: seatsByBookingId[b.id] || [],
            price: Number(b.total_amount || 0),
            bookedOn: new Date(b.booked_at).toLocaleDateString(),
            datetime: `${dt.date} ${dt.time}`
          };
        });

        const upcomingRows = normalized.filter((n) => n.status === "Confirmed");
        const pastRows = normalized.filter((n) => n.status !== "Confirmed").map((n) => ({
          id: n.id,
          movie: n.title,
          theater: n.theater,
          datetime: n.datetime,
          seats: n.seats.join(", ") || "-",
          price: n.price,
          status: n.status
        }));

        const attendedCount = pastRows.filter((p) => p.status === "Attended").length;
        const totalSpent = normalized
          .filter((n) => n.status !== "Cancelled")
          .reduce((sum, n) => sum + Number(n.price || 0), 0);

        if (!mounted) return;
        setUpcoming(upcomingRows);
        setPast(pastRows);
        setStats({
          totalBookings: normalized.length,
          upcoming: upcomingRows.length,
          attended: attendedCount,
          totalSpent
        });
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load tickets.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadTickets();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  return (
    <div className="cf-page">
      <Navbar />

      <main className="cf-mainFull">
        <div className="cf-containerWide">
          <section className="cf-section">
            <div className="cf-ticketTop">
              <div className="cf-section__head">
                <div className="cf-section__title">
                  <span className="cf-miniIcon cf-miniIcon--purple">🎟️</span>
                  My Tickets
                </div>
                <div className="cf-section__subtitle">Manage your bookings</div>
              </div>

              <button
                className="cf-orangeBtn"
                type="button"
                onClick={() => navigate("/customer/book")}
              >
                Book New Tickets
              </button>
            </div>

            {error ? <div className="cf-empty">{error}</div> : null}
            {loading ? <div className="cf-empty">Loading tickets...</div> : null}
            <TicketsSummary stats={stats} />
          </section>

          <UpcomingTickets items={upcoming} />
          <PastTicketsTable rows={past} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
