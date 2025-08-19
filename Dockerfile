# Dockerfile (Node app)
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Install deps
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# If you build TypeScript, build step:
RUN npm run build || echo "no build step"

# Production image
FROM node:18-alpine
WORKDIR /usr/src/app

ENV NODE_ENV=production
COPY --from=builder /usr/src/app ./

# Create uploads dir
RUN mkdir -p /usr/src/app/uploads && chown -R node:node /usr/src/app/uploads

USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]