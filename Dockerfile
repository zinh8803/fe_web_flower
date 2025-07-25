# Dockerfile
FROM node:20

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install PNPM and dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy source code
COPY . .

# Vite runs on port 5173
EXPOSE 5173

# Start dev server
CMD ["pnpm", "dev"]
