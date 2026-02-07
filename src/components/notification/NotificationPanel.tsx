import { useState } from "react";
import { FiX, FiCheck, FiTrash2, FiRefreshCw } from "react-icons/fi";
import { useNotificationContext } from "../../context/notification/useNotificationContext";
import NotificationItem from "./NotificationItem";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAllAsRead,
    clearAll,
    refreshNotifications,
  } = useNotificationContext();
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  if (!isOpen) return null;

  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  return (
    <div className="absolute right-0 top-full mt-2 w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900">
            Notifications
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => refreshNotifications()}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              disabled={isLoading}
              title="Refresh notifications"
            >
              <FiRefreshCw
                size={18}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === "all"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All {notifications.length > 0 && `(${notifications.length})`}
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === "unread"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="px-4 py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FiRefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            Loading notifications...
          </p>
        </div>
      ) : filteredNotifications.length > 0 ? (
        <>
          <div className="max-h-[400px] overflow-y-auto">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClose={onClose}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiCheck size={16} />
                Mark all read
              </button>
            )}
            <button
              onClick={() => {
                if (window.confirm("Clear all notifications?")) {
                  clearAll();
                  onClose();
                }
              }}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiTrash2 size={16} />
              Clear all
            </button>
          </div>
        </>
      ) : (
        <div className="px-4 py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            {activeTab === "unread"
              ? "No unread notifications"
              : "No notifications"}
          </p>
          <p className="text-xs text-gray-500">
            {activeTab === "unread"
              ? "You're all caught up!"
              : "Notifications will appear here"}
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
