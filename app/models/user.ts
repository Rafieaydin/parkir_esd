import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany } from '@adonisjs/lucid/types/relations' // harus make type
import Todo from './todo.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare role: string | null

  @column()
  declare email: string

  @column()
  declare phone: string | null

  @column()
  declare dateOfBirth: string | null

  @column()
  declare gender: string | null

  @column()
  declare code_verification: string | null

  @column()
  declare email_code_verification: string | null

  @column({ serializeAs: null })
  declare password: string

  @hasMany(() => Todo, {
    foreignKey: 'user_id',
    localKey: 'id'
  })
  declare todos: HasMany<typeof Todo>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
