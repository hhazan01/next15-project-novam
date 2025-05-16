export const hasPermission = (
  requiredPermissions: string[] = [],
  userPermissions?: string[]
) => {
  if (!userPermissions) return false;

  const hasAllAccess = userPermissions.some((perm) => perm === "all");
  if (hasAllAccess) return true;

  return requiredPermissions.some((perm) =>
    userPermissions.some((userPerm) => userPerm === perm)
  );
};
