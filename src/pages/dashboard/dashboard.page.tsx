import { useEffect, useMemo, useState } from "react";
import api from "../../config/axios.config";
import useDashboardContext from "../../context/dashboard/useDashboardContext";
import { useNotificationContext } from "../../context/notification/useNotificationContext";

type DepartmentCount = { department: string; count: number };

type RecentNotice = {
  _id?: string;
  id?: string;
  title?: string;
  createdAt?: string;
};

type DashboardStats = {
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

function normalizeDepartmentBreakdown(
  input: DashboardStats["studentsByDepartment"],
): DepartmentCount[] {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  return Object.entries(input).map(([department, count]) => ({
    department,
    count,
  }));
}

function DashboardPage() {
  const { setPageName } = useDashboardContext();
  const { unreadCount, notifications } = useNotificationContext();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const highPriorityAlertsFromNotifications = useMemo(() => {
    return notifications.filter((n) => n.priority === "high" && !n.read).length;
  }, [notifications]);

  const departmentBreakdown = useMemo(() => {
    return normalizeDepartmentBreakdown(stats?.studentsByDepartment);
  }, [stats?.studentsByDepartment]);

  useEffect(() => {
    setPageName("Dashboard");
  }, [setPageName]);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await api.get("/dashboard/stats");
        const result = response.data?.result ?? response.data;
        setStats(result as DashboardStats);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load dashboard stats. Please try again.",
        );
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex w-full p-6 flex-col gap-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="p-4 bg-white border border-gray-200 rounded-xl text-sm text-gray-700">
          Loading dashboard...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-600">Total Students</div>
            <div className="text-2xl font-semibold text-gray-900">
              {stats?.totalStudents ?? "—"}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-600">Active Admissions (Current Year)</div>
            <div className="text-2xl font-semibold text-gray-900">
              {stats?.activeAdmissionsCurrentYear ?? "—"}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-600">Total Faculty</div>
            <div className="text-2xl font-semibold text-gray-900">
              {stats?.totalFaculty ?? "—"}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-600">Accounts (Active vs Inactive)</div>
            <div className="text-sm text-gray-900 mt-2">
              Active: <span className="font-semibold">{stats?.activeAccounts ?? "—"}</span>
            </div>
            <div className="text-sm text-gray-900">
              Inactive: <span className="font-semibold">{stats?.inactiveAccounts ?? "—"}</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-600">Pending Inquiries</div>
            <div className="text-2xl font-semibold text-gray-900">
              {stats?.pendingInquiries ?? "—"}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-600">Events Scheduled (Next 30 Days)</div>
            <div className="text-2xl font-semibold text-gray-900">
              {stats?.eventsNext30Days ?? "—"}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-600">Ongoing Events (Today)</div>
            <div className="text-2xl font-semibold text-gray-900">
              {stats?.ongoingEventsToday ?? "—"}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-600">Total Active Notices</div>
            <div className="text-2xl font-semibold text-gray-900">
              {stats?.totalActiveNotices ?? "—"}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-600">Unread Notifications</div>
            <div className="text-2xl font-semibold text-gray-900">
              {stats?.unreadNotifications ?? unreadCount}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-600">High Priority Alerts</div>
            <div className="text-2xl font-semibold text-gray-900">
              {stats?.highPriorityAlerts ?? highPriorityAlertsFromNotifications}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 md:col-span-2 xl:col-span-3">
            <div className="text-sm text-gray-600 mb-2">Student Breakdown by Department</div>
            {departmentBreakdown.length === 0 ? (
              <div className="text-sm text-gray-700">—</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                {departmentBreakdown.map((item) => (
                  <div
                    key={item.department}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <div className="text-sm text-gray-800">{item.department}</div>
                    <div className="text-sm font-semibold text-gray-900">{item.count}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 md:col-span-2 xl:col-span-3">
            <div className="text-sm text-gray-600 mb-2">Faculty Count by Role</div>
            {!stats?.facultyByRole ? (
              <div className="text-sm text-gray-700">—</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(stats.facultyByRole).map(([role, count]) => (
                  <div
                    key={role}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <div className="text-xs text-gray-600">{role}</div>
                    <div className="text-sm font-semibold text-gray-900">{count}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 md:col-span-2 xl:col-span-3">
            <div className="text-sm text-gray-600 mb-2">Recent Notices</div>
            {!stats?.recentNotices || stats.recentNotices.length === 0 ? (
              <div className="text-sm text-gray-700">—</div>
            ) : (
              <div className="space-y-2">
                {stats.recentNotices.map((notice) => (
                  <div
                    key={notice._id || notice.id || notice.title}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <div className="text-sm text-gray-900">
                      {notice.title || "(Untitled notice)"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
