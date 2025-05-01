import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Vaccination } from "./vaccination.entity";

@Entity({ name: "students" })
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "student_id", type: "varchar", unique: true })
  studentId!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar" })
  class!: string;

  @Column({ type: "varchar" })
  gender!: string;

  @Column({ name: "date_of_birth", type: "timestamp" })
  dateOfBirth!: Date;

  @Column({ name: "parent_name", type: "varchar" })
  parentName!: string;

  @Column({ name: "parent_contact", type: "varchar" })
  parentContact!: string;

  @Column({ type: "varchar", nullable: true })
  address!: string;

  @OneToMany(() => Vaccination, (vaccination) => vaccination.student)
  vaccinations!: Vaccination[];
}