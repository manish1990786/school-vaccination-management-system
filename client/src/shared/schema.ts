export interface Student {
  id: number;
  studentId: string;
  name: string;
  class: string;
  gender: string;
  dateOfBirth: Date | string;
  parentName: string;
  parentContact: string;
  address?: string;
  vaccinationStatus?: string;
  vaccinations?: Vaccination[];
}

export interface VaccinationDrive {
  id: number;
  vaccineName: string;
  driveDate: Date | string;
  availableDoses: number;
  usedDoses: number;
  applicableClasses: string;
  notes?: string;
  isCompleted: boolean;
  vaccinations?: Vaccination[];
}

export interface VaccinationDrivesResponse {
  success: boolean;
  data: VaccinationDrive[];
}

export interface Vaccination {
  id: number;
  studentId: number;
  driveId: number;
  vaccinationDate: Date | string;
  notes?: string;
  student?: Student;
  drive?: VaccinationDrive;
}

export interface DashboardStats {
  success: boolean;
  data: {
    totalStudents: number;
    vaccinatedStudents: number;
    vaccinationPercentage: number;
    upcomingDrives: number;
  };
}