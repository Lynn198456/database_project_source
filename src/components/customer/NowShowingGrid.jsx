const movies = [
  {
    id: 1,
    title: "The Last Adventure",
    genres: "Action, Sci-Fi",
    duration: "2h 15m",
    rating: 4.5,
    age: "PG-13",
    status: "NOW",
    img: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Hearts Entwined",
    genres: "Drama, Romance",
    duration: "1h 58m",
    rating: 4.2,
    age: "PG",
    status: "NOW",
    img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Laugh Out Loud",
    genres: "Comedy",
    duration: "1h 42m",
    rating: 4.0,
    age: "PG-13",
    status: "NOW",
    img: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Midnight Shadows",
    genres: "Horror, Thriller",
    duration: "2h 05m",
    rating: 4.3,
    age: "R",
    status: "NOW",
    img: "https://images.unsplash.com/photo-1520975958225-2d58f4a7f9e0?q=80&w=1400&auto=format&fit=crop",
  },
];

export default function NowShowingGrid() {
  return (
    <section className="cf-section">
      <div className="cf-section__head">
        <div className="cf-section__title">
          <span className="cf-miniIcon cf-miniIcon--orange">🎞️</span>
          Now Showing
        </div>
        <a className="cf-section__link" href="#">
          View All →
        </a>
      </div>

      <div className="cf-homeMovieGrid">
        {movies.map((m) => (
          <article key={m.id} className="cf-homeMovieCard">
            {/* Poster area */}
            <div className="cf-homePosterWrap">
              <img className="cf-homePoster" src={m.img} alt={m.title} />

              <span className="cf-homeBadge">{m.age}</span>

              <button className="cf-homeOverlayBtn" type="button">
                ▶ View Details
              </button>
            </div>

            {/* Bottom info */}
            <div className="cf-homeCardBody">
              <div className="cf-homeTitle">{m.title}</div>
              <div className="cf-homeGenres">{m.genres}</div>

              <div className="cf-homeMetaRow">
                <span className="cf-homeMetaItem">🕒 {m.duration}</span>
                <span className="cf-homeMetaItem">⭐ {m.rating}/5</span>
              </div>

              <button className="cf-homePrimaryBtn" type="button">
                View Showtimes
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
