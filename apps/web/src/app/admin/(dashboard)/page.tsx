import { DashboardView } from "@/features/dashboard/components/DashboardView";
import { getDashboardStats } from "@/features/dashboard/server/queries";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  return <DashboardView stats={stats} />;
}
