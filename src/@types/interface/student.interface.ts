import type { IAddress } from "./address.interface";

export interface IStudent {
  student_id?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  registration_no?: string;
  roll_no?: number;
  dob: string;
  phone_number: string;
  email: string;
  guardian_name: string;
  guardian_phone_number: string;
  guardian_email?: string;
  current_address: IAddress;
  permanent_address: IAddress;
  department: string;
  year_of_admission: number;
  year_of_passing?: number;
  profile_picture_url?: string;
  passport_photo_url?: string;
  remark?: string;
}
