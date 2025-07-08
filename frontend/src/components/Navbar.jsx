import { Link, useNavigate } from "react-router-dom";
import { FaUserFriends, FaSignInAlt, FaCode, FaTrophy, FaCalendarAlt, FaUser, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token") !== null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const NavItem = ({ to, icon: Icon, label, color }) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition text-sm font-medium ${color}`}
    >
      <Icon size={16} />
      {label}
    </Link>
  );

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-semibold">🔥 Online Judge</div>
      <div className="flex gap-4 items-center flex-wrap">

        <NavItem to="/contests" icon={FaCalendarAlt} label="Contests" color="text-yellow-300" />
        <NavItem to="/problems" icon={FaCode} label="Problems" color="text-blue-300" />
        <NavItem to="/daily" icon={FaTrophy} label="Daily Problem" color="text-purple-300" />
        <NavItem to="/friends" icon={FaUserFriends} label="Friends" color="text-pink-300" />

        {isLoggedIn ? (
          <>
            <NavItem to="/profile" icon={FaUser} label="Profile" color="text-green-400" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition text-sm font-medium text-red-400"
            >
              <FaSignOutAlt size={16} />
              Logout
            </button>
          </>
        ) : (
          <NavItem to="/Auth" icon={FaSignInAlt} label="Login" color="text-blue-400" />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
