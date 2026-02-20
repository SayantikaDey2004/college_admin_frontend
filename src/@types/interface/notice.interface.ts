export interface INotice {
  notice_id?: string;
  title: string;
  description: string;
  year: number;
  posted_by?: {
    first_name: string;
    last_name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
