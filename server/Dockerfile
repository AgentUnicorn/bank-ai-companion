FROM node:20-alpine AS base

ENV NODE_ENV=production
WORKDIR /app

COPY server/package*.json ./
RUN npm install --production

COPY server ./

EXPOSE 3001

CMD ["node", "app.js"]
