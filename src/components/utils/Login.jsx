import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] to-[#2c5364] flex items-center justify-center font-sans">
      <div className="bg-white/95 rounded-2xl shadow-2xl px-9 py-12 w-[370px] max-w-[90vw] flex flex-col items-center">
        <img src="/katsana-logo.png" alt="Location Tracking Logo" className="w-20 h-20 mb-4 rounded-xl shadow-md object-contain" />
        <h2 className="font-bold text-2xl text-[#2c5364] mb-2 tracking-wide">Location Tracking Login</h2>
        <p className="text-[#4b6584] mb-6 text-[15px]">Sign in to access your real-time tracking dashboard</p>
        <form className="w-full" onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-4">
            <label htmlFor="username" className="text-[#2c5364] font-medium text-[15px]">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 mt-1.5 text-[15px] outline-none bg-[#f7fafd] focus:border-[#2c5364]"
              autoFocus
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="text-[#2c5364] font-medium text-[15px]">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 mt-1.5 text-[15px] outline-none bg-[#f7fafd] focus:border-[#2c5364]"
              autoComplete="current-password"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-2 top-9 bg-transparent border-none p-0 m-0 cursor-pointer text-[#2c5364] text-lg"
              tabIndex={-1}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {error && (
            <div className="text-red-500 text-[13px] mb-2 text-center">{error}</div>
          )}
          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-[#2c5364] to-[#0f2027] text-white font-semibold text-[16px] border-none rounded-lg py-3 mt-1 shadow-md transition-opacity duration-200 ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="mt-7 text-[#8395a7] text-[13px] text-center">
          © {new Date().getFullYear()} Location Tracker. All rights reserved.
        </div>
      </div>
    </div>
  );
        </form>
        <div
          style={{
            marginTop: 28,
            color: "#8395a7",
            fontSize: 13,
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} Location Tracker. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
