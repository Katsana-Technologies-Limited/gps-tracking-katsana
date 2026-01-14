import { useQuery } from "@tanstack/react-query";
import { useAxios } from "./useAxios";

const useDataQuery = (key, url, enabled = true, options = {}) => {
  const axiosUrl = useAxios();

  const queryFn = async () => {
    const res = await axiosUrl.get(url);
    return res.data;
  };

  const queryOptions = {
    queryKey: key,
    queryFn,
    enabled,
    ...options,
  };

  const { data, isLoading, error, refetch } = useQuery(queryOptions);
  return { isLoading, data, error, refetch };
};

export default useDataQuery;
