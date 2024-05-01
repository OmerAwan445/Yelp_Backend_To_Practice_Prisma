import { tokenType } from '@prisma/client';
import { findUserToken } from '@src/models/UserModel';
import { getEnv } from './getEnv';

// function to check if Previous Token Updated Time is Less Than Token Resend Time
async function isTokenResendEligible(userId: number, tokenType: tokenType) {
  const existingToken = await findUserToken(userId, tokenType);
  if (!existingToken || !existingToken.updated_at) return false;

  // Calculate the time difference in milliseconds
  const currentTime = new Date();
  const tokenTime = existingToken.updated_at;
  const timeDifference = currentTime.getTime() - tokenTime.getTime();

  const RESEND_VERIFICATION_EMAIL_TIME = getEnv('RESEND_VERIFICATION_EMAIL_TIME');
  return timeDifference < RESEND_VERIFICATION_EMAIL_TIME * 1000;
}

function formatResendVerificationTime(timeInSeconds: number) {
  const timeUnit = timeInSeconds >= 3600 ? 'hours' : 'minutes';
  const timeValue = timeInSeconds >= 3600 ?
   timeInSeconds / 3600 : timeInSeconds / 60;
  return `${timeValue} ${timeUnit}`;
}


export { formatResendVerificationTime, isTokenResendEligible };

