# Rituels 

Un jeu de cartes multijoueur en temps réel. Affrontez vos amis, jouez des cartes pour gagner des points, et interagissez via le chat intégré !

🌐 **Jouer en ligne :** [https://rituels.xiao-web.com/](https://rituels.xiao-web.com/)


## 🚀 Fonctionnalités

- **Multijoueur en temps réel** : Synchronisation fluide des parties grâce à Socket.io.
- **Logique de jeu sécurisée** : Les calculs de score et la génération de cartes sont entièrement gérés côté serveur. Le serveur identifie chaque joueur par son socket (jamais par un id envoyé par le client), vérifie le tour et que la carte jouée est bien dans son deck (anti-triche). Un joueur ne peut être que dans une seule partie à la fois (création et adhésion refusées sinon). Les règles secrètes, les mains des autres joueurs et les identifiants de session ne sont jamais envoyés aux clients : les règles ne sont révélées qu'à la fin de la partie.
- **Chat intégré** : Discutez avec les autres joueurs dans le lobby et pendant la partie (avec défilement automatique). Les pseudos (10 caractères max) et messages (300 max, 1 par seconde) sont modérés par un LLM (Groq).
- **Interface dynamique et réactive** : Animations fluides avec Framer Motion et design moderne.
- **Système de sessions** : Sauvegarde locale de votre pseudonyme et détection automatique des nouveaux joueurs pour l'animation d'introduction.

## 🛠️ Stack Technique

- **Frontend** : Next.js (React), TypeScript, Tailwind CSS, Framer Motion, Socket.io-client.
- **Backend** : Node.js, Express, Socket.io, Groq (modération).

## 💻 Installation et Lancement local

### Prérequis
- [Node.js](https://nodejs.org/) (v18 ou supérieur recommandé)
- npm ou yarn

### 1. Démarrer le Backend (Serveur)
Ouvrez un terminal à la racine du projet :
```bash
cd backend
npm install
npm run dev
```
Variables d'environnement du backend :
- `GROQ_API_KEY` (**obligatoire**) : clé API Groq pour la modération ; `GROQ_MODEL` (optionnel).
- `PORT` (défaut `4000`) ; `ALLOWED_ORIGINS` (optionnel, origines CORS séparées par des virgules).

Le frontend contacte le backend via `NEXT_PUBLIC_SOCKET_URL` (défaut `http://localhost:4000`).

Tests du backend : `npm test` (à la racine du projet ou dans `backend/`). Tests du frontend : `npm test` dans `frontend/` (hooks et gestion des events serveur ; les écrans sont vérifiés à la main).

### 2. Démarrer le Frontend (Client)
Ouvrez un nouveau terminal :
```bash
cd frontend
npm install
npm run dev
```
L'application frontend sera accessible sur [http://localhost:3000](http://localhost:3000).

## 🌍 Déploiement

- **Hébergement** : Le frontend et le backend sont hébergés chez [Hostinger](https://www.hostinger.com/). *(Note : Le backend utilise directement les variables `process.env` en production).*
