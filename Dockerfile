FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . /app/

# Expose API port
EXPOSE 4000

# Start the server
CMD ["npm", "start"]