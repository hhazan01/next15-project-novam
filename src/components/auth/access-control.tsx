"use client";
import React from "react";
import { useSecurity } from "@/hooks/use-security";
import NotAutorized from "@/components/utils/not-autorized";

interface AccessControlProps {
  permissions?: string[];
  children: React.ReactNode;
}

export function AccessControl({ permissions, children }: AccessControlProps) {
  const hasAccess = useSecurity(permissions);

  if (!hasAccess) return <NotAutorized />;

  return <>{children}</>;
}
