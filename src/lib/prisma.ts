import { PrismaClient } from '@prisma/client'
import { execFileSync } from 'child_process'
import { existsSync } from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  dbReady: boolean
}

if (!globalForPrisma.dbReady && process.env.NODE_ENV === 'production') {
  globalForPrisma.dbReady = true
  const prismaIndex = '/app/node_modules/prisma/build/index.js'
  if (existsSync(prismaIndex)) {
    const dbUrl = process.env.DATABASE_URL ?? 'file:./prisma/data/dev.db'
    const dbPath = dbUrl.replace(/^file:/, '')
    const absDb = path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath)
    try {
      console.log('[db] pushing schema to', absDb)
      execFileSync('node', [prismaIndex, 'db', 'push', '--skip-generate'], {
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: 'file:' + absDb },
      })
    } catch (e) {
      console.error('[db] push failed:', (e as Error).message)
    }
  }
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
