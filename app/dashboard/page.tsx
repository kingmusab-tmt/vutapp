
import { checkIsAuthenticated } from "@/lib/checkIsAuthenticated";
import { redirect } from "next/navigation";
import DashboardHome from "./userdashboard";

const Dashboard: React.FC = async () => {
  const isAuthenticated = await checkIsAuthenticated();

  if (!isAuthenticated) {
    redirect("/auth/sign-in");
  } else {
    return <DashboardHome />;
      //  return <AdminDashboard />;
  }
};

export default Dashboard;
