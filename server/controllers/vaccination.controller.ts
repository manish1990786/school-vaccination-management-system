import { Request, Response } from "express";
import PDFDocument from 'pdfkit';
import { 
  getVaccinations,
  getStudentVaccinations,
  getDriveVaccinations,
  addVaccination,
  checkVaccinationStatus,
  generateVaccinationPdf
} from "../services/vaccination.service";
import { IVaccinationFilter, IVaccinationPdfOptions } from "../interfaces/vaccination.interface";

export const getAllVaccinationsHandler = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const vaccineType = req.query.vaccineType as string;
  const studentClass = req.query.studentClass as string;
  const fromDate = req.query.fromDate ? new Date(req.query.fromDate as string) : undefined;
  const toDate = req.query.toDate ? new Date(req.query.toDate as string) : undefined;

  const filter: IVaccinationFilter = {
    page,
    limit,
    vaccineType,
    studentClass,
    fromDate,
    toDate
  };

  const result = await getVaccinations(filter);
  return res.status(result.success ? 200 : 500).json(result);
};

export const getVaccinationsByStudentHandler = async (req: Request, res: Response) => {
  const studentId = parseInt(req.params.studentId);
  const result = await getStudentVaccinations(studentId);
  return res.status(result.success ? 200 : 500).json(result);
};

export const getVaccinationsByDriveHandler = async (req: Request, res: Response) => {
  const driveId = parseInt(req.params.driveId);
  const result = await getDriveVaccinations(driveId);
  return res.status(result.success ? 200 : 500).json(result);
};

export const createVaccinationHandler = async (req: Request, res: Response) => {
  const { studentId, driveId, notes } = req.body;
  const result = await addVaccination(studentId, driveId, notes);
  
  const statusCode = result.success ? 201 : 
    result.message === "Student not found" || result.message === "Vaccination drive not found" ? 404 : 
    result.message === "Student already vaccinated in this drive" || result.message === "No doses available in this drive" ? 400 : 
    500;
  
  return res.status(statusCode).json(result);
};

export const checkStudentVaccinationStatusHandler = async (req: Request, res: Response) => {
  const studentId = parseInt(req.params.studentId);
  const vaccineName = req.query.vaccineName as string;

  const result = await checkVaccinationStatus(studentId, vaccineName);
  
  const statusCode = result.success ? 200 : 
    result.message === "Student not found" ? 404 : 
    result.message === "Vaccine name is required" ? 400 : 
    500;
  
  return res.status(statusCode).json(result);
};

export const exportVaccinationReportToPdfHandler = async (req: Request, res: Response) => {
  try {
    const vaccineType = req.query.vaccineType as string;
    const studentClass = req.query.studentClass as string;
    const fromDate = req.query.fromDate ? new Date(req.query.fromDate as string) : undefined;
    const toDate = req.query.toDate ? new Date(req.query.toDate as string) : undefined;

    const filter: IVaccinationPdfOptions = {
      vaccineType,
      studentClass,
      fromDate,
      toDate
    };

    const { vaccinations } = await generateVaccinationPdf(filter);

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=vaccination_report_${new Date().toISOString().split('T')[0]}.pdf`);

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      bufferPages: true
    });

    const drawHeader = (doc: PDFKit.PDFDocument, y: number): number => {
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('ID', 50, y);
      doc.text('Student', 100, y);
      doc.text('Vaccine', 250, y);
      doc.text('Date', 350, y);
      y += 15;
      doc.moveTo(50, y).lineTo(550, y).stroke();
      return y + 5;
    };

    const drawRow = (doc: PDFKit.PDFDocument, vaccination: any, y: number) => {
      const dateStr = vaccination.vaccinationDate
        ? new Date(vaccination.vaccinationDate).toLocaleDateString()
        : 'N/A';

      doc.font('Helvetica').fontSize(10);

      doc.text(String(vaccination.id), 50, y, { width: 40, lineBreak: false });
      doc.text(vaccination.student?.name || 'Unknown', 100, y, { width: 130, lineBreak: false, ellipsis: true });
      doc.text(vaccination.drive?.vaccineName || 'Unknown', 250, y, { width: 80, lineBreak: false, ellipsis: true });
      doc.text(dateStr, 350, y, { width: 80, lineBreak: false });
    };

    doc.pipe(res);

    doc.fontSize(25).text('Vaccination Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Report Date: ${new Date().toLocaleString()}`);
    doc.fontSize(12).text(`Total Records: ${vaccinations.length}`);
    doc.moveDown();

    doc.fontSize(14).text('Vaccination Records:');
    doc.moveDown();

    let y = doc.y;
    const rowHeight = 20;
    const bottomMargin = 50;
    const usableHeight = doc.page.height - bottomMargin;

    y = drawHeader(doc, y);

    vaccinations.forEach((vaccination, index) => {
      if (y + rowHeight > usableHeight) {
        doc.addPage();
        y = 50;
        y = drawHeader(doc, y);
      }

      drawRow(doc, vaccination, y);
      y += rowHeight;
    });

    doc.end();
  } catch (error) {
    console.error("Error generating PDF report:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Error generating PDF report" });
    }
  }
};