import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'slot_parkirs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('lantai_slot').notNullable()
      table.string('kode_slot').notNullable()
      table.integer('section_parkir_id').unsigned().references('id').inTable('section_parkirs').onDelete('CASCADE').onUpdate('CASCADE')
      //table.integer('harga').notNullable()
      table.integer('terisi').notNullable()
      table.enum('status', ['kosong', 'terisi']).notNullable()
      table.integer('batas_waktu').notNullable()
      table.integer('kapasitas').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
