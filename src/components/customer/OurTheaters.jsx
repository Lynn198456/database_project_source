export default function OurTheaters() {
  return (
    <section className="cf-section">
      <div className="cf-centerTitle">Our Theaters</div>

      <div className="cf-theaterGrid">
        <div className="cf-theaterCard">
          <img
            className="cf-theaterImg"
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1400&auto=format&fit=crop"
            alt="Auditorium"
          />
          <div className="cf-theaterOverlay">
            <div className="cf-theaterTitle">Premium Auditoriums</div>
            <div className="cf-theaterDesc">
              State-of-the-art theaters with comfortable seating
            </div>
          </div>
        </div>

        <div className="cf-theaterCard">
          <img
            className="cf-theaterImg"
            src="https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=1400&auto=format&fit=crop"
            alt="Projector"
          />
          <div className="cf-theaterOverlay">
            <div className="cf-theaterTitle">Advanced Technology</div>
            <div className="cf-theaterDesc">
              Cutting-edge projection and sound systems
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
