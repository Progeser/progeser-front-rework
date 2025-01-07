# Utiliser une image Node.js
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers de dépendances dans le conteneur
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du code source de l'application
COPY . .

# Exécuter la commande de build
RUN npm run build

# Exposer le port de l'application
EXPOSE 3001

# Définir la commande par défaut pour démarrer l'application
CMD ["npm", "run", "dev"]
