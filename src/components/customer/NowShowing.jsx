const movies = [
  { id: 1, title: "Neon City", genre: "Action", rating: 4.2 },
  { id: 2, title: "Moonlight Train", genre: "Drama", rating: 4.6 },
  { id: 3, title: "Laugh Factory", genre: "Comedy", rating: 4.0 },
  { id: 4, title: "Mystic Woods", genre: "Fantasy", rating: 4.3 },
];

export default function NowShowing() {
  return (
    <section className="cf-section">
      <div className="cf-section__head">
        <div className="cf-section__title">
          <span className="cf-section__icon">🎞️</span> Now Showing
        </div>
        <a className="cf-section__link" href="#">
          View All →
        </a>
      </div>

      <div className="cf-grid">
        {movies.map((m) => (
          <div key={m.id} className="cf-card">
            <div className="cf-card__poster">🎬</div>
            <div className="cf-card__body">
              <div className="cf-card__title">{m.title}</div>
              <div className="cf-card__sub">
                {m.genre} • ⭐ {m.rating}
              </div>
              <button className="cf-btn cf-btn--small">Showtimes</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
