import React, { useState, useEffect } from "react";
import { FiLock, FiBell, FiArrowLeft } from "react-icons/fi";
import useDashboardContext from "../../context/dashboard/useDashboardContext";
import { Link } from "react-router";
import SecuritySettings from "../../components/settings/SecuritySettings";
import AlertMessage from "../../components/settings/AlertMessage";

const SettingsPage: React.FC = () => {
  const { setPageName } = useDashboardContext();
  const [activeTab, setActiveTab] = useState<"security" | "notifications">(
    "security",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setPageName("Settings");
  }, [setPageName]);

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setErrorMessage("");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    setSuccessMessage("");
    setTimeout(() => setErrorMessage(""), 3000);
  };

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/profile"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Profile</span>
          </Link>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <AlertMessage
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage("")}
          />
        )}

        {errorMessage && (
          <AlertMessage
            type="error"
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        )}

        {/* Settings Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors duration-200 ${
                  activeTab === "security"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <FiLock size={18} />
                Security
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors duration-200 ${
                  activeTab === "notifications"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <FiBell size={18} />
                Notifications
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Security Settings */}
            {activeTab === "security" && (
              <SecuritySettings
                onSuccess={handleSuccess}
                onError={handleError}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}

            {/* Notification Settings */}
            {/* {activeTab === "notifications" && (
              <NotificationSettings
                onSuccess={handleSuccess}
                onError={handleError}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
