"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // If it's the login page, bypass layout authentication check
    if (pathname === "/admin/login") {
      setIsLoading(false);
      return;
    }

    // Check if user has admin token
    const token = Cookies.get("pbvm_token");
    
    if (!token) {
      router.push("/admin/login");
      return;
    }

    // Verify token is valid (basic check)
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      if (decoded.role === "Administrator" || decoded.role === "SuperAdministrator") {
        setIsAuthenticated(true);
      } else {
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Invalid token:", error);
      router.push("/admin/login");
    } finally {
      setIsLoading(false);
    }
  }, [router, pathname]);

  // If loading, show loading screen (except for login page)
  if (isLoading && pathname !== "/admin/login") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If visiting the login page, render children directly without AdminLayout sidebar/wrapper
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
