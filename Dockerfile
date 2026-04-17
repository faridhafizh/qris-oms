FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Create directory for uploads
RUN mkdir -p src/public/uploads

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
