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

        {user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/tips">Tips</Link>
            <Link to="/progress">Progress</Link>
            <button onClick={logout}>Logout</button>
          </>
        )}

        {!user && (
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