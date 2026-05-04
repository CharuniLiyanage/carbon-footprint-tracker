import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <h3>Loading...</h3>;

  if (user) return <Navigate to="/dashboard" replace />;

  return children;
}

export default PublicRoute;