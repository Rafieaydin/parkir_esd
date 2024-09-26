import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'kendaraans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('plat_nomor').notNullable()
      table.string('nama_kendaraan').notNullable()
      table.string('jenis_kendaraan').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
