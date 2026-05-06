export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { execSync } = await import('child_process')
    const { existsSync } = await import('fs')

    const prismaPath = '/app/node_modules/prisma/build/index.js'
    const prismaBin = existsSync(prismaPath) ? prismaPath : 'prisma'

    try {
      console.log('[startup] Applying database schema...')
      execSync(`node ${prismaBin} db push --skip-generate`, {
        stdio: 'inherit',
        env: { ...process.env },
      })
      console.log('[startup] Schema applied.')
    } catch (e) {
      console.error('[startup] db push failed:', e)
    }

    try {
      const seedPath = '/app/scripts/seed-safe.js'
      if (existsSync(seedPath)) {
        console.log('[startup] Running seed...')
        execSync(`node ${seedPath}`, {
          stdio: 'inherit',
          env: { ...process.env },
        })
        console.log('[startup] Seed done.')
      }
    } catch (e) {
      console.error('[startup] Seed failed:', e)
    }
  }
}
