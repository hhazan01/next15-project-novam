import { fetcher } from "@/lib/fetcher";
import { Role } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export interface Roles extends Role {
  _count: { RolePermission: number };
}

export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => fetcher<Roles[]>("/api/roles"),
  });
};
