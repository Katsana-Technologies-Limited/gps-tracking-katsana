// import useDataQuery from "./useDataQuery";

// const useCustomerVehicle = () => {
//   return useDataQuery(
//     ["customer-vehicles"],
//     "/api/vts/customer/subscriptions"
//   );
// };

// export default useCustomerVehicle;

import { useMemo } from "react";
import useDataQuery from "./useDataQuery";

const useCustomerVehicle = () => {
  const query = useDataQuery(
    ["customer-vehicles"],
    "/api/vts/customer/subscriptions"
  );

  const vehicles = useMemo(() => {
    const d = query.data;

    // ✅ CASE 1: API already returns array
    if (Array.isArray(d)) return d;

    // ✅ CASE 2: API returns { data: [...] }
    if (Array.isArray(d?.data)) return d.data;

    // ✅ CASE 3: API returns { vehicles: [...] }
    if (Array.isArray(d?.vehicles)) return d.vehicles;

    // ✅ fallback
    return [];
  }, [query.data]);

  return {
    ...query,
    data: vehicles, // 🔥 ALWAYS ARRAY
  };
};

export default useCustomerVehicle;
