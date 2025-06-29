import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // or your auth token key
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-semibold">🔥 Online Judge</div>
      <div className="flex gap-6 text-sm font-medium">
        <Link to="/contests" className="hover:text-yellow-400">Contests</Link>
        <Link to="/problems" className="hover:text-yellow-400">Problems</Link>
        <Link to="/daily" className="hover:text-yellow-400">Daily Problem</Link>
        <Link to="/friends" className="hover:text-yellow-400">Friends</Link>
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-600 ml-4"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
