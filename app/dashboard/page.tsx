// import { DashboardPage } from "./dashboard";
import { checkIsAuthenticated } from "@/lib/checkIsAuthenticated";
import { redirect } from "next/navigation";
// import AdminDashboard from "./admindashboard";
import UserDashboard from "./userdashboard";

const Dashboard: React.FC = async () => {
  const isAuthenticated = await checkIsAuthenticated();

  if (!isAuthenticated) {
    redirect("/auth/sign-in");
  } else {
    return <UserDashboard />;
      //  return <AdminDashboard />;
  }
};

export default Dashboard;