FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ bash git libc6-compat

COPY package.json package-lock.json ./
COPY . .

RUN npm install --legacy-peer-deps --ignore-scripts
RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "run", "dev"]
