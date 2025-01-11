"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignInPage } from "./signin";
import { checkIsAuthenticated } from "@/lib/checkIsAuthenticated";

const SignIn: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await checkIsAuthenticated();
      setIsAuthenticated(authStatus);
      if (authStatus) {
        router.push("/dashboard");
      }
    };
    checkAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return <SignInPage />;
};

export default SignIn;