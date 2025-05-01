export function validateStudent(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.studentId) errors.push("Student ID is required");
  if (!data.name) errors.push("Name is required");
  if (!data.class) errors.push("Class is required");
  if (!data.gender) errors.push("Gender is required");
  if (!data.dateOfBirth) errors.push("Date of Birth is required");
  if (!data.parentName) errors.push("Parent Name is required");
  if (!data.parentContact) errors.push("Parent Contact is required");

  return { isValid: errors.length === 0, errors };
}

export function validateVaccinationDrive(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.vaccineName) errors.push("Vaccine name is required");
  if (!data.driveDate) errors.push("Drive date is required");
  if (!data.availableDoses || data.availableDoses < 1) errors.push("Available doses must be at least 1");
  if (!data.applicableClasses) errors.push("Applicable classes are required");

  return { isValid: errors.length === 0, errors };
}

export function validateVaccination(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.studentId) errors.push("Student ID is required");
  if (!data.driveId) errors.push("Drive ID is required");
  if (!data.vaccinationDate) data.vaccinationDate = new Date();

  return { isValid: errors.length === 0, errors };
}

export function validateUser(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.username) errors.push("Username is required");
  if (!data.password || data.password.length < 6) errors.push("Password must be at least 6 characters");
  if (!data.role) data.role = "admin";

  return { isValid: errors.length === 0, errors };
}

export function validateLogin(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.username) errors.push("Username is required");
  if (!data.password) errors.push("Password is required");

  return { isValid: errors.length === 0, errors };
}

export function validateCsvStudent(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.studentId) errors.push("Student ID is required");
  if (!data.name) errors.push("Name is required");
  if (!data.class) errors.push("Class is required");
  if (!data.gender) errors.push("Gender is required");
  if (!data.dateOfBirth) errors.push("Date of Birth is required");
  if (!data.parentName) errors.push("Parent Name is required");
  if (!data.parentContact) errors.push("Parent Contact is required");

  return { isValid: errors.length === 0, errors };
}