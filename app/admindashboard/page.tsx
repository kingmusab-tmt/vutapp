// import { DashboardPage } from "./dashboard";
import { checkIsAuthenticated } from "@/lib/checkIsAuthenticated";
import { redirect } from "next/navigation";
// import AdminDashboard from "./admindashboard";
import AdminDashboard from "./admindashboard";

const Dashboard: React.FC = async () => {
  const isAuthenticated = await checkIsAuthenticated();

  if (!isAuthenticated) {
    redirect("/auth/sign-in");
  } else {
    return <AdminDashboard />;
      //  return <AdminDashboard />;
  }
};

export default Dashboard;