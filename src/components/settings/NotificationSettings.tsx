import React, { useState, useCallback, memo } from "react";
import { FiSave } from "react-icons/fi";
import api from "../../config/axios.config";

interface NotificationSettingsProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

interface ToggleSwitchProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = memo(
  ({ title, description, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  ),
);

ToggleSwitch.displayName = "ToggleSwitch";

interface NotificationState {
  email: boolean;
  notice: boolean;
  event: boolean;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  onSuccess,
  onError,
  isLoading,
  setIsLoading,
}) => {
  const [notifications, setNotifications] = useState<NotificationState>({
    email: true,
    notice: true,
    event: true,
  });

  const handleToggle = useCallback((key: keyof NotificationState) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleNotificationUpdate = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await api.put("/auth/update-notifications", {
        email_notifications: notifications.email,
        notice_notifications: notifications.notice,
        event_notifications: notifications.event,
      });

      if (response.status === 200) {
        onSuccess("Notification preferences updated successfully!");
      }
    } catch {
      onError("Failed to update notification preferences.");
    } finally {
      setIsLoading(false);
    }
  }, [notifications, onSuccess, onError, setIsLoading]);

  const notificationItems = [
    {
      key: "email" as keyof NotificationState,
      title: "Email Notifications",
      description: "Receive email updates about important activities",
    },
    {
      key: "notice" as keyof NotificationState,
      title: "Notice Notifications",
      description: "Get notified when new notices are posted",
    },
    {
      key: "event" as keyof NotificationState,
      title: "Event Notifications",
      description: "Receive updates about upcoming events",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Notification Preferences
      </h2>
      <p className="text-gray-600 mb-6">
        Choose what notifications you want to receive.
      </p>

      <div className="space-y-6">
        {notificationItems.map(({ key, title, description }) => (
          <ToggleSwitch
            key={key}
            title={title}
            description={description}
            checked={notifications[key]}
            onChange={() => handleToggle(key)}
          />
        ))}

        <div className="pt-4">
          <button
            onClick={handleNotificationUpdate}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium shadow-md"
          >
            <FiSave size={18} />
            {isLoading ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(NotificationSettings);
