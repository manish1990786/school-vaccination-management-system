import { Request, Response } from "express";
import { 
  getDashboardStatistics, 
  getVaccinationStatistics 
} from "../services/dashboard.service";

export const getDashboardStats = async (req: Request, res: Response) => {
  const result = await getDashboardStatistics();
  return res.status(result.success ? 200 : 500).json(result);
};

export const getVaccinationStats = async (req: Request, res: Response) => {
  const result = await getVaccinationStatistics();
  return res.status(result.success ? 200 : 500).json(result);
};