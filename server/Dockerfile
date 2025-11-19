FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY server ./server

EXPOSE 3001

CMD ["node", "server/app.js"]
