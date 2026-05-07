import { useAuth } from "../context/AuthContext";

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // ❌ DO NOT redirect anywhere automatically
  // Just allow public pages always

  return children;
}

export default PublicRoute;