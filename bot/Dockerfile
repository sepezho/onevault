# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# (Optional) If you have a separate build step, you could do something like:
# RUN npm run build

# Expose the port if your app listens on a specific port, e.g. 3000
EXPOSE 3000

# Define the command to start your app
CMD ["npm", "start"]


