// import { useQuery } from "@tanstack/react-query";
// import { useAxios } from "./useAxios";

// const useDataQuery = (key, url, enabled = true,) => {
//   const axiosUrl = useAxios();
//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: key,
//     queryFn: async () => {
//       const res = await axiosUrl.get(url);
//       return res.data;
//     },
//     enabled: enabled,
//   });
//   return { isLoading, data, error, refetch };
// };

// export default useDataQuery;
