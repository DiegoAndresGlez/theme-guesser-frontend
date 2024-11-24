# First stage: Build the React application
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

# Second stage: Serve the application using Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy built files from builder stage
COPY --from=builder /app/dist .

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf


# Expose port 8080 (Cloud Run requirement)
EXPOSE 8000

# Use shell form for CMD to allow environment variable substitution
CMD ["nginx", "-g", "daemon off;"]
