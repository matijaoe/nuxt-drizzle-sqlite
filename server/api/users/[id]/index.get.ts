import { eq } from 'drizzle-orm'
import { $users } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params!.id as string

    const userId = Number.parseInt(id, 10)

    const user = db.select().from($users).where(eq($users.id, userId)).get()

    return user
  } catch (err: any) {
    throw createError({
      statusCode: 400,
      statusMessage: err.message,
    })
  }

  return {

  }
})
