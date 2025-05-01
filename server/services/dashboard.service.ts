import { 
    getTotalStudentsCount,
    getVaccinatedStudentsCount,
    getUpcomingDrivesCount,
    getVaccineTypeStats,
    getClassVaccinationStats
  } from "../repositories/dashboard.repository";
  import { IDashboardStats, IVaccinationStats, IStatsResponse } from "../interfaces/dashboard.interface";
  
  export const getDashboardStatistics = async (): Promise<IStatsResponse<IDashboardStats>> => {
    try {
      const totalStudents = await getTotalStudentsCount();
      const vaccinatedStudents = await getVaccinatedStudentsCount();
      const vaccinationPercentage = totalStudents > 0
        ? Math.round((vaccinatedStudents / totalStudents) * 100)
        : 0;
      const upcomingDrives = await getUpcomingDrivesCount();
  
      return {
        success: true,
        data: {
          totalStudents,
          vaccinatedStudents,
          vaccinationPercentage,
          upcomingDrives
        }
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return { success: false, message: "Server error" };
    }
  };
  
  export const getVaccinationStatistics = async (): Promise<IStatsResponse<IVaccinationStats>> => {
    try {
      const vaccineStats = await getVaccineTypeStats();
      const classStats = await getClassVaccinationStats();
  
      return {
        success: true,
        data: {
          vaccineStats,
          classStats
        }
      };
    } catch (error) {
      console.error("Error fetching vaccination stats:", error);
      return { success: false, message: "Server error" };
    }
  };