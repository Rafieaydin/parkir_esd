import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new section tempat parkir.
 */
export const createSectionTempatParkirValidator = vine.compile(
  vine.object({
    nama: vine.string(),
    jenis: vine.string(),
    harga_per_jam : vine.number(),
    denda_per_jam : vine.number(),
    tempat_parkir_id: vine.number(),
    promo: vine.string()
  })
)

/**
 * Validator to validate the payload when updating
 * an existing section tempat parkir.
 */
export const updateSectionTempatParkirValidator = vine.compile(
  vine.object({
    nama: vine.string(),
    jenis: vine.string(),
    harga_per_jam : vine.number(),
    denda_per_jam : vine.number(),
    tempat_parkir_id: vine.number(),
    promo: vine.string()
  })
)
