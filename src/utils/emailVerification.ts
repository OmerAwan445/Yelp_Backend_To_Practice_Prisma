import { tokenType } from '@prisma/client';
import { saveTokenToDbIfExistUpdate } from '@src/models/UserModel';
import { sendVerificationEmail } from '@src/services/auth/emailVerificationSvs';
import { randomBytes } from 'crypto';

function generateRandomToken(length: number): string {
  const token = randomBytes(length).toString('hex');
  return token;
}

// Function to send verification email and save token to the database
const sendVerificationEmailAndSaveToken = async (email: string, tokenType: tokenType, userId: number) => {
  const token = generateRandomToken(30);
  const msg = await sendVerificationEmail(email, token);
  await saveTokenToDbIfExistUpdate(token, userId, tokenType);
  return { msg };
};


export { generateRandomToken, sendVerificationEmailAndSaveToken };
