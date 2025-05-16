"use client";
import { usePathname } from "next/navigation";
import { permissionsByPath } from "@/routes";

export function useSecurity(permissions?: string[]) {
  const pathname = usePathname();

  if (pathname === "/gurti" || pathname === "/profile") return true;

  const exactPermissions = permissionsByPath[pathname];

  const basePath = "/" + pathname.split("/")[2];
  const fallbackPermissions = permissionsByPath[basePath];

  const requiredPermissions = exactPermissions || fallbackPermissions || [];

  const hasAccess =
    permissions?.includes("all") ||
    requiredPermissions.some((required) => permissions?.includes(required));

  return hasAccess;
}
