import useDataQuery from "./useDataQuery";

const useCustomerVehicle = () => {
  return useDataQuery(
    ["customer-vehicles"],
    "/api/vts/customersubscriptionget"
  );
};

export default useCustomerVehicle;
