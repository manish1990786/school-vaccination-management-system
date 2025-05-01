import { Vaccination } from "../entities/vaccination.entity";

export interface IStudent {
  id?: number;
  studentId: string;
  name: string;
  class: string;
  dateOfBirth: Date;
  vaccinations?: Vaccination[];
}

export interface IStudentResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  total?: number;
  error?: string;
}

export interface IPaginationOptions {
  page: number;
  limit: number;
  search?: string;
}

export interface IBulkResult {
  success: number;
  failed: number;
}