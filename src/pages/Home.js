import "./Home.css";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className={dark ? "home dark" : "home"}>

<<<<<<< HEAD
      {/* HERO SECTION */}
=======
      {/* 🌙 DARK MODE BUTTON */}
      <button
        onClick={() => setDark(!dark)}
        className="dark-btn-home"
      >
        {dark ? "☀️" : "🌙"}
      </button>

      {/* HERO */}
>>>>>>> 97a84e5 (Update Files)
      <section className="hero">
        <h1>🌍 CarbonTrack</h1>
        <p>Monitor, understand, and reduce your carbon footprint easily.</p>

        <div className="buttons">
          <Link to="/login">
            <button>Get Started</button>
          </Link>

          <Link to="/register">
            <button className="secondary">Create Account</button>
          </Link>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <h2>Why Use CarbonTrack?</h2>

        <div className="feature-cards">

          <div className="card" onClick={() => navigate("/dashboard")}>
            <h3>📊 Track Emissions</h3>
            <p>Monitor your daily carbon footprint from activities.</p>
          </div>

          <div className="card" onClick={() => navigate("/tips")}>
            <h3>🌱 Eco Tips</h3>
            <p>Get smart suggestions to reduce your impact.</p>
          </div>

          <div className="card" onClick={() => navigate("/progress")}>
            <h3>📈 Progress</h3>
            <p>See your improvement over time with reports.</p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 CarbonTrack | Save Earth 🌱</p>
      </footer>

    </div>
  );
}

export default Home;