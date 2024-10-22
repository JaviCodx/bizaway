# Stage 1: Dependencies
FROM node:22-slim AS deps
WORKDIR /app

# Install Python and build tools
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm install

# Stage 2: Builder
FROM node:22-slim AS builder
WORKDIR /app

# Copy from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./
COPY --from=deps /app/tsconfig*.json ./

# Copy source code
COPY . .

# Build the TypeScript project
RUN npm run build

# Stage 3: Runner
FROM node:22-slim AS runner
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy db
COPY db ./db

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]