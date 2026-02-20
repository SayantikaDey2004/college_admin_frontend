import api from "../../config/axios.config";
import type { DashboardStats } from "../../@types/interface/dashboard.interface";
import { dashboardStatsSchema } from "../../validations/dashboard.validation";

export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/dashboard/stats");
    const payload = response.data?.result ?? response.data;

    const parsed = dashboardStatsSchema.safeParse(payload);
    if (parsed.success) return parsed.data as DashboardStats;

    // Backward compatibility: if backend shape differs, still return raw.
    return payload as DashboardStats;
  },
};
