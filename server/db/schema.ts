import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const $users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('first_name').notNull(),
  email: text('email').notNull().unique(),
  age: integer('age'),
  sex: text('sex', { enum: ['male', 'female', 'other'] }).notNull(),
  createdAt: text('timestamp').default(sql`CURRENT_TIMESTAMP`)
})

export type UserSelect = typeof $users.$inferSelect
export type UserInsert = typeof $users.$inferInsert

export type UserField = keyof UserSelect
