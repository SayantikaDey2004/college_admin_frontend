import { useState, useCallback, useEffect } from "react";
import notificationContext from "./notification.context";
import type { INotification } from "../../@types/interface/notification.interface";
import socketInstance from "../../config/socket.config";
import { useAuthContext } from "../auth/useAuthContext";

const MAX_NOTIFICATIONS = 50; // Limit stored notifications

const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const { isAuthenticated } = useAuthContext();

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Add new notification
  const addNotification = useCallback((notification: INotification) => {
    setNotifications((prev) => {
      const updated = [notification, ...prev];
      // Keep only the latest MAX_NOTIFICATIONS
      return updated.slice(0, MAX_NOTIFICATIONS);
    });
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Remove notification
  const removeNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Listen to socket events for notifications
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear notifications on logout
      setNotifications([]);
      return;
    }

    // Handle new notice notifications
    const handleNewNotice = (data: unknown) => {
      const noticeData = data as {
        id?: string;
        title?: string;
        message?: string;
        content?: string;
        createdAt?: string;
        priority?: "low" | "medium" | "high";
        link?: string;
      };

      const notification: INotification = {
        id: noticeData.id || `notice-${Date.now()}`,
        type: "notice",
        title: noticeData.title || "New Notice",
        message: noticeData.message || noticeData.content || "",
        timestamp: new Date(noticeData.createdAt || Date.now()),
        read: false,
        priority: noticeData.priority || "medium",
        metadata: {
          noticeId: noticeData.id,
          link: noticeData.link,
          ...noticeData,
        },
      };
      addNotification(notification);
      console.log("New notice notification:", notification);
    };

    // Handle new event notifications
    const handleNewEvent = (data: unknown) => {
      const eventData = data as {
        id?: string;
        title?: string;
        description?: string;
        createdAt?: string;
        priority?: "low" | "medium" | "high";
        eventDate?: string;
      };

      const notification: INotification = {
        id: eventData.id || `event-${Date.now()}`,
        type: "event",
        title: eventData.title || "New Event",
        message: eventData.description || "",
        timestamp: new Date(eventData.createdAt || Date.now()),
        read: false,
        priority: eventData.priority || "medium",
        metadata: {
          eventId: eventData.id,
          eventDate: eventData.eventDate,
          ...eventData,
        },
      };
      addNotification(notification);
      console.log("New event notification:", notification);
    };

    // Handle announcement notifications
    const handleNewAnnouncement = (data: unknown) => {
      const announcementData = data as {
        id?: string;
        title?: string;
        message?: string;
        createdAt?: string;
        priority?: "low" | "medium" | "high";
      };

      const notification: INotification = {
        id: announcementData.id || `announcement-${Date.now()}`,
        type: "announcement",
        title: announcementData.title || "New Announcement",
        message: announcementData.message || "",
        timestamp: new Date(announcementData.createdAt || Date.now()),
        read: false,
        priority: announcementData.priority || "high",
        metadata: announcementData,
      };
      addNotification(notification);
      console.log("New announcement notification:", notification);
    };

    // Register socket listeners
    socketInstance.on("notice:new", handleNewNotice);
    socketInstance.on("event:new", handleNewEvent);
    socketInstance.on("announcement:new", handleNewAnnouncement);

    // Cleanup listeners
    return () => {
      socketInstance.off("notice:new", handleNewNotice);
      socketInstance.off("event:new", handleNewEvent);
      socketInstance.off("announcement:new", handleNewAnnouncement);
    };
  }, [isAuthenticated, addNotification]);

  return (
    <notificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </notificationContext.Provider>
  );
};

export default NotificationProvider;
