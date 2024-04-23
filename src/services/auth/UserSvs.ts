import { prisma } from "@src/db";
import { prismaExclude } from '../prismaExclude';

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

export { checkUserEmailUniquenes, createUser };
