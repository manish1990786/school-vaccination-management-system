import { DataSource } from "typeorm";
import { Student } from "../entities/student.entity";
import { VaccinationDrive } from "../entities/vaccination-drive.entity";
import { Vaccination } from "../entities/vaccination.entity";
import { User } from "../entities/user.entity";
import bcrypt from "bcrypt";
import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || "5432"),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  synchronize: false,
  logging: 'all',
  entities: [Student, VaccinationDrive, Vaccination, User],
  subscribers: [],
  migrations: ["./migrations/*.ts"],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established");

    await seedDefaultAdmin();
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};

async function seedDefaultAdmin() {
  const userRepository = AppDataSource.getRepository(User);
  const adminCount = await userRepository.count({ where: { username: "admin" } });

  if (adminCount === 0) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    await userRepository.save({
      username: "admin",
      password: hashedPassword,
      role: "admin"
    });
    console.log("Default admin user created");
  }
}