import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserFriends,
  FaSignInAlt,
  FaCode,
  FaTrophy,
  FaCalendarAlt,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token") !== null;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const NavItem = ({ to, icon: Icon, label, color, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:scale-105 hover:brightness-110 ${color}`}
      aria-label={label}
    >
      <Icon size={18} />
      {label}
    </Link>
  );

  return (
    <nav className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white px-6 py-4 sticky top-0 z-50 shadow-xl select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => {
            navigate("/");
            setMenuOpen(false);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/")}
          className="text-4xl font-extrabold tracking-wide cursor-pointer select-none drop-shadow-lg hover:brightness-125 transition"
          aria-label="Go to homepage"
        >
          🔥 Online Judge
        </div>

        {/* Hamburger for mobile */}
        <button
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="text-white sm:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Navigation Links */}
        {/* Desktop Menu */}
        <div className="hidden sm:flex gap-4 items-center">
          <NavItem
            to="/contests"
            icon={FaCalendarAlt}
            label="Contests"
            color="text-yellow-300"
          />
          <NavItem to="/problems" icon={FaCode} label="Problems" color="text-blue-300" />
          <NavItem
            to="/daily"
            icon={FaTrophy}
            label="Daily Problem"
            color="text-purple-300"
          />
          <NavItem
            to="/friends"
            icon={FaUserFriends}
            label="Friends"
            color="text-pink-300"
          />

          {isLoggedIn ? (
            <>
              <NavItem
                to="/profile"
                icon={FaUser}
                label="Profile"
                color="text-green-400"
              />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-red-600 bg-opacity-80 hover:bg-red-700 shadow-lg text-sm font-semibold transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                aria-label="Logout"
                type="button"
              >
                <FaSignOutAlt size={18} />
                Logout
              </button>
            </>
          ) : (
            <NavItem
              to="/Auth"
              icon={FaSignInAlt}
              label="Login"
              color="text-blue-400"
            />
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden mt-4 space-y-3">
          <NavItem
            to="/contests"
            icon={FaCalendarAlt}
            label="Contests"
            color="text-yellow-300"
            onClick={() => setMenuOpen(false)}
          />
          <NavItem
            to="/problems"
            icon={FaCode}
            label="Problems"
            color="text-blue-300"
            onClick={() => setMenuOpen(false)}
          />
          <NavItem
            to="/daily"
            icon={FaTrophy}
            label="Daily Problem"
            color="text-purple-300"
            onClick={() => setMenuOpen(false)}
          />
          <NavItem
            to="/friends"
            icon={FaUserFriends}
            label="Friends"
            color="text-pink-300"
            onClick={() => setMenuOpen(false)}
          />
          {isLoggedIn ? (
            <>
              <NavItem
                to="/profile"
                icon={FaUser}
                label="Profile"
                color="text-green-400"
                onClick={() => setMenuOpen(false)}
              />
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-red-600 bg-opacity-80 hover:bg-red-700 shadow-lg text-sm font-semibold transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                aria-label="Logout"
                type="button"
              >
                <FaSignOutAlt size={18} />
                Logout
              </button>
            </>
          ) : (
            <NavItem
              to="/Auth"
              icon={FaSignInAlt}
              label="Login"
              color="text-blue-400"
              onClick={() => setMenuOpen(false)}
            />
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
