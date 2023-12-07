import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetRefreshTokenDefault1701838197244 implements MigrationInterface {
  name = 'SetRefreshTokenDefault1701838197244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NOT NULL`,
    );
  }
}
