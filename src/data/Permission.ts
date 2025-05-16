import prisma from "@/lib/prisma";

export async function getPermissionsByRoleId(roleId: string) {
  try {
    const rolePermissions = await prisma.rolePermission.findMany({
      where: { roleId },
      include: {
        Permission: {
          select: {
            key: true,
          },
        },
      },
    });

    return rolePermissions.map(
      (rolePermission) => rolePermission.Permission.key
    );
  } catch {
    return null;
  }
}
