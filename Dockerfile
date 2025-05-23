# Build stage
FROM node:18 AS builder

WORKDIR /app
COPY ./soil-sensor-dashboard .

RUN npm install
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Add custom NGINX config to handle SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
