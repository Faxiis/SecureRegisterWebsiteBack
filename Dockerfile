FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN npm install -g typescript

COPY . .

# /!\ Le fichier /rockyou/rockyou.txt est une wordliste de teste
# /!\ Pensez à mettre le chemin de la liste à utiliser (exemple : wordlist/wordlist.txt)
# /!\ Pour générer le cache : POST http://localhost:3000/bloom/cach | { "path": "wordlist" }
COPY wordlist ./wordlist

# Générer le client Prisma
RUN npx prisma generate

# Compiler le TypeScript en JS
RUN npx tsc

EXPOSE 3000

CMD ["node", "dist/index.js"]
