import { Navigate } from "react-router-dom";
import useDataQuery from "../hooks/useDataQuery";
import LoadingSpinner from "../components/utils/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { data, isLoading, error } = useDataQuery(
    ["verifyAuthVts"],
    "/api/vts/verify-auth",
    true,
  );

  if (isLoading) return <LoadingSpinner />;
  if (error || !data) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
