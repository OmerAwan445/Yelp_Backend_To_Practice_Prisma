import { prisma } from "@src/db";
import { prismaExclude } from '../utils/prismaExclude';
import { tokenType } from "@prisma/client";
import { getEnv } from "@src/utils/getEnv";

async function checkUserEmailUniquenes(email: string) {
  const isEmailUnique = await prisma.user.findUnique({ where: {
    email,
  } });
  return isEmailUnique == null;
}

async function createUser(first_name: string, last_name: string, email: string, hashedPassword: string) {
  return await prisma.user.create({
    data: { first_name, last_name, email, password: hashedPassword },
    select: prismaExclude('User', ['password'] ),
  });
}

async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

async function saveTokenToDbIfExistUpdate(token: string, userId: number, tokenType: tokenType) {
  let expiryTime: Date;
  switch (tokenType) {
    case 'EMAIL_VERIFICATION':
      expiryTime = new Date(Date.now() + Number(getEnv('tokenExpiry.EMAIL_VERIFICATION')) * 1000);
      break;
    case 'PASSWORD_RESET':
      expiryTime = new Date(Date.now() + Number(getEnv('tokenExpiry.PASSWORD_RESET')) * 1000);
      break;
  }
  return await prisma.userToken.upsert({
    create: {
      token,
      userId,
      tokenType,
      expiry: expiryTime,
    },
    update: {
      token,
      userId,
      tokenType,
      expiry: expiryTime,
    },
    where: {
      userId_tokenType: {
        userId,
        tokenType,
      },
    },
  });
}

export { checkUserEmailUniquenes, createUser, findUserByEmail, saveTokenToDbIfExistUpdate };
