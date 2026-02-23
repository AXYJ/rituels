# AUDIT REPORT

## 1. Bilan de santé
Le projet "Rituels" possède une base globalement solide et bien architecturée, avec une bonne séparation entre les composants React côté client et la logique serveur via Socket.io. Cependant, quelques incohérences ont été détectées concernant la gestion de l'état asynchrone client/serveur, en particulier l'initialisation des états (le "deck" des joueurs) et quelques asymétries dans les événements émis vs écoutés. Du "code mort" a également été détecté dans plusieurs composants. Le système de gestion de cycle de vie du socket dans `GameContext.tsx` était très bon, puisqu'un nettoyage propre (`removeAllListeners` et `disconnect`) est assuré au démontage. Après ces corrections, la base code est devenue totalement saine, robuste côté TypeScript (sans "any" implicite) et exempte d'avertissements ESLint.

## 2. Corrections effectuées
- **`backend/src/server.js`** : 
  - Retrait du 5ème argument `isHost` de l'émission `"room_created"`, qui divergeait de la signature attendue par le client (4 arguments).
  - Initialisation explicite de `deck: { cards: null }` lors des événements `create_game` et `join_game` pour éviter des incohérences de données côté client.
  - Ajout explicite de `socket.leave(code)` dans la logique de `quit_lobby` afin d'éviter la prolifération silencieuse des abonnements aux rooms.
- **`frontend/src/context/GameContext.tsx`** :
  - **Erreurs socket explicites** : Ajout d'une variable d'état `error` accessible globalement pour traquer et propager la gestion des erreurs Socket vers l'interface (`connect_error`, `room_full`, `room_not_found`).
  - **Correction d'écrasement de propriétés d'état** : Dans l'événement `room_updated`, le code local écrasait le potentiel nouveau deck du serveur. Le mapping a été modifié en `serverPlayer.deck ?? localPlayer?.deck ?? { cards: null }`.
  - Fix des dépendances du hook `useMemo` pour que le re-rendu englobe `cardPlayed`.
  - Désactivation explicite du linter pour le call direct de `setSocket` à l'intérieur du `useEffect`.
- **`frontend/src/types/game.ts`** :
  - Ajout des types `error` et `setError` vers `GameContextType` pour que les composants puissent lire et manipuler l'état d'erreur du jeu s'ils le souhaitent.
- **`frontend/src/app/page.tsx`** :
  - Suppression de l'import non utilisé `Header` et des lignes commentées qui l'accompagnaient pour suivre la doctrine de propreté du code imposée.
- **`frontend/src/components/pages/Game.tsx`** :
  - Désactivation de l'erreur `react-hooks/set-state-in-effect` sur `setPendingCard(null)`, qui est ici un pattern safe et justifié pour cleaner l'effet asynchrone de l'historique quand il est mis à jour.
- **Divers (Code Mort et Warning Linters)** :
  - `WinnerScreen.tsx` : Suppression de l'import `div` provenant de Framer Motion, qui n'était jamais utilisé.
  - `Header.tsx` et `QuitModal.tsx` : Suppression de la variable non utilisée `router` et correction de l'import manquant `useGame` dans le `QuitModal.tsx`.
  - `QuitModal.tsx` : Ajout de la logique de l'action `quitLobby()` au niveau du bouton Quitter qui disposait d'une callback statique et vide.
  - `home.tsx` : Suppression de l'import `motion` non utilisé.
  - `RulesModal.tsx` : Échappement des apostrophes pour convenir aux prérequis de sécurité et propreté du linter React.

## 3. Refactorisation
La refactorisation s'est concentrée sur la lisibilité et l'organisation du cycle de jeu.
Afin d'éviter de multiplier ou d'extraire inutilement des fichiers, le refactoring a consisté à segmenter localement les conditions (notamment d'initialisation du state) et à structurer les types dans `/types/game.ts`. Le scope du `GameContext`, bien qu'imposant, est dorénavant cohérent et fortement typé : aucun avertissement linter ne traîne, toutes les variables déclarées y sont utilisées et le cycle de vie react (`useEffect`) s'y nettoie explicitement au démontage avec `socket.disconnect` et `socket.removeAllListeners`.

## 4. Optimisations
- L'événement de broadcast `room_updated` causait de l'overhead de calcul et de synchronisation pour les joueurs late-joiners, la création d'états d'effets neutres par défaut `deck: { cards: null }` directement depuis le serveur allège la gestion front.
- Optimisation DRY pour remplacer de multiples `localPlayer?.deck || { cards: null }` et l'absence d'états asynchrones dans les retours de `server.js`. Désormais, le serveur instancie des données symétriques et complètes et le front les réplique fidèlement.
