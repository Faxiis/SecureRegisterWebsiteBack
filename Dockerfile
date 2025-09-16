FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install -g typescript

# compiler TS en JS
RUN npx tsc

EXPOSE 3000

# Lancer le JS compilé
CMD ["node", "dist/index.js"]
