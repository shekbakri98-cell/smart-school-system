FROM node:20-alpine AS compilation-builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS web-delivery-service
RUN rm -rf /usr/share/nginx/html/*
COPY --from=compilation-builder /usr/src/app/dist /usr/share/nginx/html

# 💡 Inject your custom Nginx routing blueprint file
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
