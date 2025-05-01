import { Request, Response } from "express";
import { parse } from "csv-parse";
import { 
  getAllStudents,
  getStudent,
  getStudentByStudentId,
  addStudent,
  modifyStudent,
  removeStudent,
  addBulkStudents
} from "../services/student.service";

export const getAllStudentsHandler = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || "";

  const result = await getAllStudents(page, limit, search);
  return res.status(result.success ? 200 : 500).json(result);
};

export const getStudentByIdHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const result = await getStudent(id);
  return res.status(result.success ? (result.data ? 200 : 404) : 500).json(result);
};

export const getStudentByStudentIdHandler = async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const result = await getStudentByStudentId(studentId);
  return res.status(result.success ? (result.data ? 200 : 404) : 500).json(result);
};

export const createStudentHandler = async (req: Request, res: Response) => {
  const studentData = {
    ...req.body,
    dateOfBirth: new Date(req.body.dateOfBirth)
  };
  const result = await addStudent(studentData);
  return res.status(result.success ? (result.data ? 201 : 400) : 500).json(result);
};

export const updateStudentHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updateData = req.body.dateOfBirth 
    ? { ...req.body, dateOfBirth: new Date(req.body.dateOfBirth) }
    : req.body;

  const result = await modifyStudent(id, updateData);
  return res.status(result.success ? (result.data ? 200 : 404) : 500).json(result);
};

export const deleteStudentHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const result = await removeStudent(id);
  return res.status(result.success ? 200 : (result.message === "Student not found" ? 404 : 500)).json(result);
};

export const bulkCreateStudentsHandler = async (req: Request, res: Response) => {
  const { students } = req.body;
  const studentsData = students.map((student: any) => ({
    ...student,
    dateOfBirth: new Date(student.dateOfBirth)
  }));
  const result = await addBulkStudents(studentsData);
  return res.status(result.success ? 200 : 500).json(result);
};

export const importStudentsFromCSVHandler = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  try {
    const parser = parse({
      columns: true,
      skip_empty_lines: true
    });

    const records: any[] = [];

    const parsePromise = new Promise((resolve, reject) => {
      parser.on('readable', function() {
        let record;
        while ((record = parser.read()) !== null) {
          records.push(record);
        }
      });

      parser.on('error', function(err) {
        reject(err);
      });

      parser.on('end', function() {
        resolve(records);
      });
    });

    parser.write(req.file.buffer.toString());
    parser.end();

    const parsedRecords = await parsePromise as any[];
    const studentsData = parsedRecords.map(record => ({
      ...record,
      dateOfBirth: new Date(record.dateOfBirth)
    }));

    const result = await addBulkStudents(studentsData);
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error("Error importing students from CSV:", error);
    const message = error instanceof Error ? error.message : "Error parsing CSV file";
    return res.status(500).json({ success: false, message });
  }
};