const showtimes = [
  {
    id: 1,
    movie: "The Last Adventure",
    screen: "Screen 1 - IMAX",
    times: [
      { time: "10:00 AM", seats: 145 },
      { time: "01:15 PM", seats: 132 },
      { time: "04:30 PM", seats: 98 },
      { time: "07:45 PM", seats: 76 },
      { time: "10:00 PM", seats: 112 },
    ],
  },
  {
    id: 2,
    movie: "Hearts Entwined",
    screen: "Screen 2 - Standard",
    times: [
      { time: "10:30 AM", seats: 89 },
      { time: "02:00 PM", seats: 67 },
      { time: "05:00 PM", seats: 45 },
      { time: "08:00 PM", seats: 34 },
    ],
  },
  {
    id: 3,
    movie: "Laugh Out Loud",
    screen: "Screen 3 - Premium",
    times: [
      { time: "11:00 AM", seats: 56 },
      { time: "02:30 PM", seats: 43 },
      { time: "06:00 PM", seats: 28 },
      { time: "09:15 PM", seats: 19 },
    ],
  },
];

export default function TodaysShowtimes() {
  return (
    <section className="cf-section">
      <div className="cf-section__head">
        <div className="cf-section__title">
          <span className="cf-section__icon cf-icon--purple">📈</span>
          Today&apos;s Showtimes
        </div>
      </div>

      <div className="cf-showtimeList">
        {showtimes.map((s) => (
          <div key={s.id} className="cf-showtimeRow">
            <div className="cf-showtimeRow__left">
              <div className="cf-miniIcon cf-miniIcon--purple">🎬</div>
              <div>
                <div className="cf-showtimeRow__movie">{s.movie}</div>
                <div className="cf-showtimeRow__screen">📍 {s.screen}</div>
              </div>
            </div>

            <div className="cf-showtimeRow__times">
              {s.times.map((t, idx) => (
                <button key={idx} className="cf-timeChip" type="button">
                  <div className="cf-timeChip__time">{t.time}</div>
                  <div className="cf-timeChip__seats">{t.seats} seats</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="cf-locationCard">
        <div className="cf-locationLeft">
          <div className="cf-miniIcon cf-miniIcon--orange">📍</div>
          <div>
            <div className="cf-locationTitle">CinemaFlow Downtown</div>
            <div className="cf-locationSub">123 Main Street, City • Open Now</div>
          </div>
        </div>
        <button className="cf-btn cf-btn--outline">Change Location</button>
      </div>
    </section>
  );
}
