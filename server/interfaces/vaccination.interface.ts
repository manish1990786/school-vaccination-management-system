import { Student } from "../entities/student.entity";
import { VaccinationDrive } from "../entities/vaccination-drive.entity";

export interface IVaccination {
  id?: number;
  studentId: number;
  driveId: number;
  vaccinationDate: Date;
  notes?: string;
  student?: Student;
  drive?: VaccinationDrive;
}

export interface IVaccinationResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  total?: number;
}

export interface IVaccinationFilter {
  vaccineType?: string;
  studentClass?: string;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
}

export interface IVaccinationPdfOptions {
  vaccineType?: string;
  studentClass?: string;
  fromDate?: Date;
  toDate?: Date;
}