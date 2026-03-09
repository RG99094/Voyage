FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package metadata
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the backend files
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Expose port (default is 5001 from .env but we map it explicitly)
EXPOSE 5001

# Start the server using the npm start script
CMD ["npm", "start"]
