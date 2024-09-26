import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new rating.
 */
export const createRatingValidator = vine.compile(
  vine.object({
    user_id: vine.number(),
    section_parkir_id: vine.number(),
    rating: vine.number(),
    review: vine.string()
  })
)

/**
 * Validator to validate the payload when updating
 * an existing rating.
 */
export const updateRatingValidator = vine.compile(
  vine.object({
    user_id: vine.number(),
    section_parkir_id: vine.number(),
    rating: vine.number(),
    review: vine.string()
  })
)
