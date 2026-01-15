import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function PublicRoute({ children }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/catalog" />;
  }

  return children;
}

export default PublicRoute;
