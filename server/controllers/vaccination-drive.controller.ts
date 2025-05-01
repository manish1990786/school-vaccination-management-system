import { Request, Response } from "express";
import { 
  getVaccinationDrives,
  getVaccinationDrive,
  addVaccinationDrive,
  modifyVaccinationDrive,
  removeVaccinationDrive,
  getUpcomingVaccinationDrives,
  completeVaccinationDrive
} from "../services/vaccination-drive.service";

export const getAllVaccinationDrives = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || "";

  const result = await getVaccinationDrives({ page, limit, search });
  return res.status(result.success ? 200 : 500).json(result);
};

export const getVaccinationDriveById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const result = await getVaccinationDrive(id);
  return res.status(result.success ? (result.data ? 200 : 404) : 500).json(result);
};

export const createVaccinationDrive = async (req: Request, res: Response) => {
  const driveData = {
    ...req.body,
    driveDate: new Date(req.body.driveDate)
  };
  const result = await addVaccinationDrive(driveData);
  return res.status(result.success ? 201 : 500).json(result);
};

export const updateVaccinationDrive = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updateData = req.body.driveDate 
    ? { ...req.body, driveDate: new Date(req.body.driveDate) }
    : req.body;

  const result = await modifyVaccinationDrive(id, updateData);
  return res.status(result.success ? (result.data ? 200 : 404) : 500).json(result);
};

export const deleteVaccinationDrive = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const result = await removeVaccinationDrive(id);
  return res.status(result.success ? 200 : (result.message === "Vaccination drive not found" ? 404 : 500)).json(result);
};

export const getUpcomingDrives = async (req: Request, res: Response) => {
  const days = parseInt(req.params.days as string) || 30;
  const result = await getUpcomingVaccinationDrives({ days });
  return res.status(result.success ? 200 : 500).json(result);
};

export const markDriveAsCompleted = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const result = await completeVaccinationDrive(id);
  return res.status(result.success ? (result.data ? 200 : 404) : 500).json(result);
};