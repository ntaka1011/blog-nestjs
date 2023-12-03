import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnEmail1701504597594 implements MigrationInterface {
  name = 'AddColumnEmail1701504597594';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
  }
}
