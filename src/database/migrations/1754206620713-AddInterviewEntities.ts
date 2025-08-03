import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInterviewEntities1754206620713 implements MigrationInterface {
  name = 'AddInterviewEntities1754206620713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create master_interview_status table
    await queryRunner.query(`
      CREATE TABLE "master_interview_status" (
        "code" character varying(5) NOT NULL,
        "title" character varying(255) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL,
        CONSTRAINT "PK_master_interview_status" PRIMARY KEY ("code")
      )
    `);

    // Create interviews table
    await queryRunner.query(`
      CREATE TABLE "interviews" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying(255) NOT NULL,
        "description" text,
        "is_archived" smallint NOT NULL DEFAULT 0,
        "master_interview_status_code" character varying(5),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "created_by_user_id" uuid,
        CONSTRAINT "PK_interviews" PRIMARY KEY ("id")
      )
    `);

    // Create interview_comments table
    await queryRunner.query(`
      CREATE TABLE "interview_comments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "interview_id" uuid,
        "created_by_user_id" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "comment" text,
        CONSTRAINT "PK_interview_comments" PRIMARY KEY ("id")
      )
    `);

    // Create interview_logs table
    await queryRunner.query(`
      CREATE TABLE "interview_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "interview_id" uuid,
        "created_by_user_id" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "title" character varying(255) NOT NULL,
        "description" text,
        "master_interview_status_code" character varying(5),
        CONSTRAINT "PK_interview_logs" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "interviews" 
      ADD CONSTRAINT "FK_interviews_master_interview_status" 
      FOREIGN KEY ("master_interview_status_code") 
      REFERENCES "master_interview_status"("code") 
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "interviews" 
      ADD CONSTRAINT "FK_interviews_created_by_user" 
      FOREIGN KEY ("created_by_user_id") 
      REFERENCES "users"("id") 
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "interview_comments" 
      ADD CONSTRAINT "FK_interview_comments_interview" 
      FOREIGN KEY ("interview_id") 
      REFERENCES "interviews"("id") 
      ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "interview_comments" 
      ADD CONSTRAINT "FK_interview_comments_created_by_user" 
      FOREIGN KEY ("created_by_user_id") 
      REFERENCES "users"("id") 
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "interview_logs" 
      ADD CONSTRAINT "FK_interview_logs_interview" 
      FOREIGN KEY ("interview_id") 
      REFERENCES "interviews"("id") 
      ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "interview_logs" 
      ADD CONSTRAINT "FK_interview_logs_created_by_user" 
      FOREIGN KEY ("created_by_user_id") 
      REFERENCES "users"("id") 
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "interview_logs" 
      ADD CONSTRAINT "FK_interview_logs_master_interview_status" 
      FOREIGN KEY ("master_interview_status_code") 
      REFERENCES "master_interview_status"("code") 
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // Insert initial data into master_interview_status
    await queryRunner.query(`
      INSERT INTO "master_interview_status" ("code", "title", "createdAt", "updatedAt") VALUES
      ('IS01', 'TODO', NOW(), NOW()),
      ('IS02', 'IN_PROGRESS', NOW(), NOW()),
      ('IS03', 'DONE', NOW(), NOW())
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints first
    await queryRunner.query(
      `ALTER TABLE "interview_logs" DROP CONSTRAINT "FK_interview_logs_master_interview_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "interview_logs" DROP CONSTRAINT "FK_interview_logs_created_by_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "interview_logs" DROP CONSTRAINT "FK_interview_logs_interview"`,
    );
    await queryRunner.query(
      `ALTER TABLE "interview_comments" DROP CONSTRAINT "FK_interview_comments_created_by_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "interview_comments" DROP CONSTRAINT "FK_interview_comments_interview"`,
    );
    await queryRunner.query(
      `ALTER TABLE "interviews" DROP CONSTRAINT "FK_interviews_created_by_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "interviews" DROP CONSTRAINT "FK_interviews_master_interview_status"`,
    );

    // Drop tables
    await queryRunner.query(`DROP TABLE "interview_logs"`);
    await queryRunner.query(`DROP TABLE "interview_comments"`);
    await queryRunner.query(`DROP TABLE "interviews"`);
    await queryRunner.query(`DROP TABLE "master_interview_status"`);
  }
}
