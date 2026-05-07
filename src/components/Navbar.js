import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        🌱 <span>CarbonTrack</span>
      </div>

      {/* Links */}
      <div className="links">
        <Link to="/" className="nav-link">Home</Link>

        {user && (
          <>

            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/progress" className="nav-link">Progress</Link>
            <Link to="/tips" className="nav-link">Eco Tips</Link>

            <button onClick={logout} className="logout-btn">
              Logout
            </button>

            

          </>
        )}

        {!user && (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link primary-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;