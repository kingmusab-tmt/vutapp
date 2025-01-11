import { getUserRole } from "@/lib/getUserRoleServerAction";
import { redirect } from "next/navigation";
import { AdminPage } from "./admin";

const Admin: React.FC = async () => {
  const role = await getUserRole();

  if (role === "ADMIN") {
    return <AdminPage />;
  } else {
    redirect("/dashboard");
  }
};

export default Admin;