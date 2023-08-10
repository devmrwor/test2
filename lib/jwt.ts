import jwt, { JwtPayload } from "jsonwebtoken";
import logger from "@lib/logger";
import config from "@config";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function generateToken(payload: User, expiresIn: string | number = "1h"): string {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn });
}

export function decodeToken(token: string): JwtPayload | string | null {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    return decoded;
  } catch (error) {
    logger.error("Error decoding JWT:", error);
    return null;
  }
}
