import { eq } from 'drizzle-orm'
import { z } from 'zod'
import type { UserField, UserInsert } from '~/server/db/schema'
import { $users } from '~/server/db/schema'
import { userUpdateSchema } from '~/server/schemas/user-schema'

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.params?.id as string
    const body = await readBody(event)

    // eslint-disable-next-line unused-imports/no-unused-vars
    const { id, ...editUser }: UserInsert = { ...body }

    const validatedUser = userUpdateSchema.parse(body)

    const res = db
      .update($users)
      .set(validatedUser)
      .where(eq($users.id, Number.parseInt(userId)))
      .returning({
        updated: (Object.keys(editUser) as UserField[])
          .reduce((acc: Record<UserField, any>, field: UserField) => {
            acc[field] = $users[field]
            return acc
          }, {} as Record<UserField, any>),
      })
      .get()

    if (!res) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
        name: 'UserNotFoundError',
      })
    }

    return {
      ...res,
      id: userId,
    }
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map((error: z.ZodIssue) => {
        if (!error.path?.length) {
          return error.message
        }
        return `Field <${error.path.join('.')}>: ${error.message}`
      })
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation error',
        message: errorMessages.join('; '),
      })
    } else if (err.cause?.name === 'UserNotFoundError') {
      throw err
    } else if (err.cause.message === 'Invalid JSON body') {
      throw createError({
        statusCode: 400,
      })
    } else {
      throw createError({
        statusCode: 500,
        message: err.message
      })
    }
  }
})
