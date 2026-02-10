import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdEmail, MdLock, MdCheckCircle } from "react-icons/md";
import api from "../../config/axios.config";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (pwd.length >= 12) strength += 1;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 1;
    return strength;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordStrength < 2) {
      setError("Please choose a stronger password");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/signup", { email, password });
      alert("Signup successful! Redirecting to login...");
      window.location.href = "/login";
    } catch (error: any) {
      console.error("Signup failed:", error);
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
            <MdLock className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600 text-lg">
            Start your journey with us today
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-2xl p-8 animate-slideUp">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm animate-shake">
              {error}
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSignup}>
            {/* Email */}
            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-300">
                <MdEmail className="text-gray-400 mr-3 text-xl" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password */}
            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-300">
                <MdLock className="text-gray-400 mr-3 text-xl" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Create a strong password"
                  className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-700 transition-colors duration-200"
                >
                  {showPassword ? <AiOutlineEyeInvisible className="h-6 w-6" /> : <AiOutlineEye className="h-6 w-6" />}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i < passwordStrength ? getPasswordStrengthColor() : "bg-gray-200"
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    Password strength: <span className="font-semibold">{getPasswordStrengthText()}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className={`flex items-center bg-gray-50 border rounded-xl px-4 py-3 focus-within:ring-2 transition-all duration-300 ${
                confirmPassword && password !== confirmPassword
                  ? "border-red-400 focus-within:ring-red-500 focus-within:border-red-500"
                  : confirmPassword && password === confirmPassword
                  ? "border-green-400 focus-within:ring-green-500 focus-within:border-green-500"
                  : "border-gray-300 focus-within:ring-purple-500 focus-within:border-purple-500"
              }`}>
                <MdLock className="text-gray-400 mr-3 text-xl" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
                />
                {confirmPassword && password === confirmPassword ? (
                  <MdCheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-700 transition-colors duration-200"
                  >
                    {showConfirmPassword ? <AiOutlineEyeInvisible className="h-6 w-6" /> : <AiOutlineEye className="h-6 w-6" />}
                  </button>
                )}
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <input type="checkbox" required className="accent-purple-600 h-4 w-4 mt-0.5 cursor-pointer" />
              <label className="cursor-pointer">
                I agree to the <span className="text-purple-600 hover:underline">Terms of Service</span> and{" "}
                <span className="text-purple-600 hover:underline">Privacy Policy</span>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading || (!!confirmPassword && password !== confirmPassword)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 py-3.5 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-700 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center justify-center gap-2">
                {isLoading && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isLoading ? "Creating account..." : "Create Account"}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          {/* Footer */}
          <p className="text-gray-600 text-sm text-center">
            <span
              onClick={() => (window.location.href = "/login")}
              className="text-purple-600 hover:text-purple-700 hover:underline font-semibold cursor-pointer transition-colors"
            >
              Sign in here
            </span>
          </p>
        </div>
        
        {/* Additional Info */}
        <p className="text-center text-gray-500 text-sm mt-6">
          By signing up, you're joining thousands of satisfied users
        </p>
      </div>
      
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideUp { animation: slideUp 0.6s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default SignupPage;
