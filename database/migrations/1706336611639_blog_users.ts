import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'blogs'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('author')
      table
        .integer("user_id")
        .notNullable()
        .unsigned()
        .references("users.id")
        .onDelete("CASCADE")
        .after("image");
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("author");
      table.dropForeign('user_id')
      table.dropColumn('user_id')
    })
  }
}
