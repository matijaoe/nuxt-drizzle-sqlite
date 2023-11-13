import { eq, sql } from 'drizzle-orm'
import { $users } from '../../db/schema'

export default defineEventHandler(async (event) => {
  try {
    const { age: ageParam } = getQuery(event) as { age: string }
    const age = Number.parseInt(ageParam, 10)
    const ageDefined = age && !Number.isNaN(age)

    const users = await db
      .select({
        name: $users.name,
        upperName: sql`upper(${$users.name})`,
        age: $users.age,
      })
      .from($users)
      .where(ageDefined ? eq($users.age, age) : undefined)

    return users
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    })
  }
})
