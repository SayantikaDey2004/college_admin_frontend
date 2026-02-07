import { FiTrash2, FiCheck, FiClock, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router";
import type { INotification } from "../../@types/interface/notification.interface";
import { useNotificationContext } from "../../context/notification/useNotificationContext";

interface NotificationItemProps {
  notification: INotification;
  onClose?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClose,
}) => {
  const { markAsRead, removeNotification } = useNotificationContext();
  const navigate = useNavigate();

  const getNavigationUrl = (): string | null => {
    const { type, metadata } = notification;

    // Check if custom link exists in metadata (preferred)
    if (metadata?.link) {
      return metadata.link as string;
    }

    // Fallback: Navigate based on notification type and IDs
    switch (type) {
      case "notice":
        if (metadata?.noticeId) {
          return `/notices/${metadata.noticeId}`;
        }
        return "/notices/list";

      case "event":
        if (metadata?.eventId) {
          return `/events/${metadata.eventId}`;
        }
        return "/events/list";

      case "announcement":
        // Announcements might not have specific pages, stay on current
        return null;

      case "alert":
        // Alerts might not have specific pages, stay on current
        return null;

      default:
        return null;
    }
  };

  const handleClick = async () => {
    // Mark as read first
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate to appropriate page
    const url = getNavigationUrl();
    if (url) {
      // Close the notification panel before navigating
      onClose?.();
      navigate(url);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await removeNotification(notification.id);
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case "notice":
        return {
          color: "text-blue-600",
          bg: "bg-blue-50",
          iconBg: "bg-blue-100",
        };
      case "event":
        return {
          color: "text-purple-600",
          bg: "bg-purple-50",
          iconBg: "bg-purple-100",
        };
      case "announcement":
        return {
          color: "text-green-600",
          bg: "bg-green-50",
          iconBg: "bg-green-100",
        };
      case "alert":
        return { color: "text-red-600", bg: "bg-red-50", iconBg: "bg-red-100" };
      default:
        return {
          color: "text-gray-600",
          bg: "bg-gray-50",
          iconBg: "bg-gray-100",
        };
    }
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;

    const styles =
      {
        high: "bg-red-100 text-red-700 border-red-200",
        medium: "bg-orange-100 text-orange-700 border-orange-200",
        low: "bg-green-100 text-green-700 border-green-200",
      }[priority] || "bg-gray-100 text-gray-700 border-gray-200";

    return (
      <span
        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${styles} uppercase`}
      >
        {priority}
      </span>
    );
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Date(date).toLocaleDateString();
  };

  const typeConfig = getTypeConfig(notification.type);
  const hasNavigationUrl = Boolean(getNavigationUrl());

  return (
    <div
      onClick={handleClick}
      className={`group relative p-4 border-l-2 transition-all ${hasNavigationUrl ? "cursor-pointer" : "cursor-default"} ${
        notification.read
          ? "bg-white hover:bg-gray-50 border-transparent"
          : `${typeConfig.bg} hover:bg-opacity-80 ${typeConfig.color.replace("text-", "border-")}`
      }`}
    >
      <div className="flex gap-3">
        {/* Type Indicator */}
        <div
          className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${typeConfig.color.replace("text-", "bg-")}`}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h4
                className={`text-sm font-semibold line-clamp-1 ${notification.read ? "text-gray-700" : "text-gray-900"}`}
              >
                {notification.title}
              </h4>
              {hasNavigationUrl && (
                <FiChevronRight
                  size={14}
                  className="flex-shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors"
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              {getPriorityBadge(notification.priority)}
              {!notification.read && (
                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
              )}
            </div>
          </div>

          <p
            className={`text-sm line-clamp-2 mb-2 ${notification.read ? "text-gray-500" : "text-gray-600"}`}
          >
            {notification.message}
          </p>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <FiClock size={12} />
              {formatTime(notification.timestamp)}
            </span>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notification.read && (
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    await markAsRead(notification.id);
                  }}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Mark as read"
                >
                  <FiCheck size={14} />
                </button>
              )}
              <button
                onClick={handleDelete}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
