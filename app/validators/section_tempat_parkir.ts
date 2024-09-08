import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new section tempat parkir.
 */
export const createSectionTempatParkirValidator = vine.compile(
  vine.object({
    nama: vine.string(),
    jenis: vine.string(),
    harga_per_menit : vine.number(),
    denda_per_menit : vine.number(),
    tempat_parkir_id: vine.number(),
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
    harga_per_menit : vine.number(),
    denda_per_menit : vine.number(),
    tempat_parkir_id: vine.number()
  })
)
