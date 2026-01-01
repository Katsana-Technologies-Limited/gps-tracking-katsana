import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Unique design for Location Tracking Dashboard Login
const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password) {
      toast.error("Please enter username and password.");
      return;
    }
    setLoading(true);
    try {
      // TODO: Replace with actual login logic for tracking dashboard
      if (username === "tracker" && password === "track123") {
        toast.success("Welcome to Location Tracking Dashboard!");
        navigate("/dashboard");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f2027 0%, #2c5364 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: 18,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          padding: "48px 36px 36px 36px",
          width: 370,
          maxWidth: "90vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src="/location-tracking-logo.png"
          alt="Location Tracking Logo"
          style={{
            width: 90,
            height: 90,
            marginBottom: 18,
            borderRadius: 12,
            boxShadow: "0 2px 8px #2c5364",
          }}
        />
        <h2
          style={{
            fontWeight: 700,
            color: "#2c5364",
            marginBottom: 8,
            letterSpacing: 1,
          }}
        >
          Location Tracking Login
        </h2>
        <p style={{ color: "#4b6584", marginBottom: 24, fontSize: 15 }}>
          Sign in to access your real-time tracking dashboard
        </p>
        <form
          style={{ width: "100%" }}
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div style={{ marginBottom: 18 }}>
            <label
              htmlFor="username"
              style={{ color: "#2c5364", fontWeight: 500, fontSize: 15 }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #b2bec3",
                marginTop: 6,
                fontSize: 15,
                outline: "none",
                background: "#f7fafd",
              }}
              autoFocus
            />
          </div>
          <div style={{ marginBottom: 18, position: "relative" }}>
            <label
              htmlFor="password"
              style={{ color: "#2c5364", fontWeight: 500, fontSize: 15 }}
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: "10px 38px 10px 14px",
                borderRadius: 8,
                border: "1px solid #b2bec3",
                marginTop: 6,
                fontSize: 15,
                outline: "none",
                background: "#f7fafd",
              }}
              autoComplete="current-password"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: "absolute",
                right: 10,
                top: 36,
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
                cursor: "pointer",
                color: "#2c5364",
                fontSize: 18,
              }}
              tabIndex={-1}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {error && (
            <div
              style={{
                color: "#e74c3c",
                fontSize: 13,
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              background: "linear-gradient(90deg, #2c5364 0%, #0f2027 100%)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              border: "none",
              borderRadius: 8,
              padding: "12px 0",
              marginTop: 6,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 2px 8px #2c5364",
            }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
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
