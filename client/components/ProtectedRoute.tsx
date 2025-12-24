import { Navigate } from "react-router-dom";
import { currentUser } from "@/lib/api";

function loginPathForRoles(roles?: string[]) {
  if (roles?.includes("ADMIN")) return "/admin/login";
  if (roles?.includes("SALESMAN")) return "/salesman/login";
  return "/login";
}

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: JSX.Element;
  roles?: string[];
}) {
  const user = currentUser<{ role?: string } | null>();
  const hasAuth = !!user;
  const ok = hasAuth && (!roles || (user?.role && roles.includes(user.role)));
  if (!ok) return <Navigate to={loginPathForRoles(roles)} replace />;
  return children;
}
