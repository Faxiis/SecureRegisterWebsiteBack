# Étape 1 : image Node.js
FROM node:20-alpine

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code
COPY . .

# Installer ts-node globalement
RUN npm install -g ts-node typescript

# Exposer le port
EXPOSE 3000

# Lancer le serveur
CMD ["ts-node", "src/index.ts"]
