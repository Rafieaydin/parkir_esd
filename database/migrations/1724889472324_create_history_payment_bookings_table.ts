import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'history_payment_bookings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      //table.integer('history_booking_id').unsigned().references('id').inTable('history_bookings').onDelete('CASCADE')
      table.string('payment_method').notNullable()
      table.string('payment_status').notNullable()
      table.string('payment_time').notNullable()
      table.string('payment_amount').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
