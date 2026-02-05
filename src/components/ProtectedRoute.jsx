import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Optional: if your AuthContext has a loading state while checking token
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 text-slate-100">
        Checking authentication...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
