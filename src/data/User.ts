"use server";
import prisma from "@/lib/prisma";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  } catch {
    return null;
  }
};

export const getUserByName = async (name: string) => {
  try {
    const user = await prisma.user.findMany({
      where: {
        name: {
          startsWith: name,
        },
      },
    });
    return user;
  } catch {
    return null;
  }
};
