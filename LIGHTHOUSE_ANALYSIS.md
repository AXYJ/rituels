# Analyse & Plan d'Optimisation Lighthouse - Rituels

Ce document propose une analyse détaillée des avertissements relevés par le rapport Lighthouse du projet **Rituels**, expliquant les causes sous-jacentes et les solutions à mettre en œuvre.

---

## 1. Performances & Cache

### 🔴 Utiliser des durées de mise en cache efficaces
* **Cause** : Les ressources externes (comme les vignettes de vidéos YouTube de `i.ytimg.com` ou les scripts tiers) sont servies par Google/YouTube avec une durée de vie de cache très courte (5 minutes). Lighthouse recommande une mise en cache à long terme (jusqu'à 1 an) pour les ressources statiques.
* **Impact** : Lors des visites répétées, le navigateur doit retélécharger ces fichiers au lieu de les lire depuis le cache local, ralentissant le chargement.
* **Améliorations potentielles** :
  1. **Autohébergement de la vignette** : Au lieu de charger la vignette depuis les serveurs de YouTube, nous pouvons la télécharger une fois et la servir directement depuis le dossier `/public/assets/` de notre projet avec des en-têtes de cache optimaux.
  2. **Chargement paresseux de l'Iframe (Façade)** : Afficher une simple image de prévisualisation (vignette locale) avec un bouton de lecture "Play". L'iframe YouTube réelle n'est chargée dans le DOM **qu'au clic** de l'utilisateur. Cela évite totalement de charger les scripts et images de YouTube lors du chargement initial de la page.

---

## 2. Optimisation des Images

### 🔴 Améliorer l'affichage des images (Properly Size Images)
* **Cause** : Plusieurs images (`path.png`, `path-2.png`, `cards-1.png`, `pigeon.png`) ont des dimensions physiques (taille réelle du fichier) beaucoup plus grandes que les dimensions affichées à l'écran. 
  * *Exemple* : `path.png` fait $1184 \times 805$ pixels mais s'affiche en $512 \times 348$.
* **Impact** : Le navigateur télécharge des fichiers inutilement lourds, ce qui consomme de la bande passante et ralentit le LCP (Largest Contentful Paint).

> [!NOTE]
> **Cas des écrans haute densité (Retina / High-DPI) :**
> Vous avez tout à fait raison ! Sur les écrans modernes (MacBook, iPhone, smartphones récents), la densité de pixels est doublée ou triplée (DPR $\ge 2$). Pour qu'une image reste parfaitement nette à l'affichage (sans paraître floue), il faut en effet lui fournir une image physique 2 fois plus grande (ex. pour un affichage de $500 \times 500$ px, il faut un fichier de $1000 \times 1000$ px).
> Cependant, charger cette version lourde (2x ou 3x) sur un vieil écran standard ou un réseau mobile lent nuit aux performances.

* **Améliorations potentielles** :
  1. **Utiliser le composant `<Image>` de Next.js** (de `next/image`) au lieu de balises `<img>` standards. Il génère automatiquement les versions responsives (`srcset`) et redimensionne l'image à la volée. Il sert automatiquement la version 1x pour un vieil écran, et la version 2x/3x pour un écran Retina.
  2. **Convertir les images au format moderne** (WebP ou AVIF). Ces formats offrent une compression bien supérieure au PNG/JPG à qualité visuelle équivalente (ce qui permet d'avoir des images 2x très nettes mais ultra-légères).
  3. **Définir l'attribut `sizes`** sur les images pour indiquer au navigateur quelle taille d'image télécharger selon la largeur de l'écran (ex. `sizes="(max-width: 1024px) 100vw, 50vw"`). Sans cet attribut, Next.js génère un `srcset` supposant que l'image fait 100% de la largeur de l'écran, ce qui force le téléchargement d'images 2x géantes pour de petits éléments.

---

## 3. JavaScript & Bundle Size

### 🟡 Ancien JavaScript (Legacy Polyfills)
* **Cause** : Le build de production inclut des polyfills (comme `Array.prototype.flat`, `Object.fromEntries`, etc.) pour supporter les très anciens navigateurs (ex. Internet Explorer 11).
* **Impact** : Cela ajoute du code JavaScript inutile pour la quasi-totalité des utilisateurs modernes (qui disposent de navigateurs récents supportant ces fonctionnalités nativement).
* **Améliorations potentielles** :
  * Configurer un fichier `.browserslistrc` à la racine pour cibler uniquement les navigateurs modernes (ex. `defaults, not ie 11, not op_mini all`). Next.js compile ainsi un bundle plus léger sans injecter ces polyfills obsolètes.

### 🟡 Réduisez les ressources JavaScript inutilisées (Reduce Unused JS)
* **Cause** : Tout le code JavaScript (Framer Motion, Socket.io, Lottie, etc.) est chargé dès le premier rendu, même si certaines fonctionnalités ne sont pas utilisées immédiatement.
* **Impact** : Augmente le temps de traitement du processeur (CPU) au démarrage, retardant l'interactivité de la page (TBT - Total Blocking Time).
* **Améliorations potentielles** :
  1. **Imports dynamiques (`next/dynamic`)** : Charger dynamiquement les composants complexes ou interactifs uniquement lorsqu'ils sont nécessaires (ex. la modale des règles, le jeu lui-même, ou les animations Lottie).
  2. **Optimiser Framer Motion** : Utiliser `LazyMotion` avec la fonction de chargement de fonctionnalités. Attention, comme le projet utilise des animations de mise en page (`layoutId` pour les cartes) et des animations de sortie (`exit` dans les modales ou le deck), il faudra utiliser `domMax` à la place de `domAnimation`. Cela permet quand même de charger Framer Motion de manière asynchrone et d'alléger le bundle initial.

---

## 4. Polices de caractères (Fonts)

### 🔴 Affichage de la police (font-display: swap)
* **Cause** : Le site n'utilise lui-même qu'une seule police locale ("Sweet and Salty"), pour laquelle nous avons bien défini `font-display: swap` dans `globals.css`. La police `fonts.gstatic.com` (Roboto) mentionnée par Lighthouse est en fait **chargée automatiquement par l'iframe de la vidéo YouTube** pour afficher ses boutons et son titre.
* **Impact** : Comme cette police est gérée par Google/YouTube, nous n'avons aucun contrôle direct sur ses directives de chargement.
* **Résolution** : 
  * Grâce à la mise en place de la **vignette locale (façade)** sur la vidéo, l'iframe YouTube n'est plus chargée au démarrage du site. La police externe de YouTube ne sera donc plus chargée initialement, ce qui **fait disparaître cet avertissement** du rapport de performance initial de Lighthouse.

---

## 5. Rendu & Largest Contentful Paint (LCP)

### 🔴 Délai d'affichage de l'élément LCP (3 550 ms)
* **Cause** : L'élément le plus grand visible sur l'écran (LCP) est l'image `path.png`. Lighthouse indique un délai de rendu de **3.55 secondes** après son chargement. Ce délai s'explique par le fait que l'image est probablement cachée au début (`hidden lg:block`), ou que son opacité est animée à `0` via Framer Motion ou retardée par une condition JavaScript (ex. `hasCheckedVisit`).
* **Impact** : Une valeur LCP élevée pénalise fortement la note globale de performance de Lighthouse.
* **Améliorations potentielles** :
  1. **Supprimer le lazy-loading sur le LCP** : Ajouter `priority` (si Next.js `<Image>`) ou s'assurer qu'elle n'a pas `loading="lazy"`.
  2. **Supprimer les animations initiales sur le LCP** : Les images LCP ne doivent pas commencer avec une opacité de 0 ou dépendre d'une animation longue à démarrer. Elles doivent être affichées immédiatement dans le HTML pour que le navigateur les dessine au plus vite.
  3. **Déclarer l'image LCP dans le HTML initial** : Éviter les conditions de montage JS qui masquent l'image au premier rendu.

---

## 6. Bonnes Pratiques & Cache Amélioré (Bfcache)

### 🟡 Restauration du cache amélioré (Back/Forward Cache) bloquée par WebSockets
* **Cause** : Le site utilise une connexion WebSocket (Socket.io). Par sécurité et logique de protocole, les navigateurs empêchent la mise en cache Bfcache d'une page ayant une connexion réseau persistante active.
* **Impact** : Si l'utilisateur clique sur un lien externe puis fait "Retour", la page doit être entièrement rechargée et reconstruite au lieu de s'afficher instantanément.
* **Améliorations potentielles** :
  * Déconnecter explicitement le WebSocket lors du démontage du composant ou de la page (ex. dans le `cleanup` d'un `useEffect`) et lors de l'événement `pagehide` du navigateur, puis le reconnecter sur `pageshow`.

### 🟡 Cookies tiers (Third-party Cookies)
* **Cause** : L'iframe YouTube traditionnelle dépose des cookies de tracking Google.
* **Impact** : Risque de blocage par les navigateurs modernes (RGPD / fin des cookies tiers) et avertissements dans les outils de développement.
* **Améliorations potentielles** :
  * Nous avons déjà remplacé `youtube.com` par `youtube-nocookie.com`, ce qui résout ce point en empêchant le dépôt de cookies publicitaires.

---

## 7. Expérience de Développement

### 🟡 Mappages source manquants (Missing Source Maps)
* **Cause** : Les fichiers `.map` ne sont pas générés ou accessibles pour le code compilé de production.
* **Impact** : N'affecte pas les performances pour les utilisateurs finaux, mais empêche d'avoir des traces d'erreurs lisibles avec les lignes exactes de votre code source d'origine dans la console de production.
* **Améliorations potentielles** :
  * Si vous souhaitez faciliter le débogage en production, vous pouvez activer l'option `productionBrowserSourceMaps: true` dans `next.config.js`. Sinon, il est tout à fait standard de les désactiver pour protéger le code source.
