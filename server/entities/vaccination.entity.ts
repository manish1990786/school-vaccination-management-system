import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Student } from "./student.entity";
import { VaccinationDrive } from "./vaccination-drive.entity";

@Entity({ name: "vaccinations" })
export class Vaccination {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "student_id", type: "int" })
  studentId!: number;

  @Column({ name: "drive_id", type: "int" })
  driveId!: number;

  @Column({ name: "vaccination_date", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  vaccinationDate!: Date;

  @Column({ type: "varchar", nullable: true })
  notes!: string;

  @ManyToOne(() => Student, (student) => student.vaccinations)
  @JoinColumn({ name: "student_id" })
  student!: Student;

  @ManyToOne(() => VaccinationDrive, (drive) => drive.vaccinations)
  @JoinColumn({ name: "drive_id" })
  drive!: VaccinationDrive;
}