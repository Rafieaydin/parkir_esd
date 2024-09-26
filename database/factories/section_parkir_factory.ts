import factory from '@adonisjs/lucid/factories'
import SectionParkir from '#models/section_parkir'

export const SectionParkirFactory = factory
  .define(SectionParkir, async ({ faker }) => {

    return {
      nama: faker.word.words(3),
      tempat_parkir_id: faker.helpers.arrayElement([1,2,3,4,5]),
      jenis: faker.helpers.arrayElement(['mobil', 'motor']),
      harga_per_jam: faker.number.int(100000),
      denda_per_jam: faker.number.int(100000),
      promo: "0"
      //createdAt: faker.date({ year: 2021 }),
    }
  })
  .build()
