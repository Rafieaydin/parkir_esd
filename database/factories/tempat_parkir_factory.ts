import factory from '@adonisjs/lucid/factories'
import TempatParkir from '#models/tempat_parkir'

export const TempatParkirFactory = factory
  .define(TempatParkir, async ({ faker }) => {
    return {
      nama: faker.lorem.words(3),
      alamat: faker.word.sample(['1','2','3','4','5']),
      kapasitas: faker.number.int(20)
    }
  })
  .build()
