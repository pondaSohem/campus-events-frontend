import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function RequireAuth({
  children,
  admin = false,
}: {
  children: React.ReactNode;
  admin?: boolean;
}) {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  if (!isAuthenticated)
    return <Navigate to="/login" replace state={{ from: location }} />;
  if (admin && !isAdmin)
    return (
      <div className="alert alert-danger">
        This page is restricted to administrators.
      </div>
    );
  return <>{children}</>;
}
