import { 
    findAndCountVaccinations,
    findVaccinationsByStudent,
    findVaccinationsByDrive,
    createVaccinationRecord,
    checkStudentVaccinationStatus,
    findVaccinationsForPdf
  } from "../repositories/vaccination.repository";
  import { AppDataSource } from "../config/database.config";
  import { Student } from "../entities/student.entity";
  import { VaccinationDrive } from "../entities/vaccination-drive.entity";
  import { IVaccinationResponse, IVaccinationFilter, IVaccinationPdfOptions } from "../interfaces/vaccination.interface";
import { Vaccination } from "../entities/vaccination.entity";
  
  const studentRepository = AppDataSource.getRepository(Student);
  const driveRepository = AppDataSource.getRepository(VaccinationDrive);
  
  export const getVaccinations = async (
    filter: IVaccinationFilter
  ): Promise<IVaccinationResponse<{ vaccinations: Vaccination[]; total: number }>> => {
    try {
      const [vaccinations, total] = await findAndCountVaccinations(filter);
      return { success: true, data: { vaccinations, total }, total };
    } catch (error) {
      console.error("Error fetching vaccinations:", error);
      return { success: false, message: "Server error" };
    }
  };
  
  export const getStudentVaccinations = async (
    studentId: number
  ): Promise<IVaccinationResponse<Vaccination[]>> => {
    try {
      const vaccinations = await findVaccinationsByStudent(studentId);
      return { success: true, data: vaccinations };
    } catch (error) {
      console.error("Error fetching student vaccinations:", error);
      return { success: false, message: "Server error" };
    }
  };
  
  export const getDriveVaccinations = async (
    driveId: number
  ): Promise<IVaccinationResponse<Vaccination[]>> => {
    try {
      const vaccinations = await findVaccinationsByDrive(driveId);
      return { success: true, data: vaccinations };
    } catch (error) {
      console.error("Error fetching drive vaccinations:", error);
      return { success: false, message: "Server error" };
    }
  };
  
  export const addVaccination = async (
    studentId: number,
    driveId: number,
    notes?: string
  ): Promise<IVaccinationResponse<Vaccination>> => {
    try {
      const student = await studentRepository.findOne({ where: { id: studentId } });
      if (!student) {
        return { success: false, message: "Student not found" };
      }
  
      const drive = await driveRepository.findOne({ where: { id: driveId } });
      if (!drive) {
        return { success: false, message: "Vaccination drive not found" };
      }
  
      const existingVaccination = await AppDataSource.getRepository(Vaccination).findOne({
        where: { studentId, driveId }
      });
  
      if (existingVaccination) {
        return { success: false, message: "Student already vaccinated in this drive" };
      }
  
      if (drive.usedDoses >= drive.availableDoses) {
        return { success: false, message: "No doses available in this drive" };
      }
  
      const vaccination = await createVaccinationRecord(studentId, driveId, notes);
      return { success: true, data: vaccination };
    } catch (error) {
      console.error("Error creating vaccination record:", error);
      return { success: false, message: "Server error" };
    }
  };
  
  export const checkVaccinationStatus = async (
    studentId: number,
    vaccineName: string
  ): Promise<IVaccinationResponse<{ isVaccinated: boolean }>> => {
    try {
      if (!vaccineName) {
        return { success: false, message: "Vaccine name is required" };
      }
  
      const student = await studentRepository.findOne({ where: { id: studentId } });
      if (!student) {
        return { success: false, message: "Student not found" };
      }
  
      const count = await checkStudentVaccinationStatus(studentId, vaccineName);
      return { success: true, data: { isVaccinated: count > 0 } };
    } catch (error) {
      console.error("Error checking vaccination status:", error);
      return { success: false, message: "Server error" };
    }
  };
  
  export const generateVaccinationPdf = async (
    filter: IVaccinationPdfOptions
  ): Promise<{ vaccinations: Vaccination[] }> => {
    try {
      const vaccinations = await findVaccinationsForPdf(filter);
      return { vaccinations };
    } catch (error) {
      console.error("Error fetching vaccinations for PDF:", error);
      throw error;
    }
  };