import { Request, Response } from "express";
import { 
  loginUser, 
  registerUser, 
  getCurrentUser as getCurrentUserService, 
  logoutUser 
} from "../services/auth.service";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await loginUser(username, password);
    return res.status(result.success ? 200 : 401).json(result);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;
    const result = await registerUser(username, password, role);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCurrentUser = (req: Request, res: Response) => {
  const result = getCurrentUserService(req.user);
  return res.status(result.success ? 200 : 401).json(result);
};

export const logout = (_req: Request, res: Response) => {
  const result = logoutUser();
  return res.status(200).json(result);
};