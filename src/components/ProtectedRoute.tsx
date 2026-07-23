import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: ReactNode;
  requireApproved?: boolean;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireApproved = false,
  requireAdmin = false,
}: Props) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-(--color-bone-dim)">
        טוען...
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && profile.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (requireApproved && profile.role !== "admin" && profile.status !== "approved") {
    return <Navigate to="/pending" replace />;
  }

  return <>{children}</>;
}
