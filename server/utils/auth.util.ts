import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserWithoutPassword } from "../interfaces/user.interface";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'vaccination-portal-secret';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user: IUserWithoutPassword): string => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
};