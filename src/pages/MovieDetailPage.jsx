import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./movieDetail.css";

const demoMovies = [
  {
    id: "1",
    title: "The Last Adventure",
    genre: "Action, Sci-Fi",
    duration: "2h 15m",
    rating: "4.5/5",
    age: "PG-13",
    poster:
      "https://images.unsplash.com/photo-1520975958225-5979f59fbb5b?auto=format&fit=crop&w=200&q=60",
    showtimes: [
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
    ],
  },
];

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const movie = useMemo(() => {
    return demoMovies.find((m) => m.id === id) || demoMovies[0];
  }, [id]);

  const onClose = () => navigate(-1);

  const onBook = (showtime) => {
    // Save booking selection (optional)
    const booking = {
      movieId: movie.id,
      movieTitle: movie.title,
      dateLabel: "Today",
      time: showtime.time,
      hallType: showtime.type,
      price: showtime.price,
      location: showtime.location,
      screen: showtime.screen,
    };
    localStorage.setItem("cinemaFlow_bookingDraft", JSON.stringify(booking));

    // Go to your booking route (change this to your real path)
    navigate("/book");
  };

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
                <span className="md-ico">⭐</span> {movie.rating}
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
                <div className="md-price">${s.price.toFixed(2)}</div>
              </div>

              <div className="md-mid">
                <div className="md-info">
                  <span className="md-dot">📍</span> {s.location}
                </div>
                <div className="md-info">
                  <span className="md-dot">🎟</span> {s.screen}
                  <span className="md-seats">
                    {s.seats} seats available
                  </span>
                </div>
              </div>

              <div className="md-right">
                <button className="md-bookBtn" onClick={() => onBook(s)}>
                  ▶ Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom close */}
        <button className="md-closeBtn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
