import { fetcher } from "@/lib/fetcher";
import { Role, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export interface Users extends User {
  Role: Role | null;
}

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => fetcher<Users[]>("/api/users"),
  });
};
