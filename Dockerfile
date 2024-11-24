# Build stage
FROM node:20.18-alpine AS builder
WORKDIR /app

ARG VITE_SUPABASE_KEY
ARG VITE_SUPABASE_URL
ARG VITE_BACKEND_URL

ENV VITE_SUPABASE_KEY=$VITE_SUPABASE_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

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

# Install serve package globally
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Cloud Run will use the PORT environment variable
ENV PORT=8080

# Start the server
CMD ["serve", "-s", "dist", "-l", "8080"]