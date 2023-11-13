import { eq } from 'drizzle-orm'
import type { UserInsert } from '~/server/db/schema'
import { $users } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.params?.id as string
    const body = await readBody(event)
    const editUser: UserInsert = {
      ...body
    }
    delete editUser.id

    type UserInsertField = keyof UserInsert

    const res = db
      .update($users)
      .set(editUser)
      .where(eq($users.id, Number.parseInt(userId)))
      .returning({
        updated: (Object.keys(editUser) as UserInsertField[])
          .reduce((acc: Record<UserInsertField, any>, field: UserInsertField) => {
            acc[field] = $users[field]
            return acc
          }, {} as Record<UserInsertField, any>)
      })
      .get()

    return res
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    })
  }
})
