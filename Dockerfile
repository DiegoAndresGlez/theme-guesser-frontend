# Build stage
FROM node:20.18-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy source code
COPY . .

# Build the React application
RUN pnpm build

# Production stage
FROM node:20.18-alpine
WORKDIR /app

# Install serve package globally and bash (needed for the script)
RUN apk add --no-cache bash && \
    npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY start.sh ./start.sh

# Make the script executable
RUN chmod +x ./start.sh

# Cloud Run will use the PORT environment variable
ENV PORT=8080

# Start using the bash script
CMD ["/app/start.sh"]