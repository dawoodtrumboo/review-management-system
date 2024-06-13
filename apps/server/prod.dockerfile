# Stage 1: Development
FROM node:20-alpine AS development
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY --chown=node:node . .

# Use non-root user
USER node

# Stage 2: Build
FROM node:20-alpine AS build
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY --chown=node:node package*.json ./

# Copy node_modules from the development stage
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

# Copy all files
COPY --chown=node:node . .

# Build the application
RUN npm run build

# Clean up dependencies and install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Use non-root user
USER node

# Stage 3: Production
FROM node:20-alpine AS production
WORKDIR /usr/src/app

# Set environment variable
ENV NODE_ENV=production

# Copy production node_modules and build artifacts from the build stage
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Expose the application port (adjust if necessary)
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
