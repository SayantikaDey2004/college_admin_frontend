import { createContext } from "react";
import type { INotification } from "../../@types/interface/notification.interface";

interface INotificationContext {
  notifications: INotification[];
  unreadCount: number;
  isLoading: boolean;
  addNotification: (notification: INotification) => void;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (notificationId: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const notificationContext = createContext<INotificationContext>({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  addNotification: () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  removeNotification: async () => {},
  clearAll: async () => {},
  refreshNotifications: async () => {},
});

export default notificationContext;
