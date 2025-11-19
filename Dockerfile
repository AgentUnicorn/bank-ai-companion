# ---------------------------------
# 1. Build Stage (needs dev deps)
# ---------------------------------
FROM node:20-alpine AS builder

WORKDIR /app
ENV NODE_ENV=development

# Install ALL dependencies (including dev)
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Build the frontend
RUN npm run build


# ---------------------------------
# 2. Production Stage (Nginx)
# ---------------------------------
FROM nginx:alpine

ENV NODE_ENV=production

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
