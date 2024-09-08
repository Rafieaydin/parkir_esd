import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new slot section tempat parkir.
 */
export const createSlotSectionTempatParkirValidator = vine.compile(
  vine.object({
    section_parkir_id : vine.number(),
    kode_slot : vine.string(),
    batas_waktu : vine.number(),
    lantai_slot : vine.number(),
    kapasitas : vine.number(),
    status : vine.string(),
    terisi : vine.number()
  })
)

/**
 * Validator to validate the payload when updating
 * an existing slot section tempat parkir.
 */
export const updateSlotSectionTempatParkirValidator = vine.compile(
  vine.object({
    section_parkir_id : vine.number(),
    kode_slot : vine.string(),
    batas_waktu : vine.number(),
    lantai_slot : vine.number(),
    kapasitas : vine.number(),
    status : vine.string(),
    terisi : vine.number()
  })
)
