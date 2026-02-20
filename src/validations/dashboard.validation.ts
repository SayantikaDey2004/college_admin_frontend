import z from "zod";

const departmentCountSchema = z.object({
  department: z.string(),
  count: z.number(),
});

const recentNoticeSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  title: z.string().optional(),
  createdAt: z.string().optional(),
});

export const dashboardStatsSchema = z.object({
  totalStudents: z.number().optional(),
  studentsByDepartment: z
    .union([z.record(z.string(), z.number()), z.array(departmentCountSchema)])
    .optional(),
  activeAdmissionsCurrentYear: z.number().optional(),

  totalFaculty: z.number().optional(),
  facultyByRole: z.record(z.string(), z.number()).optional(),
  activeAccounts: z.number().optional(),
  inactiveAccounts: z.number().optional(),

  pendingInquiries: z.number().optional(),

  eventsNext30Days: z.number().optional(),
  ongoingEventsToday: z.number().optional(),

  recentNotices: z.array(recentNoticeSchema).optional(),
  totalActiveNotices: z.number().optional(),

  unreadNotifications: z.number().optional(),
  highPriorityAlerts: z.number().optional(),
});
