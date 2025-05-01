import { 
    findAndCountStudents, 
    findStudentById,
    findStudentByStudentId,
    createStudent,
    updateStudent,
    deleteStudentAndVaccinations,
    bulkCreateStudents
  } from "../repositories/student.repository";
  import { IStudent, IStudentResponse, IBulkResult } from "../interfaces/student.interface";
import { Student } from "../entities/student.entity";
  
  export const getAllStudents = async (
    page: number = 1, 
    limit: number = 10, 
    search: string = ""
  ): Promise<IStudentResponse<{ students: Student[]; total: number }>> => {
    try {
      const [students, total] = await findAndCountStudents({ page, limit, search });
      return { success: true, data: { students, total }, total };
    } catch (error) {
      console.error("Error fetching students:", error);
      return { success: false, message: "Server error" };
    }
  };
  
  export const getStudent = async (id: number): Promise<IStudentResponse<Student>> => {
    try {
      const student = await findStudentById(id);
      if (!student) {
        return { success: false, message: "Student not found" };
      }
      return { success: true, data: student };
    } catch (error) {
      console.error("Error fetching student:", error);
      return { success: false, message: "Server error" };
    }
  };
  
  export const getStudentByStudentId = async (studentId: string): Promise<IStudentResponse<Student>> => {
    try {
      const student = await findStudentByStudentId(studentId);
      if (!student) {
        return { success: false, message: "Student not found" };
      }
      return { success: true, data: student };
    } catch (error) {
      console.error("Error fetching student by student ID:", error);
      return { success: false, message: "Server error" };
    }
  };
  
  export const addStudent = async (studentData: Omit<IStudent, 'id'>): Promise<IStudentResponse<Student>> => {
    try {
      const existingStudent = await findStudentByStudentId(studentData.studentId);
      if (existingStudent) {
        return { success: false, message: "Student ID already exists" };
      }
  
      const newStudent = await createStudent(studentData);
      return { success: true, data: newStudent };
    } catch (error) {
      console.error("Error creating student:", error);
      return { success: false, message: "Server error" };
    }
  };
  
  export const modifyStudent = async (
    id: number, 
    updateData: Partial<IStudent>
  ): Promise<IStudentResponse<Student>> => {
    try {
      const student = await findStudentById(id);
      if (!student) {
        return { success: false, message: "Student not found" };
      }
  
      if (updateData.studentId && updateData.studentId !== student.studentId) {
        const existingStudent = await findStudentByStudentId(updateData.studentId);
        if (existingStudent) {
          return { success: false, message: "Student ID already exists" };
        }
      }
  
      const updatedStudent = await updateStudent(id, updateData);
      return { success: true, data: updatedStudent! };
    } catch (error) {
      console.error("Error updating student:", error);
      return { success: false, message: "Server error" };
    }
  };
  
  export const removeStudent = async (id: number): Promise<IStudentResponse<null>> => {
    try {
      const success = await deleteStudentAndVaccinations(id);
      if (!success) {
        return { success: false, message: "Student not found" };
      }
      return { success: true };
    } catch (error) {
      console.error("Error deleting student:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      return { 
        success: false, 
        message: "Server error",
        error: errorMessage
      };
    }
  };
  
  export const addBulkStudents = async (studentsData: Omit<IStudent, 'id'>[]): Promise<IStudentResponse<IBulkResult>> => {
    try {
      if (!Array.isArray(studentsData)) {
        return { success: false, message: "Invalid student data" };
      }
  
      const result = await bulkCreateStudents(studentsData);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error in bulk student creation:", error);
      return { success: false, message: "Server error" };
    }
  };