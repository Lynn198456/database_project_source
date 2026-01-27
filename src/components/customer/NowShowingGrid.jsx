const nowShowing = [
  {
    id: 1,
    title: "The Last Adventure",
    genres: "Action, Sci-Fi",
    rating: 4.5,
    duration: "2h 15m",
    age: "PG-13",
    img: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Hearts Entwined",
    genres: "Drama, Romance",
    rating: 4.2,
    duration: "1h 58m",
    age: "PG",
    img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Laugh Out Loud",
    genres: "Comedy",
    rating: 4.0,
    duration: "1h 42m",
    age: "PG-13",
    img: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Midnight Shadows",
    genres: "Horror, Thriller",
    rating: 4.3,
    duration: "2h 05m",
    age: "R",
    img: "https://images.unsplash.com/photo-1520975958225-2d58f4a7f9e0?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function NowShowingGrid() {
  return (
    <section className="cf-section">
      <div className="cf-section__head">
        <div className="cf-section__title">
          <span className="cf-section__icon cf-icon--orange">🎞️</span>
          Now Showing
        </div>
        <a className="cf-section__link" href="#">
          View All →
        </a>
      </div>

      <div className="cf-movieGrid">
        {nowShowing.map((m) => (
          <article key={m.id} className="cf-movieCard">
            <div className="cf-movieCard__imgWrap">
              <img className="cf-movieCard__img" src={m.img} alt={m.title} />
              <span className="cf-badge">{m.age}</span>
            </div>

            <div className="cf-movieCard__body">
              <div className="cf-movieCard__title">{m.title}</div>
              <div className="cf-movieCard__genres">{m.genres}</div>

              <div className="cf-movieCard__meta">
                <span>⭐ {m.rating}</span>
                <span>🕒 {m.duration}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
