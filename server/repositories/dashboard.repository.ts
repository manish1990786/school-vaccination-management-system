import { AppDataSource } from "../config/database.config";
import { Student } from "../entities/student.entity";
import { Vaccination } from "../entities/vaccination.entity";
import { VaccinationDrive } from "../entities/vaccination-drive.entity";
import { MoreThan } from "typeorm";

export const getTotalStudentsCount = async (): Promise<number> => {
  return AppDataSource.getRepository(Student).count();
};

export const getVaccinatedStudentsCount = async (): Promise<number> => {
  return AppDataSource.getRepository(Student)
    .createQueryBuilder("student")
    .innerJoin("student.vaccinations", "vaccination")
    .groupBy("student.id")
    .getCount();
};

export const getUpcomingDrivesCount = async (): Promise<number> => {
  const today = new Date();
  return AppDataSource.getRepository(VaccinationDrive).count({
    where: {
      driveDate: MoreThan(today),
      isCompleted: false
    }
  });
};

export const getVaccineTypeStats = async () => {
  return AppDataSource.getRepository(Vaccination)
    .createQueryBuilder("vaccination")
    .leftJoin("vaccination.drive", "drive")
    .select("drive.vaccineName", "vaccineName")
    .addSelect("COUNT(vaccination.id)", "count")
    .groupBy("drive.vaccineName")
    .getRawMany();
};

export const getClassVaccinationStats = async () => {
  return AppDataSource.getRepository(Vaccination)
    .createQueryBuilder("vaccination")
    .leftJoin("vaccination.student", "student")
    .select("student.class", "class")
    .addSelect("COUNT(vaccination.id)", "count")
    .groupBy("student.class")
    .getRawMany();
};