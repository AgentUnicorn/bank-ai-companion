# ----------------------------
# 1. Build Stage
# ----------------------------
FROM node:20-alpine AS builder

ENV NODE_ENV=production
WORKDIR /app

# Copy package and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project
COPY . .

# Build Vite for production
RUN npm run build


# ----------------------------
# 2. Run Stage (Nginx)
# ----------------------------
FROM nginx:alpine

ENV NODE_ENV=production

# Copy built frontend (dist) from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
