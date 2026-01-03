import { Navigate } from "react-router-dom";
import useDataQuery from "../hooks/useDataQuery";
import GlobalLoading from "../components/utils/GlobalLoading";

const ProtectedRoute = ({ children }) => {
  const { data, isLoading, error } = useDataQuery(
    ["verifyAuthVts"],
    "/api/vts/auth/verify",
    true
  );

  if (isLoading) return <GlobalLoading message="Verifying authentication..." />;
  if (error || !data) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
