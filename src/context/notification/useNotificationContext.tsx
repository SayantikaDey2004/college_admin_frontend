import { useContext } from "react";
import notificationContext from "./notification.context";

export const useNotificationContext = () => {
  const context = useContext(notificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within NotificationProvider",
    );
  }
  return context;
};
