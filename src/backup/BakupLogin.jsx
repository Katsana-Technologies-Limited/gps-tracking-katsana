// import { useState } from "react";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";
// import { useAxios } from "../../hooks/useAxios";

// const BackupLogin = () => {
//   const axiosUrl = useAxios();
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       const payload = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(username)
//         ? { email: username, password }
//         : { mobile: username, password };
//       const res = await axiosUrl.post("/api/vts/auth/login", payload);
//       // console.log(res);
//       if (res.data && res.data.loginStatus) {
//         const vtsAuth = {
//           token: res.data.token,
//           id: res.data.id,
//           company: res.data.company,
//           email: res.data.email,
//         };
//         try {
//           window.localStorage.setItem("vts_auth", JSON.stringify(vtsAuth));
//         } catch (error) {
//           console.log(error);
//         }
//         toast.success("Login successful!");
//         navigate("/dashboard");
//       } else {
//         setError(res.data?.error || "Auth error");
//         toast.error(res.data?.error || "Auth error");
//       }
//     } catch (err) {
//       setError(err?.response?.data?.error || "Auth error");
//       toast.error(err?.response?.data?.error || "Auth error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-br from-[#0f2027] to-[#2c5364] flex items-center justify-center font-sans">
//       <div className="bg-white/95 rounded-2xl shadow-2xl px-8 py-4 max-w-md flex flex-col items-center lg:max-w-sm lg:px-7 lg:py-5 xl:max-w-md">
//         <img
//           src="/logo.png"
//           alt="Location Tracking Logo"
//           className="w-48 h-20 mb-2 object-contain lg:w-44 lg:h-18 xl:w-40 xl:h-16 2xl:w-40 2xl:h-16"
//         />
//         <h2 className="font-bold text-2xl text-[#2c5364] mb-1 tracking-wide lg:text-xl xl:text-xl 2xl:text-xl">
//           Location Tracking Login
//         </h2>
//         <p className="text-[#4b6584] mb-4 text-[15px] lg:text-sm lg:mb-3.5 xl:text-sm 2xl:text-sm">
//           Sign in to access your real-time tracking dashboard
//         </p>
//         <form className="w-full" onSubmit={handleSubmit} autoComplete="off">
//           <div className="mb-4 lg:mb-3.5 xl:mb-3.5 2xl:mb-3.5">
//             <label
//               htmlFor="username"
//               className="text-[#2c5364] font-medium text-[15px] lg:text-sm xl:text-sm 2xl:text-sm"
//             >
//               Email or Mobile
//             </label>
//             <input
//               id="username"
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="Enter your email or mobile"
//               className="w-full px-4 py-2.5 rounded-lg border border-gray-300 mt-1.5 text-[15px] outline-none bg-[#f7fafd] focus:border-[#2c5364] lg:py-2.5 lg:text-sm xl:py-2.5 2xl:py-2.5"
//               autoFocus
//             />
//           </div>
//           <div className="mb-4 relative lg:mb-3.5 xl:mb-3.5 2xl:mb-3.5">
//             <label
//               htmlFor="password"
//               className="text-[#2c5364] font-medium text-[15px] lg:text-sm xl:text-sm 2xl:text-sm"
//             >
//               Password
//             </label>
//             <input
//               id="password"
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 mt-1.5 text-[15px] outline-none bg-[#f7fafd] focus:border-[#2c5364] lg:py-2.5 lg:text-sm xl:py-2.5 2xl:py-2.5"
//               autoComplete="current-password"
//             />
//             <button
//               type="button"
//               aria-label={showPassword ? "Hide password" : "Show password"}
//               onClick={() => setShowPassword((v) => !v)}
//               className="absolute right-2 top-9 bg-transparent border-none p-0 m-0 cursor-pointer text-[#2c5364] text-lg lg:top-9 lg:text-base xl:top-9 2xl:top-9"
//               tabIndex={-1}
//             >
//               {showPassword ? "🙈" : "👁️"}
//             </button>
//           </div>
//           {error && (
//             <div className="text-red-500 text-[13px] mb-2 text-center lg:text-xs xl:text-xs 2xl:text-xs">
//               {error}
//             </div>
//           )}
//           <button
//             type="submit"
//             className={`w-full bg-primary-green cursor-pointer text-white font-semibold text-[16px] border-none rounded-lg py-3 mt-1 shadow-md transition-opacity duration-200 lg:text-sm lg:py-2.5 xl:text-sm 2xl:text-sm ${
//               loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
//             }`}
//             disabled={loading}
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </button>
//         </form>
//         <div className="mt-7 text-[#8395a7] text-[13px] text-center lg:mt-6 lg:text-xs xl:mt-6 2xl:mt-6">
//           © {new Date().getFullYear()} Location Tracker. All rights reserved.
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BackupLogin;
