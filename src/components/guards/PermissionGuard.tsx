"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Permission, checkPermission } from "@/lib/authorization";
import { Loader2 } from "lucide-react";

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission: Permission;
  fallback?: React.ReactNode;
}

export default function PermissionGuard({ children, requiredPermission, fallback }: PermissionGuardProps) {
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

  if (!user || !userRole || !checkPermission(userRole, requiredPermission)) {
    if (fallback !== undefined) {
      return <>{fallback}</>;
    }
    // Redirect to Access Denied layout if user lacks permissions
    if (typeof window !== "undefined") {
      router.replace("/403");
    }
    return null;
  }

  return <>{children}</>;
}
