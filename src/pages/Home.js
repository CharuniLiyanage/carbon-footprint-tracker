import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Home() {
  const navigate = useNavigate();
  const { dark, setDark } = useTheme();

  return (
    <div className={dark ? "home dark" : "home"}>

      {/* 🌙 DARK MODE BUTTON */}
      <button
        onClick={() => setDark(!dark)}
        className="dark-btn-home"
      >
        {dark ? "☀️" : "🌙"}
      </button>

      {/* HERO */}
      <section className="hero">
        <h1>
          Track Your <span>Carbon Footprint</span> 🌍
        </h1>

        <p>
          Smart insights to help you reduce emissions and live sustainably.
        </p>

        <div className="buttons">
          <Link to="/login">
            <button className="primary-btn">Get Started</button>
          </Link>

          <Link to="/register">
            <button className="secondary-btn">Create Account</button>
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Why CarbonTrack?</h2>

        <div className="feature-cards">

          <div className="card" onClick={() => navigate("/dashboard")}>
            <h3>📊 Track Emissions</h3>
            <p>Analyze your daily carbon usage with smart tracking.</p>
          </div>

          <div className="card" onClick={() => navigate("/tips")}>
            <h3>🌱 Eco Tips</h3>
            <p>Personalized suggestions to reduce your impact.</p>
          </div>

          <div className="card" onClick={() => navigate("/progress")}>
            <h3>📈 Progress</h3>
            <p>Visualize your improvement over time.</p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 CarbonTrack • Build a Greener Future 🌱</p>
      </footer>

    </div>
  );
}

export default Home;