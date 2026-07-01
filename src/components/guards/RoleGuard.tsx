"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Role, checkRole } from "@/lib/authorization";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: Role;
  fallback?: React.ReactNode;
}

export default function RoleGuard({ children, requiredRole, fallback }: RoleGuardProps) {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!user || !userRole || !checkRole(userRole, requiredRole)) {
    if (fallback !== undefined) {
      return <>{fallback}</>;
    }
    // Redirect unauthorized requests to the Access Denied route
    if (typeof window !== "undefined") {
      router.replace("/403");
    }
    return null;
  }

  return <>{children}</>;
}
