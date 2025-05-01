import { getUserByUsername, createUser } from "../repositories/user.repository";
import { hashPassword, comparePasswords, generateToken } from "../utils/auth.util";
import { IUserWithoutPassword, IAuthResponse } from "../interfaces/user.interface";

export const loginUser = async (username: string, password: string): Promise<IAuthResponse> => {
  if (!username || !password) {
    return { success: false, message: "Username and password are required" };
  }

  const user = await getUserByUsername(username);
  if (!user) {
    return { success: false, message: "Invalid credentials" };
  }

  const passwordMatch = await comparePasswords(password, user.password);
  if (!passwordMatch) {
    return { success: false, message: "Invalid credentials" };
  }

  const { password: _, ...userWithoutPassword } = user;
  const token = generateToken(userWithoutPassword as IUserWithoutPassword);

  return { 
    success: true, 
    user: userWithoutPassword as IUserWithoutPassword,
    token 
  };
};

export const registerUser = async (username: string, password: string, role?: string): Promise<IAuthResponse> => {
  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    return { success: false, message: "Username already exists" };
  }

  const hashedPassword = await hashPassword(password);
  const newUser = await createUser({
    username,
    password: hashedPassword,
    role: role || "admin"
  });

  const { password: _, ...userWithoutPassword } = newUser;
  const token = generateToken(userWithoutPassword as IUserWithoutPassword);

  return { 
    success: true, 
    user: userWithoutPassword as IUserWithoutPassword,
    token 
  };
};

export const getCurrentUser = (user?: IUserWithoutPassword): IAuthResponse => {
  if (user) {
    return { success: true, user };
  }
  return { success: false, message: "Not authenticated" };
};

export const logoutUser = (): IAuthResponse => {
  return { success: true, message: "Logged out successfully" };
};