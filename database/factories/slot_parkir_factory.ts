import factory from '@adonisjs/lucid/factories'
import SlotParkir from '#models/slot_parkir'

export const SlotParkirFactory = factory
  .define(SlotParkir, async ({ faker }) => {
    return {
      section_parkir_id: faker.helpers.arrayElement(['1','2','3','4','5']),
      kode_slot: faker.word.words(3),
      //harga : faker.number.int(100000),
      batas_waktu: faker.number.int(100000),
      lantai_slot : faker.number.int(10),
      kapasitas : faker.number.int(10),
      terisi : faker.number.int(10),
      status: faker.word.sample(['kosong', 'terisi']),
    }
  })
  .build()
