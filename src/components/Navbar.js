import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <h2>🌱 CarbonTrack</h2>

      <div className="links">
        <Link to="/">Home</Link>

        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/tips">Eco Tips</Link>
            <Link to="/progress">Progress</Link>
            <Link to="/ai-advisor">AI Tips</Link>
            <Link to="/ai-chat">AI Chat</Link>
            
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;