import LoadingScreen from "@/components/common/LoadingScreen";
import type { UserRole } from "@/constants/types";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  redirectPath?: string;
}

const ProtectedRoute = ({
  allowedRoles,
  redirectPath = "/login",
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  const isAllowed = allowedRoles.includes(user.role);
  if (!isAllowed) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
