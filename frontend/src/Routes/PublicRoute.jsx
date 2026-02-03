import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Cargando...</div>;
  }

  if (user) {
    return <Navigate to="/catalog" />;
  }

  return children;
}

export default PublicRoute;
