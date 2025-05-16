"use client";
import React from "react";

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions?: string[];
  permissionKeys: string[];
}

export default function PermissionGuard({
  children,
  permissions,
  permissionKeys,
}: PermissionGuardProps) {
  const access =
    permissions?.some(
      (perm) => perm === "all" || permissionKeys.includes(perm)
    ) || false;

  if (!access) {
    return null;
  }

  return <>{children}</>;
}
