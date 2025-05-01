export interface IVaccinationDrive {
    id?: number;
    vaccineName: string;
    driveDate: Date;
    availableDoses: number;
    usedDoses?: number;
    applicableClasses: string;
    isCompleted?: boolean;
  }
  
  export interface IVaccinationDriveResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    total?: number;
  }
  
  export interface IPaginationOptions {
    page?: number;
    limit?: number;
    search?: string;
  }
  
  export interface IUpcomingDrivesFilter {
    days?: number;
  }