import { useMemo } from "react";
import useDataQuery from "./useDataQuery";

const useCustomerVehicle = () => {
  const query = useDataQuery(
    ["customer-vehicles"],
    "/api/vts/customer/subscriptions"
  );

  const vehicles = useMemo(() => {
    const d = query.data;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data)) return d.data;
    if (Array.isArray(d?.vehicles)) return d.vehicles;
    return [];
  }, [query.data]);

  return {
    ...query,
    data: vehicles,
  };
};

export default useCustomerVehicle;
