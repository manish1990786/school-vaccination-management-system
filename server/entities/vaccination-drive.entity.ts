import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Vaccination } from "./vaccination.entity";

@Entity({ name: "vaccination_drives" })
export class VaccinationDrive {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "vaccine_name", type: "varchar" })
  vaccineName!: string;

  @Column({ name: "drive_date", type: "timestamp" })
  driveDate!: Date;

  @Column({ name: "available_doses", type: "int" })
  availableDoses!: number;

  @Column({ name: "used_doses", type: "int", default: 0 })
  usedDoses!: number;

  @Column({ name: "applicable_classes", type: "varchar" })
  applicableClasses!: string;

  @Column({ type: "varchar", nullable: true })
  notes!: string;

  @Column({ name: "is_completed", type: "boolean", default: false })
  isCompleted!: boolean;

  @OneToMany(() => Vaccination, (vaccination) => vaccination.drive)
  vaccinations!: Vaccination[];
}