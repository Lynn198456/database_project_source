const THEATERS = [
  {
    id: 1,
    name: "Cinema Listic Downtown",
    address: "123 Main Street, City, State 12345",
    phone: "(555) 123-4567",
    screens: 8,
    seats: 1200,
    facilities: ["Standard", "Dolby Atmos", "Snack Bar", "IMAX"],
    active: true,
    img: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Cinema Listic Mall Location",
    address: "456 Shopping Ave, City, State 12345",
    phone: "(555) 234-5678",
    screens: 6,
    seats: 900,
    facilities: ["Standard", "Dolby Digital", "Snack Bar"],
    active: true,
    img: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Cinema Listic Riverside",
    address: "789 River Road, City, State 12345",
    phone: "(555) 345-6789",
    screens: 5,
    seats: 750,
    facilities: ["Standard", "Dolby Digital", "Snack Bar"],
    active: true,
    img: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function TheatersGrid() {
  return (
    <div className="cf-theaterGrid">
      {THEATERS.map((t) => (
        <article key={t.id} className="cf-theaterCard">
          <div className="cf-theaterImgWrap">
            <img className="cf-theaterImg" src={t.img} alt={t.name} />

            {t.active && (
              <span className="cf-theaterActive">
                <span className="cf-dot" /> Active
              </span>
            )}
          </div>

          <div className="cf-theaterBody">
            <div className="cf-theaterName">{t.name}</div>

            <div className="cf-theaterInfo">
              <div className="cf-theaterRow">
                <span className="cf-theaterIcon">📍</span>
                <span>{t.address}</span>
              </div>
              <div className="cf-theaterRow">
                <span className="cf-theaterIcon">📞</span>
                <span>{t.phone}</span>
              </div>
            </div>

            <div className="cf-theaterStats">
              <div className="cf-theaterStat cf-blueBox">
                <div className="cf-theaterStatLabel">Screens</div>
                <div className="cf-theaterStatValue">{t.screens}</div>
              </div>

              <div className="cf-theaterStat cf-purpleBox">
                <div className="cf-theaterStatLabel">Seats</div>
                <div className="cf-theaterStatValue">{t.seats}</div>
              </div>
            </div>

            <div className="cf-theaterFacilitiesTitle">Facilities:</div>
            <div className="cf-theaterTags">
              {t.facilities.map((f) => (
                <span key={f} className="cf-tag">
                  {f}
                </span>
              ))}
            </div>

            <button className="cf-theaterBtn" type="button">
              View Showtimes
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
