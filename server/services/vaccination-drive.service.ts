import { 
    findAndCountDrives,
    findDriveById,
    createDrive,
    updateDrive,
    deleteDrive,
    findUpcomingDrives,
    markDriveComplete
  } from "../repositories/vaccination-drive.repository";
  import { 
    IVaccinationDrive, 
    IVaccinationDriveResponse, 
    IPaginationOptions,
    IUpcomingDrivesFilter
  } from "../interfaces/vaccination-drive.interface";
import { VaccinationDrive } from "../entities/vaccination-drive.entity";
  
  export const getVaccinationDrives = async (
    options: IPaginationOptions
  ): Promise<IVaccinationDriveResponse<{ drives: VaccinationDrive[]; total: number }>> => {
    try {
      const [drives, total] = await findAndCountDrives(options);
      return { success: true, data: { drives, total }, total };
    } catch (error) {
      console.error("Error fetching vaccination drives:", error);
      return { success: false, message: "Server error" };
    }
  };
  
  export const getVaccinationDrive = async (
    id: number
  ): Promise<IVaccinationDriveResponse<VaccinationDrive>> => {
    try {
      const drive = await findDriveById(id);
      if (!drive) {
        return { success: false, message: "Vaccination drive not found" };
      }
      return { success: true, data: drive };
    } catch (error) {
      console.error("Error fetching vaccination drive:", error);
      return { success: false, message: "Server error" };
    }
  };
  
  export const addVaccinationDrive = async (
    driveData: Omit<IVaccinationDrive, 'id'>
  ): Promise<IVaccinationDriveResponse<VaccinationDrive>> => {
    try {
      const newDrive = await createDrive({
        ...driveData,
        usedDoses: 0,
        isCompleted: false
      });
      return { success: true, data: newDrive };
    } catch (error) {
      console.error("Error creating vaccination drive:", error);
      return { success: false, message: "Server error" };
    }
  };
  
  export const modifyVaccinationDrive = async (
    id: number,
    updateData: Partial<IVaccinationDrive>
  ): Promise<IVaccinationDriveResponse<VaccinationDrive>> => {
    try {
      const drive = await findDriveById(id);
      if (!drive) {
        return { success: false, message: "Vaccination drive not found" };
      }
  
      const updatedDrive = await updateDrive(id, updateData);
      return { success: true, data: updatedDrive! };
    } catch (error) {
      console.error("Error updating vaccination drive:", error);
      return { success: false, message: "Server error" };
    }
  };
  
  export const removeVaccinationDrive = async (
    id: number
  ): Promise<IVaccinationDriveResponse<null>> => {
    try {
      const success = await deleteDrive(id);
      if (!success) {
        return { success: false, message: "Vaccination drive not found" };
      }
      return { success: true };
    } catch (error) {
      console.error("Error deleting vaccination drive:", error);
      return { success: false, message: "Server error" };
    }
  };
  
  export const getUpcomingVaccinationDrives = async (
    filter: IUpcomingDrivesFilter
  ): Promise<IVaccinationDriveResponse<VaccinationDrive[]>> => {
    try {
      const drives = await findUpcomingDrives(filter);
      return { success: true, data: drives };
    } catch (error) {
      console.error("Error fetching upcoming drives:", error);
      return { success: false, message: "Server error" };
    }
  };
  
  export const completeVaccinationDrive = async (
    id: number
  ): Promise<IVaccinationDriveResponse<VaccinationDrive>> => {
    try {
      const drive = await findDriveById(id);
      if (!drive) {
        return { success: false, message: "Vaccination drive not found" };
      }
  
      const updatedDrive = await markDriveComplete(id);
      return { success: true, data: updatedDrive! };
    } catch (error) {
      console.error("Error marking drive as completed:", error);
      return { success: false, message: "Server error" };
    }
  };