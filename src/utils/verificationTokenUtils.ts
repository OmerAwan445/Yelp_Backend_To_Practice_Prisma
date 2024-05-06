import { tokenType } from '@prisma/client';
import { findUserToken } from '@src/models/UserTokenModel';

// function to check if Previous Token Updated Time is Less Than Token Resend Time
async function isTokenResendEligible(userId: number, tokenType: tokenType, RESEND_TIME: number) {
  const existingToken = await findUserToken(userId, tokenType);
  if (!existingToken || !existingToken.updated_at) return true;

  // Calculate the time difference in milliseconds
  const currentTime = new Date();
  const tokenTime = existingToken.updated_at;
  const timeDifference = currentTime.getTime() - tokenTime.getTime();

  return timeDifference > (RESEND_TIME * 1000);
}

function formatTimeInWordsWithUnit(timeInSeconds: number) {
  const timeUnit = timeInSeconds >= 3600 ? `hour` : 'minute';
  const timeValue = timeInSeconds >= 3600 ?
   timeInSeconds / 3600 : timeInSeconds / 60;
  return `${timeValue} ${timeUnit+(timeValue > 1 ? 's' : '')}`;
}


export { formatTimeInWordsWithUnit, isTokenResendEligible };

