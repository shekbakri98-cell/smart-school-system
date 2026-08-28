FROM node:20-alpine

# Set worker container boundary configurations
WORKDIR /usr/src/app

# Extract manifest files first to preserve layer cache
COPY package*.json ./

# Install production-only packages
RUN npm ci --only=production

# Copy express server script files
COPY . .

# Expose backend communication gateway mapping port
EXPOSE 5000

# Ignite production runtime engine 
CMD ["node", "server.js"]
