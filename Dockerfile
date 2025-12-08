# Use Alpine but pin version to avoid python issues
FROM node:20-alpine3.18

WORKDIR /app

# Install required build tools for bcrypt, prisma, etc.
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

# Copy only package files first (better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
