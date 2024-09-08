import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new tempat parkir.
 */
export const createTempatParkirValidator = vine.compile(
  vine.object({
    nama: vine.string(),
    alamat: vine.string(),
    kapasitas: vine.number(),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing tempat parkir.
 */
export const updateTempatParkirValidator = vine.compile(
  vine.object({
    nama: vine.string(),
    alamat: vine.string(),
    kapasitas: vine.number()
  })
)
