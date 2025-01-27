import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type ProtectedRouteProps = {
  requiredRoles?: string[];
};

export function ProtectedRoute({ requiredRoles = [] }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const userRole = sessionStorage.getItem("rolName") || "";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
}
