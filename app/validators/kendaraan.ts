import vine from '@vinejs/vine'

export const createKendaraanValidator = vine.compile(
  vine.object({
    jenis: vine.string(),
    nama_kendaraan: vine.string(),
    plat_nomor: vine.string(),
    user_id: vine.number()
  })
)

export const updateKendaraanValidator = vine.compile(
  vine.object({
    jenis: vine.string(),
    nama_kendaraan: vine.string(),
    plat_nomor: vine.string(),
    user_id: vine.number()
  })
)
