# Multi-stage Docker build for NestJS Interview Appointment API

# ===============================================
# 1. Development base image with all dependencies
# ===============================================
FROM node:20-alpine AS development

# Set working directory
WORKDIR /usr/src/app

# Install system dependencies for native modules
RUN apk add --no-cache python3 make g++ git

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ===============================================
# 2. Production base image optimized for size
# ===============================================
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nestjs -u 1001

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy built application from development stage
COPY --from=development /usr/src/app/dist ./dist

# Copy additional files needed at runtime
COPY --from=development /usr/src/app/src/database/migrations ./src/database/migrations
COPY --from=development /usr/src/app/src/database/seeders ./src/database/seeders
COPY --from=development /usr/src/app/typeorm.config.ts ./

# Change ownership to non-root user
RUN chown -R nestjs:nodejs /usr/src/app

# Switch to non-root user
USER nestjs

# Expose application port
EXPOSE 3000

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Default command
CMD ["node", "dist/src/main.js"]

# ===============================================
# 3. Development image for hot reload
# ===============================================
FROM development AS dev

# Install nodemon globally for development
RUN npm install -g nodemon

# Expose application port and debug port
EXPOSE 3000 9229

# Development command with hot reload
CMD ["npm", "run", "start:dev"]