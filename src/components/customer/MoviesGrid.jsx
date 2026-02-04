const movies = [
  {
    id: 1,
    title: "The Last Adventure",
    genre: "Action, Sci-Fi",
    duration: "2h 15m",
    rating: 4.5,
    age: "PG-13",
    status: "NOW",
    img: "/assets/last-adventure.jpg",
  },
  {
    id: 2,
    title: "Hearts Entwined",
    genre: "Drama, Romance",
    duration: "1h 58m",
    rating: 4.2,
    age: "PG",
    status: "NOW",
    img: "/assets/hearts-entwined.jpg",
  },
  {
    id: 3,
    title: "Future World",
    genre: "Sci-Fi, Adventure",
    duration: "2h 30m",
    rating: 4.1,
    age: "PG-13",
    status: "COMING",
    img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1400",
  },
];

export default function MoviesGrid() {
  return (
    <div className="cf-homeMovieGrid">
      {movies.map((m) => (
        <article key={m.id} className="cf-homeMovieCard">
          <div className="cf-homePosterWrap">
            <img src={m.img} className="cf-homePoster" alt={m.title} />
            <span className="cf-homeBadge">{m.age}</span>

            <button className="cf-homeOverlayBtn">
              ▶ View Details
            </button>
          </div>

          <div className="cf-homeCardBody">
            <div className="cf-homeTitle">{m.title}</div>
            <div className="cf-homeGenres">{m.genre}</div>

            <div className="cf-homeMetaRow">
              <span>🕒 {m.duration}</span>
              <span>⭐ {m.rating}/5</span>
            </div>

            {m.status === "NOW" ? (
              <button className="cf-homePrimaryBtn">
                View Showtimes
              </button>
            ) : (
              <button className="cf-homePrimaryBtn">
                Notify Me
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
