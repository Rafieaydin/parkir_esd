import factory from '@adonisjs/lucid/factories'
import Kendaraan from '#models/kendaraan'

export const KendaraanFactory = factory
  .define(Kendaraan, async ({ faker }) => {
    return {
      plat_nomor: faker.vehicle.vrm(),
      nama_kendaraan: faker.vehicle.model(),
      jenis_kendaraan: faker.helpers.arrayElement(['mobil', 'motor']),
      user_id: 1,
    }
  })
  .build()
