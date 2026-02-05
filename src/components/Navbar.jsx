import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // your AuthContext logout function
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-2">
  <div className="flex h-8 w-8 items-center justify-center rounded bg-violet-500">
    <span className="text-sm font-bold text-white">V</span>
  </div>
  <span className="text-sm font-semibold text-slate-50">
    VideoTube
  </span>
</Link>


        {/* Right side */}
        <nav className="flex items-center gap-3">
          <Link
            to="/"
            className="text-xs font-medium text-slate-200 hover:text-white"
          >
            Home
          </Link>

          {user && (
            <Link
              to="/tweets"
              className="text-xs font-medium text-slate-200 hover:text-white"
            >
              Tweets
            </Link>
          )}

          {user && (
            <Link
              to="/dashboard"
              className="text-xs font-medium text-slate-200 hover:text-white"
            >
              Dashboard
            </Link>
          )}

          {!user ? (
            <Link
              to="/login"
              className="rounded-full bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-400"
            >
              Login
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-50 hover:bg-slate-700"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
