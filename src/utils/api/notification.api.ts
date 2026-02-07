import api from "../../config/axios.config";
import type { INotification } from "../../@types/interface/notification.interface";

interface GetNotificationsParams {
  query?: string;
  page?: number;
  limit?: number;
  type?: "notice" | "event" | "announcement" | "alert";
  priority?: "low" | "medium" | "high";
  unreadOnly?: boolean;
}

interface NotificationsResponse {
  success: boolean;
  message: string;
  result: {
    data: Array<{
      _id: string;
      type: string;
      title: string;
      message: string;
      timestamp: string;
      read: boolean;
      priority?: string;
      metadata?: Record<string, unknown>;
      createdAt: string;
      updatedAt: string;
      readAt?: string | null;
    }>;
    totalCount: number;
    unreadCount: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export const notificationAPI = {
  // Get all notifications
  getAllNotifications: async (
    params?: GetNotificationsParams,
  ): Promise<{
    notifications: INotification[];
    totalCount: number;
    unreadCount: number;
  }> => {
    const queryParams = new URLSearchParams();

    if (params?.query) queryParams.append("query", params.query);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.type) queryParams.append("type", params.type);
    if (params?.priority) queryParams.append("priority", params.priority);
    if (params?.unreadOnly) queryParams.append("unreadOnly", "true");

    const response = await api.get<NotificationsResponse>(
      `/notifications?${queryParams.toString()}`,
    );

    // Transform backend response to frontend interface
    const notifications: INotification[] = response.data.result.data.map(
      (item) => ({
        id: item._id,
        type: item.type as INotification["type"],
        title: item.title,
        message: item.message,
        timestamp: new Date(item.timestamp),
        read: item.read,
        priority: item.priority as INotification["priority"],
        metadata: item.metadata,
      }),
    );

    return {
      notifications,
      totalCount: response.data.result.totalCount,
      unreadCount: response.data.result.unreadCount,
    };
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<void> => {
    await api.patch(`/notifications/${notificationId}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    await api.patch("/notifications/read-all");
  },

  // Delete notification
  deleteNotification: async (notificationId: string): Promise<void> => {
    await api.delete(`/notifications/${notificationId}`);
  },

  // Get single notification
  getSingleNotification: async (
    notificationId: string,
  ): Promise<INotification> => {
    const response = await api.get<{
      success: boolean;
      message: string;
      result: {
        _id: string;
        type: string;
        title: string;
        message: string;
        timestamp: string;
        read: boolean;
        priority?: string;
        metadata?: Record<string, unknown>;
      };
    }>(`/notifications/${notificationId}`);

    const item = response.data.result;
    return {
      id: item._id,
      type: item.type as INotification["type"],
      title: item.title,
      message: item.message,
      timestamp: new Date(item.timestamp),
      read: item.read,
      priority: item.priority as INotification["priority"],
      metadata: item.metadata,
    };
  },
};
