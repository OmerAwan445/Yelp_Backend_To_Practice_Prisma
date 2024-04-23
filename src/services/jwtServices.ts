import jwt, { JwtPayload } from 'jsonwebtoken';
import { getEnv } from '@utils/getEnv';
import { JwtUser } from '@src/Types';

async function generateAccessToken(user:JwtUser):Promise<{ accessToken: string }> {
  return new Promise((resolve, reject) => {
    try {
      const { access_token_secret, access_token_expiry } = getEnv('JWT');
      const accessToken = jwt.sign({ user }, access_token_secret, { expiresIn: access_token_expiry });

      resolve({ accessToken });
    } catch (error:any) {
      console.log('Error in generating token:', error.message);
      reject(new Error('Error in generating token: ' + error.message ));
    }
  });
}

async function verifyToken(token:string) {
  try {
    const decodedToken = jwt.verify(token, getEnv('JWT')?.access_token_secret) as JwtPayload;

    if (!decodedToken || typeof decodedToken !== 'object' || !('user' in decodedToken)) {
      return { error: true, message: 'Token is invalid' };
    }

    return { error: false, message: 'Token is valid' };
  } catch (error:any) {
    console.log('Error in verifying token:', error.message);
    return { error: true, message: error.message ?? 'Error in verifying token' };
  }
}

export { generateAccessToken, verifyToken };
