export type DepartmentCount = {
  department: string;
  count: number;
};

export type RecentNotice = {
  _id?: string;
  id?: string;
  title?: string;
  createdAt?: string;
};

export type DashboardStats = {
  totalStudents?: number;
  studentsByDepartment?: Record<string, number> | DepartmentCount[];
  activeAdmissionsCurrentYear?: number;

  totalFaculty?: number;
  facultyByRole?: Record<string, number>;
  activeAccounts?: number;
  inactiveAccounts?: number;

  pendingInquiries?: number;

  eventsNext30Days?: number;
  ongoingEventsToday?: number;

  recentNotices?: RecentNotice[];
  totalActiveNotices?: number;

  unreadNotifications?: number;
  highPriorityAlerts?: number;
};
