import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../../hooks/useAxios";
import FooterLogin from "./FooterLogin";

const Login = () => {
  const axiosUrl = useAxios();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { username: "", password: "", remember: false },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        email: data.username,
        mobile: data.username,
        password: data.password,
        remember: data.remember,
      };
      const res = await axiosUrl.post("/api/vts/auth/login", payload);
      if (res.data && res.data.loginStatus) {
        const { id, email, company } = res.data.vtsInfo || {};
        const vtsAuth = { id, email, company };
        try {
          window.localStorage.setItem("vts_auth", JSON.stringify(vtsAuth));
        } catch (error) {
          console.log(error);
        }
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(res.data?.error || "Auth error");
      }
    } catch (error) {
      const backendMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.response?.data?.msg;
      toast.error(
        backendMsg || error?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen lg:h-screen bg-[#f6f9fc] overflow-x-hidden overflow-y-auto lg:overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -right-6 -top-67 translate-x-10 w-219 h-145 rounded-full bg-orange-400/90 blur-xl"></div>
        <div className="absolute right-5 -top-77.5 w-201.5 h-146 rounded-full bg-white blur-xl"></div>
      </div>
      <div className="relative z-10 h-full max-w-[92%] mx-auto flex flex-col">
        <div className="flex flex-1 items-center 2xl:mt-10">
          <div className="flex w-full flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 flex justify-center">
              <img
                src="/login/login-hero.png"
                alt="Tracking visual"
                className="max-w-lg w-full object-contain"
              />
            </div>
            <div className="w-full lg:w-1/2 max-w-md">
              <img
                src="/katsana-logo.png"
                alt="Katsana"
                className="w-64 mb-6 mx-auto"
              />
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Email or mobile"
                    {...register("username", {
                      required: "Email or mobile is required",
                    })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring focus:ring-orange-400"
                  />
                  {errors.username && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.username.message}
                    </div>
                  )}
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring focus:ring-orange-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("remember")}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-orange-500" />
                      <span className="absolute left-1 top-0.5 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5" />
                    </label>
                    Keep me logged in
                  </div>
                  <button
                    disabled={loading}
                    className="w-full py-2.5 cursor-pointer rounded-xl text-white font-semibold bg-linear-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-400 transition disabled:opacity-60"
                  >
                    {loading ? "Signing in..." : "Login"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/login-guest")}
                    className="w-full py-2.5 rounded-xl font-semibold bg-white text-gray-700 border-2 border-orange-500 hover:bg-linear-to-r hover:from-orange-400 hover:to-orange-500 hover:text-white transition cursor-pointer"
                  >
                    Login as Guest
                  </button>
                  <div className="text-center text-sm text-gray-600">
                    Forget Password?
                    <a
                      href="/forgot-password"
                      className="ml-1 text-orange-500 font-medium hover:underline"
                    >
                      Reset
                    </a>
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    Don&apos;t have an account?
                    <a
                      href="/signup"
                      className="ml-1 text-orange-500 font-medium hover:underline"
                    >
                      Sign Up
                    </a>
                  </div>
                </div>
              </form>
              <div className="mt-3 flex justify-center gap-4">
                <div className="bg-white p-2 rounded-md">
                  <img src="/icons/google-play.svg" className="h-9" />
                </div>
                <div className="bg-white p-2 rounded-md">
                  <img src="/icons/app-store.svg" className="h-9" />
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-600 font-semibold">
                  Call for any assistance
                </p>
                <div className="flex justify-center items-center gap-2">
                  <img src="/icons/loginSupport.svg" className="h-7" />
                  <span className="text-gray-800 font-bold">09600000000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterLogin />
      </div>
    </div>
  );
};

export default Login;
