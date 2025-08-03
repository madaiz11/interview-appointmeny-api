import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserEntityStructure1754193167222
  implements MigrationInterface
{
  name = 'UpdateUserEntityStructure1754193167222';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns first
    await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "avatarUrl" character varying`,
    );

    // Migrate data: combine firstName and lastName into name
    await queryRunner.query(
      `UPDATE "users" SET "name" = CONCAT("firstName", ' ', "lastName") WHERE "firstName" IS NOT NULL AND "lastName" IS NOT NULL`,
    );

    // Make name column NOT NULL after data migration
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL`,
    );

    // Drop old columns
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatarUrl"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "phone" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "lastName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "firstName" character varying NOT NULL`,
    );
  }
}
