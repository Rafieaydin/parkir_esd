import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'section_parkirs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nama').notNullable()
      table.integer('tempat_parkir_id').unsigned().references('id').inTable('tempat_parkirs').onDelete('CASCADE')
      table.enum('jenis', ['motor', 'mobil']).notNullable()
      table.integer('harga_per_menit').notNullable()
      table.integer('denda_per_menit').notNullable()
      //table.integer('kapasitas').notNullable()
      //table.integer('tarif').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
