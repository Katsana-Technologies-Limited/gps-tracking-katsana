import { Navigate } from "react-router-dom";
import useDataQuery from "../hooks/useDataQuery";
import GlobalLoading from "../utils/GlobalLoading";

const ProtectedRoute = ({ children }) => {
  const { data, isLoading, error } = useDataQuery(
    ["verifyAuthVts"],
    "/api/auth/vts-verify",
    true
  );

  if (isLoading) return <GlobalLoading message="Verifying authentication..." />;
  if (error || !data) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
