import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  // close menu safely after logout
  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo" onClick={() => setOpen(false)}>
        🌱 <span>CarbonTrack</span>
      </div>

      {/* Hamburger */}
      <div className="menu-icon" onClick={() => setOpen(!open)}>
        ☰
      </div>

      {/* Links */}
      <div className={`links ${open ? "active" : ""}`}>
        <Link to="/" className="nav-link" onClick={() => setOpen(false)}>
          Home
        </Link>

        {user && (
          <>
            <Link to="/dashboard" className="nav-link" onClick={() => setOpen(false)}>
              Dashboard
            </Link>

            <Link to="/progress" className="nav-link" onClick={() => setOpen(false)}>
              Progress
            </Link>

            <Link to="/tips" className="nav-link" onClick={() => setOpen(false)}>
              Eco Tips
            </Link>

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        )}

        {!user && (
          <>
            <Link to="/login" className="nav-link" onClick={() => setOpen(false)}>
              Login
            </Link>

            <Link to="/register" className="nav-link primary-link" onClick={() => setOpen(false)}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;