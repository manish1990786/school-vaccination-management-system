export interface IDashboardStats {
    totalStudents: number;
    vaccinatedStudents: number;
    vaccinationPercentage: number;
    upcomingDrives: number;
  }
  
  export interface IVaccinationStats {
    vaccineStats: Array<{
      vaccineName: string;
      count: string;
    }>;
    classStats: Array<{
      class: string;
      count: string;
    }>;
  }
  
  export interface IStatsResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
  }