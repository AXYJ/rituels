# Projet TFE : Rituels (Jeu de cartes en ligne)

## 1. Concept Global
**Rituels** est un jeu de cartes stratégique en ligne où les règles mathématiques et les effets de jeu sont redéfinis aléatoirement à chaque nouvelle partie. 

* **Nombre de joueurs :** 2 à 4 joueurs.
* **Condition de victoire :** Atteindre le palier de **20 points**.
* **Dynamique :** Tour par tour synchronisé via WebSockets.

---

## 2. Mécaniques de Jeu

### Les Cartes
Chaque carte est composée de deux attributs :x²
* **Symbole (5 types) :** Définit la valeur brute en points.
* **Couleur (5 types) :** Définit l'effet spécial appliqué lors du tour.

### Système de Variabilité
Au lancement de chaque salon, le serveur génère un **Dictionnaire de Règles** unique :
1.  Chaque symbole reçoit une valeur comprise entre `-1` et `3`.
2.  Chaque couleur reçoit un effet parmi la liste suivante :
    * **Inversion :** Inverse la polarité des points (positif devient négatif et inversement).
    * **Gel :** Empêche le prochain joueur de gagner des points au prochain tour.
    * **Echo :** Copie l'effet de la dernière carte jouée.
    * **Neutre :** Aucun effet supplémentaire.

---

## 3. Architecture Technique

### Phase d'Initialisation (Serveur)
1.  **Création du Salon :** Génération d'un code de room unique.
2.  **Configuration :** Le serveur génère le dictionnaire des règles (Points/Couleurs).
3.  **Inscription :** Réception et stockage des pseudonymes des joueurs.

### Phase de Lancement
1.  **Distribution :** Le serveur annonce l'ordre de passage.
2.  **Main de départ :** Chaque client génère localement 3 cartes aléatoires pour remplir sa main.

### Cycle d'un Tour
1.  **Autorisation :** Le serveur émet l'événement `YOUR_TURN` au joueur actif. Les autres interfaces sont verrouillées (UX).
2.  **Action Joueur :** Le joueur sélectionne et joue une carte.
3.  **Transmission :** Le client calcule l'impact localement et envoie au serveur :
    * `playerId` : Identifiant unique du joueur.
    * `pointsDelta` : Points nets gagnés ou perdus.
    * `effectApplied` : L'effet déclenché.
4.  **Arbitrage :** Le serveur met à jour le score global, vérifie si le palier de 20 points est atteint.
5.  **Mise à jour :** * Si Victoire : Diffusion de l'événement `GAME_OVER` avec classement.
    * Sinon : Diffusion de `UPDATE_STATE` à tous les joueurs et passage au tour suivant.

---

## 4. Stack Technique
* **Framework :** Next.js (App Router).
* **Style :** Tailwind CSS 4.1.
* **Animations :** Framer Motion (Gestion des transitions de cartes et feedbacks de score).
* **Temps Réel :** Socket.io (Serveur Node.js indépendant).