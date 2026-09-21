import "server-only";
import bcrypt from "bcryptjs";

export function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return bcrypt.compare(password, storedHash);
}
