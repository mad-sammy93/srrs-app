FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and lock files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Nuxt application
RUN npm run build

# -- Production Image --
FROM node:18-alpine

WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /app .

# Set environment variable for production
ENV NODE_ENV=development

# Expose the Nuxt server port (default: 3000)
EXPOSE 3000

# Start the Nuxt server
CMD ["npm", "run", "dev"]
