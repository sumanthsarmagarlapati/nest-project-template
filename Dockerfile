# Use official Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the project
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]
