# Rituels 🔮

Un jeu de cartes multijoueur en temps réel. Affrontez vos amis, jouez des cartes pour gagner des points, et interagissez via le chat intégré !

🌐 **Jouer en ligne :** [https://rituels.xiao-web.com/](https://rituels.xiao-web.com/)


## 🚀 Fonctionnalités

- **Multijoueur en temps réel** : Synchronisation fluide des parties grâce à Socket.io.
- **Logique de jeu sécurisée** : Les calculs de score et la génération de cartes sont entièrement gérés côté serveur (anti-triche).
- **Chat intégré** : Discutez avec les autres joueurs dans le lobby et pendant la partie (avec défilement automatique).
- **Interface dynamique et réactive** : Animations fluides avec Framer Motion et design moderne.
- **Système de sessions** : Sauvegarde locale de votre pseudonyme et détection automatique des nouveaux joueurs pour l'animation d'introduction.

## 🛠️ Stack Technique

- **Frontend** : Next.js (React), TypeScript, Tailwind CSS, Framer Motion, Socket.io-client.
- **Backend** : Node.js, Express, Socket.io.

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
*(Le serveur se lancera sur le port défini, par défaut souvent 3001).*

### 2. Démarrer le Frontend (Client)
Ouvrez un nouveau terminal :
```bash
cd frontend
npm install
npm run dev
```
L'application frontend sera accessible sur [http://localhost:3000](http://localhost:3000).

## 🌍 Déploiement

- **Frontend** : Optimisé pour un déploiement facile sur [Vercel](https://vercel.com/).
- **Backend** : Prêt pour un déploiement sur des plateformes comme [Render](https://render.com/). *(Note : Le backend utilise directement les variables `process.env` en production).*
