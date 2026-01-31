import { createContext } from "react";
import type { INotification } from "../../@types/interface/notification.interface";

interface INotificationContext {
  notifications: INotification[];
  unreadCount: number;
  addNotification: (notification: INotification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAll: () => void;
}

const notificationContext = createContext<INotificationContext>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  removeNotification: () => {},
  clearAll: () => {},
});

export default notificationContext;
