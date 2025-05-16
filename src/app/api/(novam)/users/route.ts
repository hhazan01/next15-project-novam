import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

function bigIntToString(data: object) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        roleId: true,
        isTwoFactorEnabled: true,
        Role: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const values = bigIntToString(users);

    return NextResponse.json(values, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error desconocido en el servidor";

    return NextResponse.json({ message: message }, { status: 500 });
  }
}
