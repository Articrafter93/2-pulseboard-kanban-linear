FROM node:20-alpine AS deps
WORKDIR /service
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /service
COPY --from=deps /service/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /service
ENV NODE_ENV=production
COPY --from=builder /service/dist ./dist
COPY --from=builder /service/package*.json ./
COPY --from=builder /service/node_modules ./node_modules
EXPOSE 4001
CMD ["npm", "run", "start"]