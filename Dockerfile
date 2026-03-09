# Stage 1: Build the React application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package metadata and environment variables required for build
COPY package*.json ./
COPY .env ./

# Install ALL dependencies (including devDependencies required for Vite build)
RUN npm install

# Copy source code and build tools config
COPY . .

# Build the project
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output from Stage 1 to Nginx serve directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
