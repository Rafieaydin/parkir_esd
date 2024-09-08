import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payment_bookings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('payment_method').notNullable()
      table.string('payment_status').notNullable()
      //table.string('payment_amount').notNullable()
      //table.string('payment_code').notNullable()
      //table.string('payment_expired').notNullable()
      table.string('payment_time').notNullable()
      table.string('payment_amount').notNullable()
      //table.string('payment_status_code').notNullable()
      //table.string('payment_status_raw').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at').nullable()
      table.integer('booking_id').unsigned().references('id').inTable('bookings').onDelete('CASCADE').onUpdate('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
