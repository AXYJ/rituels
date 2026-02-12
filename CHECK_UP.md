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
- **Modularité :** Assure-toi que la logique de calcul reste bien côté client comme prévu, mais que le serveur joue correctement son rôle de relais (broadcasting).

## 3. Livrables Attendus
Ne modifie pas directement les fichiers sans explication. Produis un rapport dans un nouveau fichier nommé `AUDIT_REPORT.md` qui contient :
1. **Bilan de santé :** Est-ce que la base est saine et solide ?
2. **Corrections effectuées :** Liste précise des fichiers modifiés et pourquoi (bugs potentiels, incohérence de noms, etc.).
3. **Optimisations :** Si un bout de code est "rapiécé", réécris-le pour qu'il soit plus propre (DRY - Don't Repeat Yourself).

## 4. Priorité : Cohérence Socket.io
Vérifie particulièrement que les événements `emit` envoyés par le client correspondent exactement aux `on` écoutés par le serveur dans `server.js` (noms des événements et structure des données JSON).