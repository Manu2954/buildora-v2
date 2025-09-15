import { Navigate } from "react-router-dom";
import { currentUser } from "@/lib/api";

export default function ProtectedRoute({ children, roles }: { children: JSX.Element; roles?: string[] }) {
  const user = currentUser<{ role?: string } | null>();
  const hasAuth = !!user;
  const ok = hasAuth && (!roles || (user?.role && roles.includes(user.role)));
  if (!ok) return <Navigate to="/admin/login" replace />;
  return children;
}

