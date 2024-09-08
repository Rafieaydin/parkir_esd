import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new rating.
 */
export const createRatingValidator = vine.compile(
  vine.object({})
)

/**
 * Validator to validate the payload when updating
 * an existing rating.
 */
export const updateRatingValidator = vine.compile(
  vine.object({})
)