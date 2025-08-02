# Use the official Bun runtime as base image
FROM oven/bun:latest

# Set the working directory in the container
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3002

# Define the command to run the application
CMD ["bun", "run", "src/index.tsx"]
