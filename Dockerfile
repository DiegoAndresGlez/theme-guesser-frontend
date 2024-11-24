FROM node:20.18-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the app
RUN pnpm run build

# Install `serve` to run the application
RUN npm install -g serve

# Expose port
EXPOSE $PORT

# Start the app - important to bind to 0.0.0.0
CMD serve dist -p $PORT --listen 0.0.0.0