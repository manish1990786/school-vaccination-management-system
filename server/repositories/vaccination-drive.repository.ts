import { AppDataSource } from "../config/database.config"
import { VaccinationDrive } from "../entities/vaccination-drive.entity"
import { ILike, MoreThan } from "typeorm";
import { IPaginationOptions, IUpcomingDrivesFilter, IVaccinationDrive } from "../interfaces/vaccination-drive.interface";

export const findAndCountDrives = async (options: IPaginationOptions) => {
    const { page = 1, limit = 10, search = "" } = options;
    const skip = (page - 1) * limit;

    return AppDataSource.getRepository(VaccinationDrive).findAndCount({
        where: search ? [
            { vaccineName: ILike(`%${search}%`) },
            { applicableClasses: ILike(`%${search}%`) }
        ] : {},
        skip,
        take: limit,
        order: { driveDate: "ASC" }
    });
};

export const findDriveById = async (id: number) => {
    return AppDataSource.getRepository(VaccinationDrive).findOne({ where: { id } });
};

export const createDrive = async (driveData: Omit<IVaccinationDrive, 'id'>) => {
    const driveRepository = AppDataSource.getRepository(VaccinationDrive);
    const newDrive = driveRepository.create(driveData);
    return driveRepository.save(newDrive);
};

export const updateDrive = async (id: number, updateData: Partial<IVaccinationDrive>) => {
    await AppDataSource.getRepository(VaccinationDrive).update(id, updateData);
    return findDriveById(id);
};

export const deleteDrive = async (id: number) => {
    const result = await AppDataSource.getRepository(VaccinationDrive).delete(id);
    return result.affected !== 0;
};

export const findUpcomingDrives = async (filter: IUpcomingDrivesFilter) => {
    const days = filter.days || 30;
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + days);

    return AppDataSource.getRepository(VaccinationDrive).find({
        where: {
            driveDate: MoreThan(today),
            isCompleted: false
        },
        order: { driveDate: "ASC" }
    });
};

export const markDriveComplete = async (id: number) => {
    await AppDataSource.getRepository(VaccinationDrive).update(id, { isCompleted: true });
    return findDriveById(id);
};