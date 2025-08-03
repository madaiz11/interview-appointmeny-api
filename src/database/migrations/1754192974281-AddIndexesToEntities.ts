import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexesToEntities1754192974281 implements MigrationInterface {
  name = 'AddIndexesToEntities1754192974281';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "active_user_session_index" ON "user_sessions" ("userId", "isActive") `,
    );
    await queryRunner.query(
      `CREATE INDEX "active_user_index" ON "users" ("email", "isActive") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."active_user_index"`);
    await queryRunner.query(`DROP INDEX "public"."active_user_session_index"`);
  }
}
