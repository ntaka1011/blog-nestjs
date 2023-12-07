import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldAvatarTableUser1701850728634
  implements MigrationInterface
{
  name = 'AddFieldAvatarTableUser1701850728634';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
  }
}
