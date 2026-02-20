import type {
  DashboardStats,
  DepartmentCount,
} from "../../@types/interface/dashboard.interface";

export function normalizeDepartmentBreakdown(
  input: DashboardStats["studentsByDepartment"],
): DepartmentCount[] {
  if (!input) return [];
  if (Array.isArray(input)) return input;

  return Object.entries(input).map(([department, count]) => ({
    department,
    count,
  }));
}
