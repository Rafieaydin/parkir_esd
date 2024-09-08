import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'slot_bookings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('booking_id').unsigned().references('id').inTable('bookings').onDelete('CASCADE')
      table.integer('slot_parkir_id').unsigned().references('id').inTable('slot_parkirs').onDelete('CASCADE')
      table.dateTime('check_in').notNullable()
      table.dateTime('check_out').notNullable()
      table.boolean('is_checked_out').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
