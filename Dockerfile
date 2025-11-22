FROM node:20-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start dev server with database push
CMD ["sh", "-c", "npx prisma db push && npm run dev"]

