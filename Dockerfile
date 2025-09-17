FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install


RUN npm install -g typescript

COPY . .

# GÉNÈRE LE CLIENT PRISMA
RUN npx prisma generate

# compiler TS en JS
RUN npx tsc

EXPOSE 3000

# Lancer le JS compilé
CMD ["node", "dist/index.js"]
