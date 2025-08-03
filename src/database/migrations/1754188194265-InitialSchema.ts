import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1754188194265 implements MigrationInterface {
    name = 'InitialSchema1754188194265'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "accountType" character varying NOT NULL, "department" character varying, "position" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_125e915cf23ad1cfb43815ce59b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_account_id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_e93e031a5fed190d4789b6bfd83" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_accounts" ADD CONSTRAINT "FK_e16c43f353aa7596f375245440a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_sessions" ADD CONSTRAINT "FK_95760eb545a604b216290948400" FOREIGN KEY ("user_account_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_sessions" DROP CONSTRAINT "FK_95760eb545a604b216290948400"`);
        await queryRunner.query(`ALTER TABLE "user_accounts" DROP CONSTRAINT "FK_e16c43f353aa7596f375245440a"`);
        await queryRunner.query(`DROP TABLE "user_sessions"`);
        await queryRunner.query(`DROP TABLE "user_accounts"`);
    }

}
