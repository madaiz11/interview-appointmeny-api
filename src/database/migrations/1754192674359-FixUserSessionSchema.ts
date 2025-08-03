import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixUserSessionSchema1754192674359 implements MigrationInterface {
  name = 'FixUserSessionSchema1754192674359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_sessions" DROP CONSTRAINT "FK_95760eb545a604b216290948400"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_sessions" DROP COLUMN "user_account_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_sessions" ADD "userId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_sessions" ADD CONSTRAINT "UQ_55fa4db8406ed66bc7044328427" UNIQUE ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_sessions" ADD "isActive" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_sessions" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_sessions" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_accounts" DROP CONSTRAINT "FK_e16c43f353aa7596f375245440a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD CONSTRAINT "UQ_e16c43f353aa7596f375245440a" UNIQUE ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_sessions" ADD CONSTRAINT "FK_55fa4db8406ed66bc7044328427" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD CONSTRAINT "FK_e16c43f353aa7596f375245440a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_accounts" DROP CONSTRAINT "FK_e16c43f353aa7596f375245440a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_sessions" DROP CONSTRAINT "FK_55fa4db8406ed66bc7044328427"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_accounts" DROP CONSTRAINT "UQ_e16c43f353aa7596f375245440a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD CONSTRAINT "FK_e16c43f353aa7596f375245440a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_sessions" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_sessions" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_sessions" DROP COLUMN "isActive"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_sessions" DROP CONSTRAINT "UQ_55fa4db8406ed66bc7044328427"`,
    );
    await queryRunner.query(`ALTER TABLE "user_sessions" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "user_sessions" ADD "user_account_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_sessions" ADD CONSTRAINT "FK_95760eb545a604b216290948400" FOREIGN KEY ("user_account_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
