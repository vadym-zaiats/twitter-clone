/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/semi */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Db1711200040751 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Додаємо нове поле 'deleted' зі значенням за замовчуванням false до таблиці 'posts'
    await queryRunner.addColumn(
      "posts",
      new TableColumn({
        name: "deleted",
        type: "boolean",
        default: false,
      })
    );
    // Додаємо нове поле 'deleted' зі значенням за замовчуванням false до таблиці 'users'
    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "deleted",
        type: "boolean",
        default: false,
      })
    );
    // Перейменовуємо колонку 'title' на 'header' у таблиці 'posts'
    await queryRunner.renameColumn("posts", "title", "header");
    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "deleted",
        type: "boolean",
        default: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Зворотній захід: видаляємо поле 'deleted' з таблиці 'posts'
    await queryRunner.dropColumn("posts", "deleted");
    // Зворотній захід: видаляємо поле 'deleted' з таблиці 'users'
    await queryRunner.dropColumn("users", "deleted");
    // Зворотній захід: перейменовуємо колонку 'header' на 'title' у таблиці 'posts'
    await queryRunner.renameColumn("posts", "header", "title");
  }
}
