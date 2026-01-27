const comingSoon = [
  { id: 1, title: "Epic Quest", date: "Dec 15" },
  { id: 2, title: "Love Again", date: "Dec 20" },
  { id: 3, title: "Dark Waters", date: "Dec 25" },
  { id: 4, title: "City Lights", date: "Jan 5" },
  { id: 5, title: "Space Odyssey", date: "Jan 12" },
  { id: 6, title: "The Mystery", date: "Jan 18" },
];

export default function ComingSoon() {
  return (
    <section className="cf-section">
      <div className="cf-section__head">
        <div className="cf-section__title">
          <span className="cf-section__icon cf-icon--pink">✨</span>
          Coming Soon
        </div>
        <a className="cf-section__link" href="#">
          View All →
        </a>
      </div>

      <div className="cf-comingGrid">
        {comingSoon.map((m) => (
          <div key={m.id} className="cf-comingCard">
            <div className="cf-comingPoster">🎞️</div>
            <div className="cf-comingBody">
              <div className="cf-comingTitle">{m.title}</div>
              <div className="cf-comingDate">{m.date}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
