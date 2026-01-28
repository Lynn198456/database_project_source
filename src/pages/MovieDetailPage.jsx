import "../styles/movieDetail.css"; // <-- make sure this path matches your css file name
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

/**
 * Movie source:
 * - MoviesPage saves: localStorage.setItem("cinemaFlow_selectedMovie", JSON.stringify(movie))
 * Booking draft target:
 * - localStorage key: cinemaFlow_booking
 * - navigate to: /customer/book  (BookTicketsPage.jsx)
 */

const DEFAULT_SHOWTIMES = [
  {
    time: "10:00 AM",
    type: "IMAX",
    price: 15,
    location: "CinemaFlow Downtown",
    screen: "Screen 1 - IMAX",
    seats: 75,
  },
  {
    time: "01:15 PM",
    type: "Standard",
    price: 12,
    location: "CinemaFlow Downtown",
    screen: "Screen 2 - Standard",
    seats: 48,
    highlighted: true,
  },
  {
    time: "04:30 PM",
    type: "IMAX",
    price: 15,
    location: "CinemaFlow Mall",
    screen: "Screen 1 - IMAX",
    seats: 92,
  },
  {
    time: "07:45 PM",
    type: "IMAX",
    price: 15,
    location: "CinemaFlow Downtown",
    screen: "Screen 1 - IMAX",
    seats: 31,
  },
  {
    time: "10:00 PM",
    type: "Premium",
    price: 18,
    location: "CinemaFlow Mall",
    screen: "Screen 3 - Premium",
    seats: 64,
  },
];

function readSelectedMovie() {
  try {
    const raw = localStorage.getItem("cinemaFlow_selectedMovie");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function MovieDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // route: /customer/movies/:id

  const movie = useMemo(() => {
    const stored = readSelectedMovie();

    // If user refreshes page and localStorage is missing, you still show a safe fallback UI
    if (!stored) {
      return {
        id: id || "unknown",
        title: "Movie",
        genre: "Genre",
        rating: 0,
        duration: "—",
        age: "—",
        poster:
          "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
        showtimes: DEFAULT_SHOWTIMES,
      };
    }

    return {
      ...stored,
      showtimes: stored.showtimes && stored.showtimes.length > 0 ? stored.showtimes : DEFAULT_SHOWTIMES,
    };
  }, [id]);

  function onClose() {
    navigate(-1);
  }

  function onBook(showtime) {
    // Create booking draft for BookTicketsPage
    const bookingDraft = {
      movieId: movie.id,
      movieTitle: movie.title,
      genre: movie.genre,
      poster: movie.poster,
      rating: movie.rating,
      duration: movie.duration,
      age: movie.age,

      // Showtime details
      dateLabel: "Today",
      time: showtime.time,
      type: showtime.type,
      price: showtime.price,
      location: showtime.location,
      screen: showtime.screen,
      seatsAvailable: showtime.seats,
    };

    localStorage.setItem("cinemaFlow_booking", JSON.stringify(bookingDraft));
    navigate("/customer/book"); // ✅ go to BookTicketsPage.jsx
  }

  return (
    <div className="md-overlay">
      <div className="md-card">
        {/* Header */}
        <div className="md-header">
          <img className="md-poster" src={movie.poster} alt={movie.title} />

          <div className="md-titleArea">
            <h2 className="md-title">{movie.title}</h2>
            <p className="md-sub">{movie.genre}</p>

            <div className="md-metaRow">
              <span className="md-metaItem">
                <span className="md-ico">⏱</span> {movie.duration}
              </span>
              <span className="md-metaItem">
                <span className="md-ico">⭐</span> {movie.rating}/5
              </span>
              <span className="md-pill md-age">{movie.age}</span>
            </div>
          </div>

          <button className="md-x" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Section title */}
        <div className="md-sectionTitle">
          <span className="md-ico">📅</span>
          <span>Available Showtimes - Today</span>
        </div>

        {/* Showtime list */}
        <div className="md-list">
          {movie.showtimes.map((s, idx) => (
            <div
              key={idx}
              className={`md-row ${s.highlighted ? "md-rowHighlight" : ""}`}
            >
              <div className="md-left">
                <div className="md-time">{s.time}</div>
                <div className="md-pill md-type">{s.type}</div>
                <div className="md-price">${Number(s.price).toFixed(2)}</div>
              </div>

              <div className="md-mid">
                <div className="md-info">
                  <span className="md-dot">📍</span> {s.location}
                </div>
                <div className="md-info">
                  <span className="md-dot">🎟</span> {s.screen}
                  <span className="md-seats">{s.seats} seats available</span>
                </div>
              </div>

              <div className="md-right">
                <button
                  className="md-bookBtn"
                  type="button"
                  onClick={() => onBook(s)}
                >
                  ▶ Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom close */}
        <button className="md-closeBtn" onClick={onClose} type="button">
          Close
        </button>
      </div>
    </div>
  );
}
