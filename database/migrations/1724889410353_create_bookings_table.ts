import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bookings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
      table.string('kode_booking').notNullable()
      table.dateTime('tanggal_booking').notNullable()
      // table.string('status').notNullable()
      table.integer('total_bayar').notNullable()
      table.integer('denda').notNullable()
      table.integer('total_bayar_denda').notNullable()
      table.integer('total_bayar_semua').notNullable()
      table.enum('status', ['pending', 'selesai', 'batal']).notNullable()
      table.integer('berapa_lama_jam').notNullable()
      //table.integer('payment_id').unsigned().references('id').inTable('payment_bookings').onDelete('CASCADE').onUpdate('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
