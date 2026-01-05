import useDataQuery from "./useDataQuery";

const useCustomerVehicle = () => {
  return useDataQuery(
    ["customer-vehicles"],
    "/api/vts/customer/subscriptions"
  );
};

export default useCustomerVehicle;
