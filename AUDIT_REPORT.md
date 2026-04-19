# Rapport d'Audit Technique - Projet Rituels

## 1. Bilan de Santé
La base du projet est globalement saine. L'architecture Next.js (App Router) utilisée comme une Single Page Application pour maintenir la connexion Socket.io est un choix judicieux. La séparation des responsabilités entre le `GameContext` et les composants de page fonctionne bien. La logique métier est bien centralisée côté client pour les calculs de points, tandis que le serveur assure son rôle de relais (broadcasting).

## 2. Corrections Effectuées

### Frontend
- **GameContext.tsx** :
    - Corrigé un bug critique dans `joinGame` où le `sessionId` n'était pas envoyé au serveur, empêchant la reconnexion de fonctionner comme prévu.
    - Amélioré la gestion de l'état `isConnected`. Le state est maintenant synchronisé avec les événements `connect` et `disconnect` réels du Socket.
    - Nettoyé les états inutilisés comme `stillConnected`.
    - Déplacé la responsabilité de la déconnexion globale du socket vers le `GameProvider` pour éviter des déconnexions intempestives lors du rafraîchissement des hooks.
- **useSocketListeners.ts** :
    - Ajouté le support de `setIsConnected` pour notifier le contexte du statut de connexion.
    - Corrigé le listener `room_updated` qui attendait des paramètres mal structurés par rapport à ce que le serveur envoyait.
    - Amélioré la logique de déconnexion pour ne rediriger vers l'accueil (`home`) que lors de déconnexions explicites ou définitives, permettant une meilleure résilience aux micro-coupures.
    - Supprimé le `socket.disconnect()` du cleanup local du hook pour préserver la connexion entre les changements de vue, puisque le socket est géré par le Provider.

### Backend
- **server.js** :
    - Mis en conformité les événements `join_game` et `room_updated` avec les attentes du client.
    - Ajouté l'initialisation explicite de `leavedPlayer: false` pour tous les joueurs afin d'éviter des erreurs de comparaison.
    - Amélioré la robustesse des handlers en vérifiant systématiquement l'existence des salles (`rooms[roomCode]`).

## 3. Refactorisation et Modularité
- **Extraction de la logique métier (Backend)** :
    - Création de `backend/src/gameLogic.js`.
    - Déplacement des fonctions `shuffle`, `generateRules`, `whoStart`, `getNextPlayerOrder` et `checkWin` dans ce nouveau fichier.
    - Cela réduit la taille de `server.js` et sépare la gestion des sockets de la pure logique de jeu, facilitant les tests unitaires futurs.

## 4. Optimisations (DRY & Robustesse)
- **Gestion du tour de jeu** : Utilisation d'une fonction utilitaire `getNextPlayerOrder` partagée pour gérer le passage au joueur suivant, incluant le saut automatique des joueurs ayant quitté la partie (`leavedPlayer`).
- **Synchronisation du deck** : Amélioration de la cohérence de mise à jour des decks entre les joueurs lors des phases de jeu.

## 5. État Final (Definition of Done)
- [x] Cohérence des types TypeScript vérifiée.
- [x] Événements Socket.io symétriques entre client et serveur.
- [x] Gestion explicite des erreurs et de la reconnexion améliorée.
- [x] Aucun listener dupliqué détecté grâce au nettoyage (`off`/`removeAllListeners`) approprié.
- [x] Code mort et variables inutilisées supprimés.
