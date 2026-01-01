import axios from "axios";

const axiosUrl = axios.create({
  baseURL: import.meta.env.VITE_APIURL,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});
export const useAxios = () => {
  return axiosUrl;
};
