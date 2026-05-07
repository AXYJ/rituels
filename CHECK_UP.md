# CHECKUP

# MISSION : Audit Technique et Consolidation "Rituels"

Tu agis en tant qu'Architecte Senior Fullstack. Ton objectif est de vérifier la cohérence globale de mon projet (Next.js + Socket.io) sans ajouter de nouvelles fonctionnalités.

## 1. Périmètre de l'Analyse
Effectue un check-up complet des dossiers `/frontend` et `/backend` pour vérifier :
- La cohérence des types TypeScript entre le client et le serveur.
- La gestion du cycle de vie du Socket (connexion/déconnexion) dans le `GameContext`.
- La logique de navigation (state machine) dans `page.tsx`.
- L'absence de "code mort" ou de variables inutilisées.

## 2. Contraintes Strictes (Garde-fous)
- **Conservation :** Ne modifie PAS les commentaires existants si le bloc de code associé reste le même.
- **Minimalisme :** Ne crée PAS de nouvelles fonctionnalités (ex: pas de nouveaux effets de carte ou de systèmes de classement). Limite-toi à rendre ce qui existe robuste.
- **Modularité & Lisibilité :** Si un fichier devient trop long ou complexe, segmente le code en fichiers séparés (sous-composants, fonctions utilitaires ou types exportés). Priorise la clarté et l'organisation modulaire pour faciliter la compréhension et la maintenance.

## 3. Livrables Attendus
Ne modifie pas directement les fichiers sans explication. Produis un rapport dans un nouveau fichier nommé `AUDIT_REPORT.md` qui contient :
1. **Bilan de santé :** Est-ce que la base est saine et solide ?
2. **Corrections effectuées :** Liste précise des fichiers modifiés et pourquoi (bugs potentiels, incohérence de noms, etc.).
3. **Refactorisation :** Détaille les blocs de code qui ont été segmentés en fichiers distincts pour améliorer la lisibilité.
4. **Optimisations :** Si un bout de code est "rapiécé", réécris-le pour qu'il soit plus propre (DRY - Don't Repeat Yourself).

## 4. Priorité : Cohérence Socket.io
Vérifie particulièrement que les événements `emit` envoyés par le client correspondent exactement aux `on` écoutés par le serveur dans `server.js` (noms des événements et structure des données JSON).
Vérifier la gestion explicite des erreurs Socket côté client et serveur (events d’erreur, logs, fallback d’état).
Vérifier que chaque socket.on est correctement nettoyé (off) lors du démontage du composant ou du changement de dépendances

## 5. Définition de Done
Le check-up est considéré comme terminé lorsque :
- Aucun warning TypeScript n’est présent.
- Aucun listener Socket dupliqué n’est détecté.
- Tous les événements Socket sont documentés et symétriques client/serveur.
- Le rapport `AUDIT_REPORT.md` est complet et argumenté.