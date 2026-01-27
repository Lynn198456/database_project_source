export default function Footer() {
  return (
    <footer className="cf-footer">
      <div className="cf-footer__inner">
        <div className="cf-footer__col">
          <div className="cf-footer__head">
            <span className="cf-section__icon cf-icon--orange">🎞️</span> About Us
          </div>
          <a className="cf-footer__link" href="#">Our Story</a>
          <a className="cf-footer__link" href="#">Locations</a>
          <a className="cf-footer__link" href="#">Contact</a>
        </div>

        <div className="cf-footer__col">
          <div className="cf-footer__head">Movies</div>
          <a className="cf-footer__link" href="#">Now Showing</a>
          <a className="cf-footer__link" href="#">Coming Soon</a>
          <a className="cf-footer__link" href="#">Advance Tickets</a>
        </div>

        <div className="cf-footer__col">
          <div className="cf-footer__head">Support</div>
          <a className="cf-footer__link" href="#">FAQ</a>
          <a className="cf-footer__link" href="#">Ticket Policy</a>
          <a className="cf-footer__link" href="#">Gift Cards</a>
        </div>

        <div className="cf-footer__col">
          <div className="cf-footer__head">Connect</div>
          <a className="cf-footer__link" href="#">Newsletter</a>
          <a className="cf-footer__link" href="#">Social Media</a>
          <a className="cf-footer__link" href="#">Mobile App</a>
        </div>
      </div>
    </footer>
  );
}
