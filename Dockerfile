# Use Node.js 23 as requested
FROM node:23-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if it exists)
COPY package*.json ./

# Install only production dependencies
# Note: --experimental-strip-types does not require devDependencies to be present at runtime
RUN npm install --omit=dev

# Copy the rest of the application
COPY . .

# Create the public directory if it doesn't exist (though COPY . . should have it)
RUN mkdir -p public

# Expose port
EXPOSE 3000

# Run the application directly with type stripping
CMD ["node", "--experimental-strip-types", "server.ts"]
