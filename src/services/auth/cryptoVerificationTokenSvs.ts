import { getEnv } from "@src/utils/getEnv";
import { createCipheriv, createDecipheriv, createHash } from "crypto";

const algorithm = 'aes-256-cbc'; // Use AES 256-bit encryption
const secret_key = getEnv("VerificationTokenSecret").substring(0, 16);
const secret_iv = getEnv("VerificationTokenIVSecret").substring(0, 16);
const key = createHash('sha512').update(secret_key).digest('hex').substring(0, 32);
const encryptionIV = createHash('sha512').update(secret_iv).digest('hex').substring(0, 16);

function generateCryptoTokenAndEncryptData(data: Record<string, any>) {
  const serializedData = JSON.stringify(data);
  const cipher = createCipheriv(algorithm, key, encryptionIV);
  return Buffer.from(cipher.update(serializedData, 'utf8', 'hex') + cipher.final('hex'),
  ).toString('base64');
}

function extractDataFromCryptoToken(token: string): Record<string, any> | null {
  const buff = Buffer.from(token, 'base64');
  const decipher = createDecipheriv(algorithm, key, encryptionIV);
  try {
    const decryptedData = decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8');
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Error extracting data from token:', error);
    return null;
  }
}

export { extractDataFromCryptoToken, generateCryptoTokenAndEncryptData };

