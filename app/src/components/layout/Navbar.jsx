import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaBalanceScale,
  FaChartBar,
  FaHistory,
  FaUserAstronaut,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
} from "react-icons/fa";

// Import Logo
import logo from "../../assets/logo/logo.png";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: FaHome, end: true },
  { to: "/detect", label: "Detect News", icon: FaSearch },
  { to: "/compare", label: "Compare Models", icon: FaBalanceScale },
  { to: "/analytics", label: "Analytics", icon: FaChartBar },
  { to: "/history", label: "History", icon: FaHistory },
  { to: "/developer", label: "Developer", icon: FaUserAstronaut },
];

function Navbar({ theme, toggleTheme }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="nav-inner">
        {/* Logo */}
        <NavLink to="/" className="logo" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="TruthLens AI Logo"
            className="logo-img"
          />

          <h2 className="logo-text">
            TruthLens <span>. AI</span>
          </h2>
        </NavLink>

        {/* Navigation Links */}
        <nav className={`nav-links ${open ? "open" : ""}`}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <Icon />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right Side Buttons */}
        <div className="nav-right">
          <button
            className="theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          <button
            className="nav-toggle"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;