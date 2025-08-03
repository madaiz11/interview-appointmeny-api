import * as bcrypt from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordToUsers1754190380654 implements MigrationInterface {
  name = 'AddPasswordToUsers1754190380654';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add password column as nullable first
    await queryRunner.query(
      `ALTER TABLE "users" ADD "password" character varying`,
    );

    // Set default password for existing users
    const hashedPassword = await bcrypt.hash('password123', 10);
    await queryRunner.query(
      `UPDATE "users" SET "password" = $1 WHERE "password" IS NULL`,
      [hashedPassword],
    );

    // Make password column non-nullable
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
  }
}
