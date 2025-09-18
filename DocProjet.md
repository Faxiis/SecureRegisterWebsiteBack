
# SecureRegisterWebSiteBack

## Description

Ce projet est un backend Node.js/Express sécurisé pour la gestion d’inscriptions et d’authentification d’utilisateurs, avec vérification de la robustesse des mots de passe, détection de fuites via Bloom filter, gestion des rôles (`user`/`admin`), protection par JWT, rate-limiting, CORS,.  
Il est conçu pour fonctionner avec une base PostgreSQL (via Prisma) et Docker.

---

## Fonctionnalités principales

- **Connexion à la base PostgreSQL** (via Prisma et Docker)
- **Inscription (`/auth/register`)** avec :
  - Vérification de la présence du username et du password
  - Vérification de la complexité du mot de passe (majuscule, chiffre, caractère spécial)
  - Vérification de l’entropie du mot de passe
  - Vérification contre une wordlist de fuites (Bloom filter)
  - Hashage du mot de passe (bcrypt)
- **Connexion (`/auth/login`)** avec génération d’un JWT contenant le rôle
- **Gestion des rôles (`user`/`admin`)** :  
  - Stocké dans la base et dans le JWT
  - Middleware pour protéger les routes réservées aux admins
- **Routes utilisateurs (`/users`)** :
  - Liste des utilisateurs (protégée par JWT)
  - Détail d’un utilisateur par id (protégée par JWT)
- **Route admin (`/admin/dashboard`)** :
  - Accessible uniquement aux admins (JWT + middleware de rôle)
- **Bloom filter (`/bloom`)** :
  - Génération du filtre à partir d’une wordlist
  - Vérification si un mot de passe a fuité
- **Sécurité** :
  - CORS restreint
  - Rate limiting global
  - JWT pour l’authentification
- **Prise en charge Docker Compose** pour la base et le backend

---

## Installation & Lancement

### 1. **Cloner le repo et installer les dépendances**

```sh
npm install
```

### 2. **Configurer l’environnement**

Créer un fichier `.env` à la racine :

```
DATABASE_URL=postgresql://user:password@db:5432/secure_register
JWT_SECRET=une_clé_secrète
```

### 3. **Lancer avec Docker Compose**

```sh
docker compose up --build
```

### 4. **Initialiser la base de données**

Dans un autre terminal :

```sh
docker compose exec backend npx prisma migrate dev --name init
```

---

## Utilisation des routes

### Authentification

- **POST `/auth/register`**
  - Body : `{ "username": "foo", "password": "Bar123!" }`
  - Vérifie la force du mot de passe, l’entropie, et la fuite via Bloom filter (bloque si fuité)
- **POST `/auth/login`**
  - Body : `{ "username": "foo", "password": "Bar123!" }`
  - Retourne un JWT contenant le rôle

### Utilisateurs

- **GET `/users`**  
  - Protégée par JWT
- **GET `/users/:id`**  
  - Protégée par JWT

### Admin

- **GET `/admin/dashboard`**  
  - Protégée par JWT et rôle `admin`

### Bloom Filter

- **POST `/bloom/cache`**  
  - Body : `{ "path": "wordlist/wordlist.txt" }`
  - Charge une wordlist pour le Bloom filter
- **GET `/bloom/check?word=motdepasse`**  
  - Vérifie si le mot de passe a fuité

---

## Sécurité

- **CORS** : configurable, restreint à l’origine du front
- **Rate limiting** : 100 requêtes/15min/IP
- **JWT** : authentification et gestion des rôles
- **Session/cookie** : exemple fourni (optionnel)
- **Hashage des mots de passe** : bcrypt

---

## Gestion des rôles

- Le champ `role` est ajouté à chaque utilisateur (`user` par défaut, `admin` possible)
- Le rôle est inclus dans le JWT
- Middleware `requireRole("admin")` pour protéger les routes sensibles

---


## Tests

- Des exemples de tests d’intégration/unitaires sont fournis (voir `/src/__tests__`)
- Utilisez Postman pour tester manuellement toutes les routes

---

## Exemples de consignes réalisées

- Connexion backend ↔ DB (Docker)
- Auth routes (`/auth/register`, `/auth/login`)
- Users routes (`/users`, `/users/:id`)
- Sécurisation : CORS, rate-limiting, JWT, session/cookie
- Gestion des rôles et protection des routes admin
- Vérification de fuite de mot de passe via Bloom filter
- Tests manuels et automatisés

---
