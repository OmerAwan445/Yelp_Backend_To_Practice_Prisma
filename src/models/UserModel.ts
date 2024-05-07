import { prisma } from "@src/db";
import { prismaExclude } from "../utils/prismaExclude";

async function createUser(
    first_name: string,
    last_name: string,
    email: string,
    hashedPassword: string,
) {
  return await prisma.user.create({
    data: { first_name, last_name, email, password: hashedPassword },
    select: prismaExclude("User", ["password"]),
  });
}

async function makeUserVerifiedAndDeleteToken(userId: number) {
  return await prisma.$transaction(async (tx) => {
    await tx.userToken.delete({
      where: {
        userId_tokenType: {
          userId, tokenType: "EMAIL_VERIFICATION",
        },
      },
    });
    return await tx.user.update({
      where: { id: userId },
      data: { is_verified: true },
      select: prismaExclude("User", ["password"]),
    });
  });
}

async function updatePasswordAndDeleteToken(userId: number, password: string) {
  return await prisma.$transaction(async (tx)=> {
    await tx.userToken.delete({
      where: {
        userId_tokenType: {
          userId,
          tokenType: "PASSWORD_RESET",
        },
      },
    });
    return await tx.user.update({
      data: { password },
      where: { id: userId },
      select: { email: true },
    });
  });
}

async function checkUserEmailUniquenes(email: string) {
  const isEmailUnique = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return isEmailUnique == null;
}

async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

async function findUserById(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}

export {
  checkUserEmailUniquenes,
  createUser,
  makeUserVerifiedAndDeleteToken,
  updatePasswordAndDeleteToken,
  findUserByEmail,
  findUserById,
};

