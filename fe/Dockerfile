FROM node:18-alpine AS build
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
CMD ["nginx", "-g", "daemon off;"]
