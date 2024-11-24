FROM node:20.18-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy source code
COPY . /app/

# Build the React application
# RUN pnpm run build

RUN pnpm build

# Production stage
FROM node:20.18-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port Cloud Run will use
EXPOSE 8080

# Start the server
CMD ["npm", "start"]