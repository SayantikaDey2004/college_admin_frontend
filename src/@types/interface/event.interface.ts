export interface IEvent {
  event_id?: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time?: string;
  venue: string;
  posted_by?: {
    first_name: string;
    last_name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
