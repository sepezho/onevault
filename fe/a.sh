#!/bin/bash

# Global variables
PASTE_NAME=$1  # Name of the service (passed as the first argument)
PASTE_DOMAIN=$2  # Domain (passed as the second argument)

# Check if all required arguments are provided
if [ -z "$PASTE_NAME" ] || [ -z "$PASTE_DOMAIN" ]; then
  echo "Usage: $0 <service_name> <domain>"
  exit 1
fi

# Step 1: Add Dockerfile content to ./Dockerfile
DOCKERFILE_CONTENT="FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/build .

# Adjust the path in index.html to use relative links
RUN sed -i 's|/new-landing/static|./static|g' index.html

EXPOSE 80
CMD [\"nginx\", \"-g\", \"daemon off;\"]"

DOCKERFILE_PATH="./Dockerfile"

echo "$DOCKERFILE_CONTENT" > "$DOCKERFILE_PATH"
echo "Dockerfile updated successfully."

# Step 2: Add workflow configuration to ./.github/workflows/build.yml
WORKFLOW_PATH=".github/workflows/build.yml"
mkdir -p $(dirname "$WORKFLOW_PATH")

WORKFLOW_CONTENT="name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger workflow on push to the main branch

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      # Step 1: Checkout the code from the repository
      - name: Checkout code
        uses: actions/checkout@v2

      # Step 2: Log in to Docker Hub
      - name: Log in to Docker Hub
        uses: docker/login-action@v2
        with:
          username: \${{ secrets.DOCKER_USERNAME }}
          password: \${{ secrets.DOCKER_PASSWORD }}

      # Step 3: Build and push the Docker image to Docker Hub
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: \${{ secrets.DOCKER_USERNAME }}/$PASTE_NAME:latest"

echo "$WORKFLOW_CONTENT" > "$WORKFLOW_PATH"
echo "GitHub workflow configuration added successfully."

# Print success message
echo "Script executed successfully:
- Dockerfile created at $DOCKERFILE_PATH
- GitHub Actions workflow created at $WORKFLOW_PATH"
