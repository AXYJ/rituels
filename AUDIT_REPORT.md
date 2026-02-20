# Rapport d'Audit Technique "Rituels"

## 1. Bilan de santé
La base de code (Next.js + Socket.io) souffrait de plusieurs anomalies structurelles critiques, principalement autour de la transmission d'informations entre le client et le serveur :
*   **Incohérence des échanges Socket.io:** Plusieurs événements `emit` et `on` ne respectaient pas le même ordre d'arguments (ex. `card_played`), ce qui conduisait à des valeurs `undefined` ou à des injections de `string` dans les scores.
*   **Logique de jeu erronée côté serveur:** Le serveur tentait de renvoyer des tuples de style Python de façon incorrecte `return (playerOrder, roomCode)`, ce qui renvoyait seulement `roomCode`. La gestion du tableau du tour de rôle (`playerOrder`) était cassée car le tableau était complètement perdu entre les requêtes. 
*   **Variables non utilisées:** L'application comportait des variables non utilisées dans `page.tsx` et `GameContext.tsx` qui complexifiaient inutilement la lecture.

Malgré tout, l'utilisation de `GameContext` pour centraliser le state global de l'app est robuste et propre, ce qui offre de bonnes bases pour le refactoring.

## 2. Corrections effectuées
Les fichiers suivants ont été modifiés afin de rétablir une parfaite communication bilatérale et gérer correctement le cycle et le flow de jeu.

*   **`backend/src/server.js`** :
    *   Correction de la signature `whoStart`. Transformation de la logique pour qu'elle renvoie un Array d'ID pour simplifier la manipulation tout long de la partie et sauvegarde de l'ordre de passage `playerOrder` à l'intérieur de l'objet `room`. 
    *   Correction de la signature `nextPlayer` qui devait récupérer `room.playerOrder` sauvegardée ci-dessus.
    *   Correction de l'événement `card_played`: désormais il reçoit les "points" calculés côté client (afin que la logique reste côté client) plutôt que "effect". L'événement `emit` appelé a été aligné sur ce que le client lisait (`card, idPlayer, newOrder, player.score`). 
    *   Nettoyage : Suppression de l'événement mort `player_turn` non écouté côté client.
    *   Initialisation systématique du champ `score: 0` dès la création ou lors du `join_game`.

*   **`frontend/src/context/GameContext.tsx`** :
    *   L'événement `cardPlayed` envoie désormais correctement `points` (calculés en amont) et la `card` au lieu de `effect`, ce qui libère le serveur de toute forme de calcul métier. 
    *   Nettoyage : Suppression du tableau `effects` codé en dur qui était défini mais inutilisé, polluant le haut du fichier.

*   **`frontend/src/app/page.tsx`** :
    *   Suppression de `setView` récupéré depuis le Context qui n'était jamais utilisé (Règle d'absence de variables mortes).

*   **`frontend/src/components/pages/Game.tsx`** :
    *   Adaptation de `isMyTurn`: le serveur distribuant désormais des ID au lieu des Noms, le client compare `playerTurn === me.id` au lieu de `.name` ce qui corrige les failles si deux joueurs portaient le même nom (`playerTurn` stocke un ID). 
    *   La vue récupère le nom depuis le Context pour un affichage propre : `players.find(p => p.id === playerTurn)?.name`.

## 3. Refactorisation
*   **Création de `frontend/src/types/game.ts`** :
    *   Conformément aux instructions visant à réduire la complexité, toutes les interfaces liées au state local ou global TypeScript (`Player`, `GameRules`, `View`, `GameContextType`) ont été exportées dans leur propre fichier de définitions (`types/game.ts`).
    *   `frontend/src/context/GameContext.tsx` importe désormais simplement ces types. Ce découpage allège le ficher de ~70 lignes de typage statique, rendant la logique du provider directement lisible.

## 4. Optimisations
*   **Principe DRY sur le flow du code:** `whoStart` assigne directement `playerOrder` dans la `room` pour que `nextPlayer` puisse facilement prendre la main au prochain tour sans avoir besoin de manipuler des arrays et des boucles de destructuring complexes.
*   **Socket.io LifeCycle Context:** Le `useCallback` est correctement appliqué et combiné au `socket.emit`, ce qui garantit qu'aucune recréation n'est possible, fiabilisant ainsi la méthode d'émission.
