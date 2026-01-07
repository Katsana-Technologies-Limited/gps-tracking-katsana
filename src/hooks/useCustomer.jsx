import { useAxios } from "./useAxios";
import { useQuery } from "@tanstack/react-query";

const useCustomer = () => {
  const axiosUrl = useAxios();
  const { data, isLoading, error } = useQuery({
    queryKey: ["vtsProfile"],
    queryFn: async () => {
      const res = await axiosUrl.get("/api/vts/auth/profile");
      return res.data.profile;
    },
  });

  return { data, isLoading, error };
};

export default useCustomer;
