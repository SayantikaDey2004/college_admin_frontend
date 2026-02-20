import { useEffect, useMemo, useState } from "react";
import api from "../../config/axios.config";
import useDashboardContext from "../../context/dashboard/useDashboardContext";
import {
  MdOutlinePeople,
  MdOutlinePersonAddAlt,
  MdOutlinePerson2,
  MdOutlineVerifiedUser,
  MdOutlineEvent,
  MdOutlineEventAvailable,
  MdOutlineChat,
} from "react-icons/md";

type DepartmentCount = { department: string; count: number };

type DashboardStats = {
  totalStudents?: number;
  studentsByDepartment?: Record<string, number> | DepartmentCount[];
  activeAdmissionsCurrentYear?: number;

  totalFaculty?: number;
  facultyByRole?: Record<string, number>;
  activeAccounts?: number;
  inactiveAccounts?: number;

  eventsNext30Days?: number;
  ongoingEventsToday?: number;
  totalActiveNotices?: number;
};

type ApiErrorLike = {
  response?: { data?: { message?: string } };
};

function getErrorMessage(err: unknown): string {
  if (typeof err === "object" && err !== null) {
    const e = err as ApiErrorLike;
    const msg = e.response?.data?.message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  return "Failed to load dashboard stats. Please try again.";
}

function normalizeDepartmentBreakdown(
  input: DashboardStats["studentsByDepartment"],
): DepartmentCount[] {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  return Object.entries(input).map(([department, count]) => ({ department, count }));
}

// ─── Stat card ────────────────────────────────────────────────────────────────
type StatCardProps = {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  accent: string; // tailwind bg gradient classes
  sub?: React.ReactNode;
};

function StatCard({ label, value, icon, accent, sub }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </span>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${accent}`}
        >
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 leading-none">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-10 w-10 bg-gray-200 rounded-xl" />
      </div>
      <div className="h-8 w-16 bg-gray-200 rounded" />
    </div>
  );
}

// ─── Pie chart ────────────────────────────────────────────────────────────────
const PALETTE = [
  { stroke: "#2563eb", dot: "bg-blue-600" },   // blue-600
  { stroke: "#06b6d4", dot: "bg-cyan-500" },   // cyan-500
  { stroke: "#a855f7", dot: "bg-purple-500" }, // purple-500
  { stroke: "#10b981", dot: "bg-emerald-500" },// emerald-500
  { stroke: "#f59e0b", dot: "bg-amber-500" },  // amber-500
  { stroke: "#f43f5e", dot: "bg-rose-500" },   // rose-500
];

function DepartmentPieChart({ data }: { data: DepartmentCount[] }) {
  const segments = data
    .filter((d) => typeof d.department === "string" && d.department.trim())
    .map((d) => ({ ...d, count: Number.isFinite(d.count) ? d.count : 0 }))
    .sort((a, b) => b.count - a.count);

  const total = segments.reduce((s, d) => s + d.count, 0);

  if (!total) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-gray-400">
        No data available
      </div>
    );
  }

  const R = 15.915;
  let cumulative = 0;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start pt-2">
      {/* Donut chart */}
      <div className="relative shrink-0">
        <svg viewBox="0 0 42 42" className="w-48 h-48 -rotate-90">
          {/* track */}
          <circle cx="21" cy="21" r={R} fill="none" stroke="#e5e7eb" strokeWidth="7" />
          {segments.map((item, i) => {
            const pct = (item.count / total) * 100;
            const offset = 25 - cumulative;
            cumulative += pct;
            return (
              <circle
                key={item.department}
                cx="21" cy="21" r={R}
                fill="none"
                stroke={PALETTE[i % PALETTE.length].stroke}
                strokeWidth="7"
                strokeDasharray={`${pct} ${100 - pct}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        {/* Centre label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-gray-900">{total}</span>
          <span className="text-xs text-gray-400">students</span>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
        {segments.map((item, i) => {
          const color = PALETTE[i % PALETTE.length];
          const pct = ((item.count / total) * 100).toFixed(1);
          return (
            <div
              key={item.department}
              className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${color.dot}`} />
                <span className="text-sm text-gray-700 truncate">{item.department}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                <span className="text-xs text-gray-400">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function DashboardPage() {
  const { setPageName } = useDashboardContext();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const departmentBreakdown = useMemo(
    () => normalizeDepartmentBreakdown(stats?.studentsByDepartment),
    [stats?.studentsByDepartment],
  );

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
      } catch (err: unknown) {
        setError(getErrorMessage(err));
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-full w-full bg-gray-50 p-6 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          A quick look at your college's current status
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              label="Total Students"
              value={stats?.totalStudents ?? "—"}
              icon={<MdOutlinePeople size={20} />}
              accent="bg-gradient-to-br from-blue-600 to-cyan-500"
            />
            <StatCard
              label="New Admissions"
              value={stats?.activeAdmissionsCurrentYear ?? "—"}
              icon={<MdOutlinePersonAddAlt size={20} />}
              accent="bg-gradient-to-br from-cyan-500 to-teal-400"
              sub="Current academic year"
            />
            <StatCard
              label="Total Faculty"
              value={stats?.totalFaculty ?? "—"}
              icon={<MdOutlinePerson2 size={20} />}
              accent="bg-gradient-to-br from-purple-500 to-indigo-500"
            />
            <StatCard
              label="Active Accounts"
              value={stats?.activeAccounts ?? "—"}
              icon={<MdOutlineVerifiedUser size={20} />}
              accent="bg-gradient-to-br from-emerald-500 to-green-400"
              sub={
                stats?.inactiveAccounts != null
                  ? `${stats.inactiveAccounts} inactive`
                  : undefined
              }
            />
            <StatCard
              label="Events (Next 30 Days)"
              value={stats?.eventsNext30Days ?? "—"}
              icon={<MdOutlineEvent size={20} />}
              accent="bg-gradient-to-br from-amber-500 to-orange-400"
            />
            <StatCard
              label="Ongoing Events Today"
              value={stats?.ongoingEventsToday ?? "—"}
              icon={<MdOutlineEventAvailable size={20} />}
              accent="bg-gradient-to-br from-rose-500 to-pink-400"
            />
            <StatCard
              label="Active Notices"
              value={stats?.totalActiveNotices ?? "—"}
              icon={<MdOutlineChat size={20} />}
              accent="bg-gradient-to-br from-blue-500 to-blue-700"
            />
          </>
        )}
      </div>

      {/* Department pie chart */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Students by Department
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Enrollment distribution</p>
          </div>
          {/* accent bar */}
          <div className="h-1 w-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" />
        </div>

        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        ) : (
          <DepartmentPieChart data={departmentBreakdown} />
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
