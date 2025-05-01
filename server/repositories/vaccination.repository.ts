import { AppDataSource } from "../config/database.config";
import { Vaccination } from "../entities/vaccination.entity";
import { VaccinationDrive } from "../entities/vaccination-drive.entity";
import { IVaccinationFilter, IVaccinationPdfOptions } from "../interfaces/vaccination.interface";

export const findAndCountVaccinations = async (filter: IVaccinationFilter) => {
  const { page = 1, limit = 10, ...rest } = filter;
  const skip = (page - 1) * limit;

  const query = AppDataSource.getRepository(Vaccination)
    .createQueryBuilder("vaccination")
    .leftJoinAndSelect("vaccination.student", "student")
    .leftJoinAndSelect("vaccination.drive", "drive")
    .skip(skip)
    .take(limit)
    .orderBy("vaccination.vaccinationDate", "DESC");

  if (rest.vaccineType) {
    query.andWhere("drive.vaccineName = :vaccineType", { vaccineType: rest.vaccineType });
  }

  if (rest.studentClass) {
    query.andWhere("student.class = :studentClass", { studentClass: rest.studentClass });
  }

  if (rest.fromDate && rest.toDate) {
    query.andWhere("vaccination.vaccinationDate BETWEEN :fromDate AND :toDate", {
      fromDate: rest.fromDate,
      toDate: rest.toDate
    });
  } else if (rest.fromDate) {
    query.andWhere("vaccination.vaccinationDate >= :fromDate", { fromDate: rest.fromDate });
  } else if (rest.toDate) {
    query.andWhere("vaccination.vaccinationDate <= :toDate", { toDate: rest.toDate });
  }

  return query.getManyAndCount();
};

export const findVaccinationsByStudent = async (studentId: number) => {
  return AppDataSource.getRepository(Vaccination).find({
    where: { studentId },
    relations: ["drive"]
  });
};

export const findVaccinationsByDrive = async (driveId: number) => {
  return AppDataSource.getRepository(Vaccination).find({
    where: { driveId },
    relations: ["student"]
  });
};

export const createVaccinationRecord = async (
  studentId: number,
  driveId: number,
  notes?: string
) => {
  const vaccinationRepository = AppDataSource.getRepository(Vaccination);
  const driveRepository = AppDataSource.getRepository(VaccinationDrive);

  const newVaccination = vaccinationRepository.create({
    studentId,
    driveId,
    notes,
    vaccinationDate: new Date()
  });

  const savedVaccination = await vaccinationRepository.save(newVaccination);

  await driveRepository.update(driveId, {
    usedDoses: () => "usedDoses + 1"
  });

  return savedVaccination;
};

export const checkStudentVaccinationStatus = async (studentId: number, vaccineName: string) => {
  return AppDataSource.getRepository(Vaccination)
    .createQueryBuilder("vaccination")
    .leftJoin("vaccination.drive", "drive")
    .where("vaccination.studentId = :studentId", { studentId })
    .andWhere("drive.vaccineName = :vaccineName", { vaccineName })
    .getCount();
};

export const findVaccinationsForPdf = async (filter: IVaccinationPdfOptions) => {
  const query = AppDataSource.getRepository(Vaccination)
    .createQueryBuilder("vaccination")
    .leftJoinAndSelect("vaccination.student", "student")
    .leftJoinAndSelect("vaccination.drive", "drive")
    .orderBy("vaccination.vaccinationDate", "DESC");

  if (filter.vaccineType) {
    query.andWhere("drive.vaccineName = :vaccineType", { vaccineType: filter.vaccineType });
  }

  if (filter.studentClass) {
    query.andWhere("student.class = :studentClass", { studentClass: filter.studentClass });
  }

  if (filter.fromDate && filter.toDate) {
    query.andWhere("vaccination.vaccinationDate BETWEEN :fromDate AND :toDate", {
      fromDate: filter.fromDate,
      toDate: filter.toDate
    });
  } else if (filter.fromDate) {
    query.andWhere("vaccination.vaccinationDate >= :fromDate", { fromDate: filter.fromDate });
  } else if (filter.toDate) {
    query.andWhere("vaccination.vaccinationDate <= :toDate", { toDate: filter.toDate });
  }

  return query.getMany();
};