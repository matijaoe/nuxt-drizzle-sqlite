import type { UserInsert } from '~/server/db/schema'
import { $users } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const newUser: UserInsert = {
      ...body
    }
    const result = await db.insert($users).values(newUser)
    return result
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    })
  }
})
