import React, { useEffect } from "react";
import { useAuthContext } from "../context/auth/useAuthContext";
import { useNavigate } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string;
}

function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  void role;
  const { isAuthenticated, isLoading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, return null (navigation will happen via useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render children
  return <>{children}</>;
}

export default ProtectedRoute;
