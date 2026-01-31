import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdEmail, MdLock } from "react-icons/md";
import api from "../../config/axios.config";
import { useAuthContext } from "../../context/auth/useAuthContext";
import { Link, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";

const LoginPage: React.FC = () => {
  const { onLogin, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);

  React.useEffect(() => {
    if (isAuthenticated) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/dashboard");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data.result;
      console.log("Login response:", response.data.result);
      onLogin({ token, user });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect UI if already logged in
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-500 text-white rounded-full flex items-center justify-center">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Already Logged In
          </h2>
          <p className="text-gray-600 mb-4">
            Redirecting to the dashboard in {countdown}s...
          </p>
          <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent mx-auto rounded-full mb-4"></div>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90 transition"
          >
            Go Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-sm w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center mx-auto mb-4">
            <MdLock className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-1">Sign in to continue your journey</p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
                <MdEmail className="text-gray-400 mr-2" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                  className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
                <MdLock className="text-gray-400 mr-2" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="h-5 w-5" />
                  ) : (
                    <AiOutlineEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="accent-blue-500 h-4 w-4" />
                Remember me
              </label>
              <Link
                to="#"
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 py-3 rounded-lg text-white font-semibold shadow-md hover:opacity-90 transition"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-gray-400 text-sm">Or continue with</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Google */}
          <button className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700">
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </button>

          {/* Footer */}
          <p className="text-gray-500 text-sm mt-6 text-center">
            Don't have an account?{" "}
            <span
              onClick={() => (window.location.href = "/signup")}
              className="text-blue-500 hover:underline font-medium cursor-pointer"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
