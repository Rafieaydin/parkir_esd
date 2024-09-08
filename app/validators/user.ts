import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new user.
 */
export const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string(), // default required
    email: vine.string().email(),
    password: vine.string().trim().minLength(6),
    phone: vine.string().optional(),
    dateOfBirth: vine.string().optional(),
    gender: vine.string().optional(),
    role: vine.string().optional()
  })
)

/**
 * Validator to validate the payload when updating
 * an existing user.
 */
export const updateUserValidator = vine.compile(
  vine.object({
    fullName: vine.string(), // default required
    email: vine.string().email(),
    password: vine.string().trim().minLength(6),
    phone: vine.string().optional(),
    dateOfBirth: vine.string().optional(),
    gender: vine.string().optional(),
    role: vine.string().optional()
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().trim().minLength(6),
  })
)

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string(), // default required
    email: vine.string().email(),
    password: vine.string().trim().minLength(6),
    repeat_password: vine.string().trim().minLength(6),
    phone: vine.string().optional(),
    dateOfBirth: vine.string().optional(),
    gender: vine.string().optional(),
    role: vine.string().optional()
  })
)

export const verifyEmailValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    code: vine.string().trim().minLength(5)
  })
)

export const verifyPhoneValidator = vine.compile(
  vine.object({
    phone: vine.string().trim().minLength(10),
    code: vine.string().trim().minLength(5)
  })
)


export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email()
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().trim().minLength(6),
    repeat_password: vine.string().trim().minLength(6),
    code: vine.string().trim().minLength(5)
  })
)

export const resendCodePhoneValidator = vine.compile(
  vine.object({
    phone: vine.string().trim().minLength(10)
  })
)

export const resendCodeEmailValidator = vine.compile(
  vine.object({
    email: vine.string().email()
  })
)
