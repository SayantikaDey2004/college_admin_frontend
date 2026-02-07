import { useState, useCallback, useEffect } from "react";
import notificationContext from "./notification.context";
import type { INotification } from "../../@types/interface/notification.interface";
import socketInstance from "../../config/socket.config";
import { useAuthContext } from "../auth/useAuthContext";
import { notificationAPI } from "../../utils/api/notification.api";

const MAX_NOTIFICATIONS = 50; // Limit stored notifications

const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuthContext();

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const {
        notifications: fetchedNotifications,
        unreadCount: fetchedUnreadCount,
      } = await notificationAPI.getAllNotifications({
        page: 1,
        limit: MAX_NOTIFICATIONS,
      });

      setNotifications(fetchedNotifications);
      setUnreadCount(fetchedUnreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Load notifications on mount/auth change
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, fetchNotifications]);

  // Add new notification
  const addNotification = useCallback((notification: INotification) => {
    setNotifications((prev) => {
      const updated = [notification, ...prev];
      // Keep only the latest MAX_NOTIFICATIONS
      return updated.slice(0, MAX_NOTIFICATIONS);
    });
    setUnreadCount((prev) => prev + 1);
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      // Optimistically update UI
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // Call backend API
      await notificationAPI.markAsRead(notificationId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Revert optimistic update on error
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: false } : n)),
      );
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      // Optimistically update UI
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      const previousUnreadCount = unreadCount;
      setUnreadCount(0);

      // Call backend API
      await notificationAPI.markAllAsRead();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // Refresh from backend on error
      fetchNotifications();
    }
  }, [unreadCount, fetchNotifications]);

  // Remove notification
  const removeNotification = useCallback(
    async (notificationId: string) => {
      try {
        const notificationToRemove = notifications.find(
          (n) => n.id === notificationId,
        );

        // Optimistically update UI
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        if (notificationToRemove && !notificationToRemove.read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }

        // Call backend API
        await notificationAPI.deleteNotification(notificationId);
      } catch (error) {
        console.error("Error deleting notification:", error);
        // Refresh from backend on error
        fetchNotifications();
      }
    },
    [notifications, fetchNotifications],
  );

  // Clear all notifications
  const clearAll = useCallback(async () => {
    try {
      // For clearing all, we need to delete each notification
      const deletePromises = notifications.map((n) =>
        notificationAPI.deleteNotification(n.id),
      );

      // Optimistically update UI
      setNotifications([]);
      setUnreadCount(0);

      // Call backend API
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error clearing all notifications:", error);
      // Refresh from backend on error
      fetchNotifications();
    }
  }, [notifications, fetchNotifications]);

  // Listen to socket events for notifications
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear notifications on logout
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    // Handle new notice notifications
    const handleNewNotice = (data: unknown) => {
      const noticeData = data as {
        _id?: string;
        id?: string;
        title?: string;
        message?: string;
        content?: string;
        createdAt?: string;
        priority?: "low" | "medium" | "high";
        link?: string;
      };

      const notification: INotification = {
        id: noticeData._id || noticeData.id || `notice-${Date.now()}`,
        type: "notice",
        title: noticeData.title || "New Notice",
        message: noticeData.message || noticeData.content || "",
        timestamp: new Date(noticeData.createdAt || Date.now()),
        read: false,
        priority: noticeData.priority || "medium",
        metadata: {
          noticeId: noticeData._id || noticeData.id,
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
        _id?: string;
        id?: string;
        title?: string;
        description?: string;
        createdAt?: string;
        priority?: "low" | "medium" | "high";
        eventDate?: string;
      };

      const notification: INotification = {
        id: eventData._id || eventData.id || `event-${Date.now()}`,
        type: "event",
        title: eventData.title || "New Event",
        message: eventData.description || "",
        timestamp: new Date(eventData.createdAt || Date.now()),
        read: false,
        priority: eventData.priority || "medium",
        metadata: {
          eventId: eventData._id || eventData.id,
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
        _id?: string;
        id?: string;
        title?: string;
        message?: string;
        createdAt?: string;
        priority?: "low" | "medium" | "high";
      };

      const notification: INotification = {
        id:
          announcementData._id ||
          announcementData.id ||
          `announcement-${Date.now()}`,
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
        isLoading,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
    </notificationContext.Provider>
  );
};

export default NotificationProvider;
