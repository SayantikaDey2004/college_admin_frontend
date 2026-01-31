export interface INotification {
  id: string;
  type: "notice" | "event" | "announcement" | "alert";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority?: "low" | "medium" | "high";
  metadata?: {
    noticeId?: string;
    eventId?: string;
    link?: string;
    [key: string]: unknown;
  };
}
