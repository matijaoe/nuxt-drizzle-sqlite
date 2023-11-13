import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config()

export default {
  out: './server/db/migrations',
  schema: './server/db/schema.ts',
  driver: 'better-sqlite',
  dbCredentials: {
    url: './sqlite.db',
  }
} satisfies Config
