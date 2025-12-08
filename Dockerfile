# ----- BUILD STAGE -----
FROM node:22-alpine AS builder
WORKDIR /app

# Install build dependencies for sqlite3 / mikroORM sqlite
RUN apk add --no-cache python3 make g++ sqlite-dev

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# ----- RUNTIME STAGE -----
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache sqlite-dev

COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "start"]
