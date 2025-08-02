"use client";

import Spline3D from "@/components/spline3D";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function AuthFloating() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Login!");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Register!");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Spline3D />
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <form
          className="flex flex-col items-center gap-5 w-full max-w-sm"
          onSubmit={mode === "login" ? handleLogin : handleRegister}
          autoComplete="off"
          style={{ backdropFilter: "none" }}
        >
          <h2 className="text-2xl font-normal text-white/80 mb-1 tracking-wide">
            {mode === "login" ? "Login" : "Buat Akun"}
          </h2>
          {/* Username/email */}
          <input
            type="text"
            placeholder={mode === "login" ? "Username" : "Nama Lengkap"}
            className="w-full px-4 py-2 rounded-2xl bg-white/20 text-white/90 font-medium placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm transition"
            required
            style={{
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              border: "none",
            }}
          />
          {/* Email for register */}
          {mode === "register" && (
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-2xl bg-white/20 text-white/90 font-medium placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm transition"
              required
              style={{
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(5px)",
                border: "none",
              }}
            />
          )}
          {/* Password */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 rounded-2xl bg-white/20 text-white/90 font-medium placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm transition"
              required
              style={{
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(5px)",
                border: "none",
              }}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-3 text-white/70 hover:text-white"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {/* Confirm password for register */}
          {mode === "register" && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-5 py-2 rounded-2xl bg-white/20 text-white/90 font-medium placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm transition"
              required
              style={{
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(5px)",
                border: "none",
              }}
            />
          )}
          {/* Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-2xl font-semibold text-base"
            style={{
              background: "linear-gradient(90deg, #fff 0%, #818cf8 100%)", // putih ke indigo-400 (Tailwind: #818cf8)
              color: "#222",
              letterSpacing: 1,
              marginTop: 8,
              marginBottom: 4,
              boxShadow: "0 2px 18px 0 rgba(129,140,248, 0.21)", // indigo-400 shadow
            }}
          >
            {mode === "login" ? "SIGN IN" : "REGISTER"}
          </button>
          {/* Checkbox & forgot password */}
          {mode === "login" && (
            <div className="flex items-center justify-between w-full -mt-2">
              <label className="flex items-center gap-2 text-white/80 text-sm cursor-pointer">
                <input type="checkbox" className="accent-indigo-400" />
                Remember Me
              </label>
              <a
                href="#"
                className="text-white/70 hover:text-white text-sm font-medium transition"
              >
                Forgot Password
              </a>
            </div>
          )}
          {/* Switch login/register */}
          <div className="w-full flex flex-col items-center gap-1 mt-1">
            {mode === "login" ? (
              <span className="text-white/80 text-sm">
                Belum punya akun? {" "}
                <button
                  type="button"
                  className="text-white/80 underline font-medium ml-1 hover:text-indigo-400"
                  onClick={() => setMode("register")}
                >
                  Register
                </button>
              </span>
            ) : (
              <span className="text-white/80 text-sm">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  className="text-white/80 underline font-medium ml-1 hover:text-indigo-400"
                  onClick={() => setMode("login")}
                >
                  Login
                </button>
              </span>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
