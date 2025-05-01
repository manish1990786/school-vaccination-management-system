import { AppDataSource } from "../config/database.config";
import { Student } from "../entities/student.entity";
import { ILike } from "typeorm";
import { IStudent, IPaginationOptions } from "../interfaces/student.interface";
import { Vaccination } from "../entities/vaccination.entity";

export const findAndCountStudents = async (options: IPaginationOptions) => {
  const { page, limit, search } = options;
  const skip = (page - 1) * limit;

  return AppDataSource.getRepository(Student).findAndCount({
    where: search ? [
      { name: ILike(`%${search}%`) },
      { studentId: ILike(`%${search}%`) },
      { class: ILike(`%${search}%`) }
    ] : {},
    relations: ["vaccinations"],
    skip,
    take: limit,
    order: { name: "ASC" }
  });
};

export const findStudentById = async (id: number) => {
  return AppDataSource.getRepository(Student).findOne({ 
    where: { id },
    relations: ["vaccinations"]
  });
};

export const findStudentByStudentId = async (studentId: string) => {
  return AppDataSource.getRepository(Student).findOne({ 
    where: { studentId },
    relations: ["vaccinations"]
  });
};

export const createStudent = async (studentData: Omit<IStudent, 'id'>) => {
  const studentRepository = AppDataSource.getRepository(Student);
  const newStudent = studentRepository.create(studentData);
  return studentRepository.save(newStudent);
};

export const updateStudent = async (id: number, updateData: Partial<IStudent>) => {
  await AppDataSource.getRepository(Student).update(id, updateData);
  return findStudentById(id);
};

export const deleteStudentAndVaccinations = async (id: number) => {
  const studentRepository = AppDataSource.getRepository(Student);
  const vaccinationRepository = AppDataSource.getRepository(Vaccination);

  const student = await studentRepository.findOne({ 
    where: { id },
    relations: ["vaccinations"]
  });

  if (!student) {
    return false;
  }

  if (student.vaccinations && student.vaccinations.length > 0) {
    await vaccinationRepository.delete({ student: { id } });
  }

  await studentRepository.delete(id);
  return true;
};

export const bulkCreateStudents = async (studentsData: Omit<IStudent, 'id'>[]) => {
  const studentRepository = AppDataSource.getRepository(Student);
  const results = await Promise.all(
    studentsData.map(async (studentData) => {
      try {
        const existingStudent = await studentRepository.findOne({
          where: { studentId: studentData.studentId }
        });

        if (existingStudent) {
          return { success: false };
        }

        const newStudent = studentRepository.create(studentData);
        await studentRepository.save(newStudent);
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    })
  );

  return {
    success: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length
  };
};