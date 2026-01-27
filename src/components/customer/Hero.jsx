const featuredMovie = {
  title: "The Last Adventure",
  desc:
    "An epic journey through space and time. Experience the ultimate adventure in stunning 4K with Dolby Atmos sound. A cinematic masterpiece that will leave you breathless.",
  age: "PG-13",
  duration: "2h 15m",
  status: "Now Showing",
  rating: 4.5,
  image:
    "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1400&auto=format&fit=crop",
};

export default function Hero() {
  return (
    <section className="cf-hero">
      <div className="cf-hero__left">
        <div className="cf-heroPill">
          <span className="cf-heroPill__icon">⭐</span>
          Featured This Week
        </div>

        <h1 className="cf-heroTitle">
          The Last <br /> Adventure
        </h1>

        <p className="cf-heroDesc">{featuredMovie.desc}</p>

        <div className="cf-heroMeta">
          <span className="cf-heroTag">{featuredMovie.age}</span>

          <span className="cf-heroMetaItem">
            <span className="cf-heroMetaIcon">🕒</span>
            {featuredMovie.duration}
          </span>

          <span className="cf-heroMetaItem">
            <span className="cf-heroMetaIcon">📅</span>
            {featuredMovie.status}
          </span>

          <span className="cf-heroMetaItem">
            <span className="cf-heroMetaIcon">⭐</span>
            {featuredMovie.rating} <span className="cf-heroMetaMuted">/ 5</span>
          </span>
        </div>

        <div className="cf-heroActions">
          <button className="cf-heroBtn cf-heroBtn--primary" type="button">
            <span className="cf-heroBtnIcon">▶</span>
            Book Tickets Now
          </button>

          <button className="cf-heroBtn cf-heroBtn--secondary" type="button">
            <span className="cf-heroBtnIcon">ⓘ</span>
            More Info
          </button>
        </div>
      </div>

      <div className="cf-hero__right">
        <div className="cf-heroGlow" />
        <div className="cf-heroPosterWrap">
          <img className="cf-heroPoster" src={featuredMovie.image} alt={featuredMovie.title} />
        </div>
      </div>
    </section>
  );
}
