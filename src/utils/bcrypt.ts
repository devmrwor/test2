import bcrypt from "bcrypt";
import crypto from "crypto";

export class Bcrypt {
  static async hash(password: string, saltRounds: number): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, (err: unknown, hash: string) => {
        if (err) {
          return reject(err);
        }
        resolve(hash);
      });
    });
  }

  static compare(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, (err: unknown, result: any) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
}

export const verifySHA256 = (secret: any, value: string, hash: string) => {
  try {
    const secretKey = crypto
      .createHash("sha256")
      .update(secret)
      .digest();
  
    const checkHash = crypto
      .createHmac("sha256", secretKey)
      .update(value)
      .digest("hex");
      
    return hash && hash === checkHash;
  } catch (err) {
    console.error(err);
    return false;
  }
}