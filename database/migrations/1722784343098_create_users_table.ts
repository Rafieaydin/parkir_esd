import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('photo').nullable()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('phone').nullable()
      table.string('code_verification').nullable()
      table.string('email_code_verification').nullable()
      table.string('date_of_birth').nullable()
      table.string('gender').nullable()
      table.string('password').notNullable()
      table.string('role').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
