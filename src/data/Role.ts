import prisma from "@/lib/prisma";

export async function getRoleById(id: string) {
  try {
    const role = await prisma.role.findUnique({
      where: { id },
    });
    return role;
  } catch {
    return null;
  }
}

export async function getRoleByName(name: string) {
  try {
    const role = await prisma.role.findUnique({
      where: { name },
    });

    return role;
  } catch {
    return null;
  }
}
