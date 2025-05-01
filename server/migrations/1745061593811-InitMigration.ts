import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1745061593811 implements MigrationInterface {
    name = 'InitMigration1745061593811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vaccination_drives" ("id" SERIAL NOT NULL, "vaccine_name" character varying NOT NULL, "drive_date" TIMESTAMP NOT NULL, "available_doses" integer NOT NULL, "used_doses" integer NOT NULL DEFAULT '0', "applicable_classes" character varying NOT NULL, "notes" character varying, "is_completed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_7f381d6af8eeb3254913e099b4d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vaccinations" ("id" SERIAL NOT NULL, "student_id" integer NOT NULL, "drive_id" integer NOT NULL, "vaccination_date" TIMESTAMP NOT NULL DEFAULT now(), "notes" character varying, CONSTRAINT "PK_99719c8d5726027cd5f7a7cbb1a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "students" ("id" SERIAL NOT NULL, "student_id" character varying NOT NULL, "name" character varying NOT NULL, "class" character varying NOT NULL, "gender" character varying NOT NULL, "date_of_birth" TIMESTAMP NOT NULL, "parent_name" character varying NOT NULL, "parent_contact" character varying NOT NULL, "address" character varying, CONSTRAINT "UQ_ba36f3e3743f80d1cdc51020103" UNIQUE ("student_id"), CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'admin', CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "vaccinations" ADD CONSTRAINT "FK_bc14bb6e769dbae273cb581d41a" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vaccinations" ADD CONSTRAINT "FK_a8133d54cb15f8c0cdd4746af0e" FOREIGN KEY ("drive_id") REFERENCES "vaccination_drives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vaccinations" DROP CONSTRAINT "FK_a8133d54cb15f8c0cdd4746af0e"`);
        await queryRunner.query(`ALTER TABLE "vaccinations" DROP CONSTRAINT "FK_bc14bb6e769dbae273cb581d41a"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "students"`);
        await queryRunner.query(`DROP TABLE "vaccinations"`);
        await queryRunner.query(`DROP TABLE "vaccination_drives"`);
    }

}
