# Use Node 20 Alpine
FROM node:20-alpine

WORKDIR /app

# Install build tools for Prisma / native modules
RUN apk add --no-cache python3 make g++ bash git libc6-compat

# Copy package files
COPY package.json package-lock.json ./

# Copy Prisma schema
COPY prisma ./prisma

# Install dependencies
RUN npm install --legacy-peer-deps

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the app
COPY . .

# Build Next.js
RUN npm run build

# Expose port
EXPOSE 3000
CMD ["npm", "start"]
