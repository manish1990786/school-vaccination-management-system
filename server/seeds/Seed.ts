import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../entities/user.entity";
import { Student } from "../entities/student.entity";
import { VaccinationDrive } from "../entities/vaccination-drive.entity";
import { Vaccination } from "../entities/vaccination.entity";
import { AppDataSource } from "../config/database.config"; 

export class Seed {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = AppDataSource;
  }

  public async run(): Promise<void> {
    try {
        if (!this.dataSource.isInitialized) {
          await this.dataSource.initialize();
          console.log("Database connection established for seeding.");
        }
        await this.seedUsers();
        await this.seedStudents();
        await this.seedVaccinationDrives();
        await this.seedVaccinations();
        console.log("Database seeding completed successfully!");
      } catch (error) {
        console.error("Error during seeding process:", error);
      } finally {
        if (this.dataSource.isInitialized) {
          await this.dataSource.destroy();
        }
      }
  }

  private async seedUsers(): Promise<void> {
    const userRepository = this.dataSource.getRepository(User);
    const adminExists = await userRepository.findOne({ where: { username: "admin" } });

    if (!adminExists) {
      const admin = new User();
      admin.username = "admin";
      admin.password = await bcrypt.hash("admin123", 10);
      admin.role = "admin";
      await userRepository.save(admin);
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }

    const staffExists = await userRepository.findOne({ where: { username: "staff" } });
    
    if (!staffExists) {
      const staff = new User();
      staff.username = "staff";
      staff.password = await bcrypt.hash("staff123", 10);
      staff.role = "staff";
      await userRepository.save(staff);
      console.log("Staff user created");
    } else {
      console.log("Staff user already exists");
    }
  }

  private async seedStudents(): Promise<void> {
    const studentRepository = this.dataSource.getRepository(Student);
    const count = await studentRepository.count();

    if (count === 0) {
      const studentBatch = 200;
      const totalStudents = 1000;
      
      const firstNames = [
        "John", "Emma", "Michael", "Sophia", "Aiden", "Olivia", "William", "Ava", 
        "James", "Isabella", "Alexander", "Mia", "Benjamin", "Charlotte", "Elijah", 
        "Amelia", "Lucas", "Harper", "Mason", "Evelyn", "Logan", "Abigail", "Jacob",
        "Emily", "Ethan", "Elizabeth", "Daniel", "Sofia", "Matthew", "Avery", "Henry",
        "Ella", "Joseph", "Scarlett", "Samuel", "Grace", "David", "Chloe", "Carter",
        "Victoria", "Owen", "Riley", "Wyatt", "Aria", "Jayden", "Lily", "Noah", "Aubrey",
        "Dylan", "Zoey"
      ];
      
      const lastNames = [
        "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson",
        "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin",
        "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", 
        "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez",
        "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", 
        "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", 
        "Evans", "Edwards", "Collins"
      ];
      
      const classes = ["5A", "5B", "6A", "6B", "7A", "7B", "8A", "8B", "9A", "9B", "10A", "10B"];
      const genders = ["Male", "Female"];
      
      console.log(`Starting to seed ${totalStudents} students...`);
      
      for (let batch = 0; batch < Math.ceil(totalStudents / studentBatch); batch++) {
        const batchSize = Math.min(studentBatch, totalStudents - batch * studentBatch);
        const students = [];
        
        console.log(`Processing batch ${batch + 1}, creating ${batchSize} students...`);
        
        for (let i = 0; i < batchSize; i++) {
          const studentId = `ST${(batch * studentBatch + i + 1).toString().padStart(6, '0')}`;
          const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
          const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
          const studentClass = classes[Math.floor(Math.random() * classes.length)];
          const gender = genders[Math.floor(Math.random() * genders.length)];
          
          const now = new Date();
          const yearRange = 6 + Math.floor(Math.random() * 12);
          const birthYear = now.getFullYear() - yearRange;
          const birthMonth = Math.floor(Math.random() * 12);
          const birthDay = 1 + Math.floor(Math.random() * 28);
          
          const parentPrefix = gender === "Male" ? 
            (Math.random() > 0.5 ? "Mr." : "Dr.") : 
            (Math.random() > 0.5 ? "Mrs." : "Ms.");
          const parentFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
          const parentName = `${parentPrefix} ${parentFirstName} ${lastName}`;
          
          const areaCode = 100 + Math.floor(Math.random() * 900);
          const phonePrefix = 100 + Math.floor(Math.random() * 900);
          const phoneSuffix = 1000 + Math.floor(Math.random() * 9000);
          const parentContact = `${areaCode}-${phonePrefix}-${phoneSuffix}`;
          
          const streetNumber = 100 + Math.floor(Math.random() * 9900);
          const streetNames = ["Main St", "Oak Ave", "Cedar Dr", "Maple Ln", "Pine Rd", 
                              "School Blvd", "Park Ave", "Elm St", "Washington Ave", 
                              "Lake Dr", "River Rd", "College St", "Highland Ave"];
          const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
          const address = `${streetNumber} ${streetName}`;
          
          students.push({
            studentId,
            name: `${firstName} ${lastName}`,
            class: studentClass,
            gender,
            dateOfBirth: new Date(birthYear, birthMonth, birthDay),
            parentName,
            parentContact,
            address
          });
        }
        
        await studentRepository.save(students);
        console.log(`Batch ${batch + 1} completed: ${students.length} students created`);
      }
      
      const finalCount = await studentRepository.count();
      console.log(`Total students created: ${finalCount}`);
    } else {
      console.log(`Students already exist in database (Count: ${count})`);
    }
  }

  private async seedVaccinationDrives(): Promise<void> {
    const driveRepository = this.dataSource.getRepository(VaccinationDrive);
    const count = await driveRepository.count();

    if (count === 0) {
      const today = new Date();
      
      const vaccineTypes = [
        "MMR", "Polio", "Influenza", "Hepatitis B", "DTaP", "Tdap", 
        "Varicella", "HPV", "Meningococcal", "Pneumococcal", "Rotavirus", "COVID-19"
      ];
      
      const totalDrives = 32; 
      const drives = [];
      
      console.log(`Creating ${totalDrives} vaccination drives...`);
      
      for (let i = 0; i < totalDrives; i++) {
        let monthOffset, dayOffset, isCompleted, usedDoses;
        const availableDoses = 100 + Math.floor(Math.random() * 400);
        
        if (i < 12) {
          monthOffset = -(1 + Math.floor(Math.random() * 6));
          dayOffset = -(1 + Math.floor(Math.random() * 28));
          isCompleted = true;
          usedDoses = Math.floor(availableDoses * (0.5 + Math.random() * 0.5)); 
        } else if (i < 20) {
          monthOffset = 0;
          dayOffset = Math.floor(Math.random() * 30) - 5; 
          isCompleted = dayOffset < 0;
          usedDoses = isCompleted ? 
            Math.floor(availableDoses * (0.3 + Math.random() * 0.7)) :
            Math.floor(availableDoses * Math.random() * 0.1);
        } else {
          monthOffset = Math.floor(Math.random() * 6) + 1;
          dayOffset = Math.floor(Math.random() * 28) + 1;
          isCompleted = false;
          usedDoses = 0;
        }
        
        const driveDate = new Date(
          today.getFullYear(),
          today.getMonth() + monthOffset,
          today.getDate() + dayOffset
        );
        
        const classes = ["5A", "5B", "6A", "6B", "7A", "7B", "8A", "8B", "9A", "9B", "10A", "10B"];
        const numClasses = 3 + Math.floor(Math.random() * 6);
        const selectedClasses = [];
        
        const classIndices = [...Array(classes.length).keys()];
        for (let j = 0; j < numClasses; j++) {
          const randomIndex = Math.floor(Math.random() * classIndices.length);
          const classIndex = classIndices.splice(randomIndex, 1)[0];
          selectedClasses.push(classes[classIndex]);
        }
        
        const applicableClasses = selectedClasses.join(',');
        const vaccineIndex = i % vaccineTypes.length;
        const vaccineName = vaccineTypes[vaccineIndex];
        
        const noteTemplates = [
          `${vaccineName} vaccination drive for selected classes`,
          `Mandatory ${vaccineName} immunization for eligible students`,
          `Annual ${vaccineName} vaccine administration`,
          `${vaccineName} booster shots for students`,
          `School-wide ${vaccineName} vaccination program`
        ];
        
        const notes = noteTemplates[Math.floor(Math.random() * noteTemplates.length)];
        
        drives.push({
          vaccineName,
          driveDate,
          availableDoses,
          usedDoses,
          applicableClasses,
          notes,
          isCompleted
        });
      }
      
      await driveRepository.save(drives);
      console.log(`${drives.length} vaccination drives created`);
    } else {
      console.log(`Vaccination drives already exist in database (Count: ${count})`);
    }
  }

  private async seedVaccinations(): Promise<void> {
    const vaccinationRepository = this.dataSource.getRepository(Vaccination);
    const count = await vaccinationRepository.count();

    if (count === 0) {
      const studentRepository = this.dataSource.getRepository(Student);
      const driveRepository = this.dataSource.getRepository(VaccinationDrive);
      const students = await studentRepository.find();
 
      const completedDrives = await driveRepository.find({ 
        where: { isCompleted: true }
      });

      if (completedDrives.length > 0 && students.length > 0) {
        console.log(`Creating vaccination records for ${completedDrives.length} completed drives...`);
        let totalVaccinations = 0;
        
        for (const drive of completedDrives) {
          const applicableClasses = drive.applicableClasses.split(',');
          
          const eligibleStudents = students.filter(student => 
            applicableClasses.includes(student.class)
          );
          
          const participationRate = 0.5 + Math.random() * 0.3; 
          const numToVaccinate = Math.min(
            Math.floor(eligibleStudents.length * participationRate), 
            drive.usedDoses
          );
          
          if (numToVaccinate <= 0) {
            console.log(`No vaccinations for drive ${drive.id} (${drive.vaccineName})`);
            continue;
          }
          
          console.log(`Processing vaccinations for drive ${drive.id} (${drive.vaccineName}): ${numToVaccinate} vaccinations`);
          
          const batchSize = 200;
          const shuffledStudents = [...eligibleStudents].sort(() => 0.5 - Math.random());
          const selectedStudents = shuffledStudents.slice(0, numToVaccinate);
          
          for (let i = 0; i < selectedStudents.length; i += batchSize) {
            const batch = selectedStudents.slice(i, i + batchSize);
            const vaccinations = [];
            
            for (const student of batch) {
              const daysOffset = Math.floor(Math.random() * 5) - 2;
              const vaccinationDate = new Date(drive.driveDate);
              vaccinationDate.setDate(vaccinationDate.getDate() + daysOffset);
              
              const noteTemplates = [
                `${student.name} received ${drive.vaccineName} vaccine`,
                `${drive.vaccineName} administered to ${student.name}`,
                `Vaccination complete: ${drive.vaccineName} for ${student.name}`,
                `${student.name} immunized with ${drive.vaccineName}`,
                `${drive.vaccineName} dose given to ${student.name}`
              ];
              
              const notes = noteTemplates[Math.floor(Math.random() * noteTemplates.length)];
              
              const vaccination = new Vaccination();
              vaccination.student = student;
              vaccination.drive = drive;
              vaccination.vaccinationDate = vaccinationDate;
              vaccination.notes = notes;
              
              vaccinations.push(vaccination);
            }
            
            await vaccinationRepository.save(vaccinations);
            totalVaccinations += vaccinations.length;
            console.log(`Batch completed: ${vaccinations.length} vaccinations created for drive ${drive.id}`);
          }
        }
        
        console.log(`Total vaccinations created: ${totalVaccinations}`);
      } else {
        console.log("Cannot create vaccinations: No completed drives or students found");
      }
    } else {
      console.log(`Vaccinations already exist in database (Count: ${count})`);
    }
  }
}

const seedRunner = new Seed();
seedRunner.run().catch(error => console.error("Seeding execution failed:", error));