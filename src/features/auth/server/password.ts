import "server-only";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export const TIMING_SAFE_HASH = "$2b$12$gx7Qd7bGsax/KB.1tqfNNuNTZFRXJmW/U8KoLMZl.SwmvOtjZWb3m";

export function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return bcrypt.compare(password, storedHash);
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}
