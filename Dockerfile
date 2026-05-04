FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL=file:./prisma/data/dev.db
RUN mkdir -p prisma/data public/uploads && \
    npx prisma generate && \
    npx prisma db push --skip-generate && \
    npm install tsx && npx tsx scripts/seed.ts && \
    npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
ENV DATABASE_URL=file:./prisma/data/dev.db
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma/data ./prisma/data
RUN mkdir -p prisma/data public/uploads && chown -R nextjs:nodejs prisma/data public/uploads
VOLUME ["/app/prisma/data"]
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]