import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {
    const roles = await prisma.role.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        _count: {
          select: { RolePermission: true },
        },
      },
    });

    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error desconocido en el servidor";
    return NextResponse.json({ message: message }, { status: 500 });
  }
}
