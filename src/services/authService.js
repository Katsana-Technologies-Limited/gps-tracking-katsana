import { useAxios } from "../hooks/useAxios";

export const useVtsAuthService = () => {
  const axiosUrl = useAxios();
  const login = async (data) => {
    const res = await axiosUrl.post("/api/vts/auth/login", data);
    return res.data;
  };

  return { login };
};

export const useCheckVtsAuth = () => {
  const axiosUrl = useAxios();
  const checkVtsAuth = async () => {
    try {
      const res = await axiosUrl.get("/api/vts/verify-auth", {
        withCredentials: true,
      });
      return res.status === 200;
    } catch {
      return false;
    }
  };
  return { checkVtsAuth };
};
