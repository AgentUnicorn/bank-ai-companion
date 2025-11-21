# ---------------------------------
# 1. Build Stage (needs dev deps)
# ---------------------------------
FROM node:20-alpine AS builder

WORKDIR /app
ENV NODE_ENV=development

# Accept build args
ARG VITE_SERVER_URL
ARG VITE_OPENAI_API_KEY
ARG VITE_OPENAI_REALTIME_MODEL
ARG VITE_OPENAI_TRANSCRIPT_MODEL
ARG VITE_BANKING_MCP_SERVER_URL
ARG VITE_BANKING_MCP_AUTH_TOKEN
ARG VITE_USERNAME
ARG VITE_PASSWORD

# Make them available as environment variables during build
ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_OPENAI_API_KEY=$VITE_OPENAI_API_KEY
ENV VITE_OPENAI_REALTIME_MODEL=$VITE_OPENAI_REALTIME_MODEL
ENV VITE_OPENAI_TRANSCRIPT_MODEL=$VITE_OPENAI_TRANSCRIPT_MODEL
ENV VITE_BANKING_MCP_SERVER_URL=$VITE_BANKING_MCP_SERVER_URL
ENV VITE_BANKING_MCP_AUTH_TOKEN=$VITE_BANKING_MCP_AUTH_TOKEN
ENV VITE_USERNAME=$VITE_USERNAME
ENV VITE_PASSWORD=$VITE_PASSWORD

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
