import { Navigate } from "react-router-dom";
import useDataQuery from "../hooks/useDataQuery";
import LottieLoading from "../components/utils/LottieLoading";

const ProtectedRoute = ({ children }) => {
  const { data, isLoading, error } = useDataQuery(
    ["verifyAuthVts"],
    "/api/vts/verify-auth",
    true
  );

  if (isLoading) return <LottieLoading />;
  if (error || !data) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
