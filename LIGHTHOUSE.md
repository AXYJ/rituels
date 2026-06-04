### Audit Lighthouse
 
## Performances

- **Utiliser des durées de mise en cache efficaces** Économies estimées : 28 Kio
Une longue durée de mise en cache peut accélérer les visites répétées sur votre page. En savoir plusFCPLCPNon noté
Requête
Cache de la valeur TTL
Taille de transfert
YouTube video 
30 KiB
…jhxZaYCYIco/maxresdefault.jpg?sqp=-oaymwEmC…=&rs=AOn4CLDWr…(i.ytimg.com)
5min
30 KiB

- **Améliorer l'affichage des images** Économies estimées : 74 Kio
Réduire le temps de téléchargement des images peut améliorer le temps de chargement perçu de la page et le LCP. En savoir plus sur l'optimisation de la taille des imagesFCPLCPNon noté

img.pointer-events-none.absolute.top-2/3.z-0.hidden.w-80.select-none.lg:left-9/12.lg:block.lg:w-128
…bg/path.png(rituels.vercel.app)
28,2 KiB
22,9 KiB
Compte tenu de ses dimensions affichées (512x348), ce fichier image est plus volumineux que nécessaire (1184x805). Utilisez des images responsives pour réduire la taille de téléchargement de l'image.
22,9 KiB
img.height-fit.pointer-events-none.absolute.bottom-24.left-1/2.z-0.w-[50vw].select-none.lg:bottom-16
…bg/path-2.png(rituels.vercel.app)
28,1 KiB
21,2 KiB
Compte tenu de ses dimensions affichées (939x164), ce fichier image est plus volumineux que nécessaire (1901x333). Utilisez des images responsives pour réduire la taille de téléchargement de l'image.
21,2 KiB
img.pointer-events-none.absolute.top-0.left-4.z-0.w-32.select-none.lg:left-1/8.lg:w-48
/_next/image?url=%2Fassets%2Fbg%2Fcards-1.png&w=640&q=75(rituels.vercel.app)
24,0 KiB
17,6 KiB
Compte tenu de ses dimensions affichées (192x352), ce fichier image est plus volumineux que nécessaire (374x685). Utilisez des images responsives pour réduire la taille de téléchargement de l'image.
17,6 KiB
img.pointer-events-none.absolute.bottom-1/4.-left-40.z-0.hidden.w-48.origin-bottom.rotate-45.overflow-hidden.select-none.lg:block
/assets/pigeon.png(rituels.vercel.app)
15,9 KiB
12,1 KiB
Compte tenu de ses dimensions affichées (192x398), ce fichier image est plus volumineux que nécessaire (392x813). Utilisez des images responsives pour réduire la taille de téléchargement de l'image.
12,1 KiB

- **Ancien JavaScript** Économies estimées : 14 Kio
Les polyfills et les transformations permettent aux navigateurs plus anciens d'utiliser les nouvelles fonctionnalités JavaScript. Dans la majorité des cas cependant, ils ne sont pas nécessaires aux navigateurs récents. Envisagez de modifier votre processus de compilation JavaScript pour ne pas transpiler les fonctionnalités Baseline, sauf si vous savez que vous devez prendre en charge les navigateurs plus anciens. Découvrez pourquoi la plupart des sites peuvent déployer du code ES6+ sans transpiler.FCPLCPNon noté
URL
Octets perdus
vercel.app Propriétaire
13,6 KiB
…chunks/6b8c38cc1ceab5fd.js(rituels.vercel.app)
13,6 KiB
6b8c38cc1ceab5fd.js:1
Array.prototype.at
6b8c38cc1ceab5fd.js:1
Array.prototype.flat
6b8c38cc1ceab5fd.js:1
Array.prototype.flatMap
6b8c38cc1ceab5fd.js:1
Object.fromEntries
6b8c38cc1ceab5fd.js:1
Object.hasOwn
6b8c38cc1ceab5fd.js:1
String.prototype.trimEnd
6b8c38cc1ceab5fd.js:1
String.prototype.trimStart

- **Affichage de la police** Économies estimées : 80 ms
Envisagez de définir font-display sur swap ou optional pour vous assurer que le texte est toujours visible. swap peut être encore optimisé pour atténuer les décalages de mise en page avec des remplacements de métriques de police.FCPNon noté
URL
Économies estimées
Google Fonts cdn 
…v48/KFO7CnqEu….woff2(fonts.gstatic.com)
80 ms

- **Ajustement forcé de la mise en page**
Un ajustement de la mise en page forcé se produit lorsque JavaScript interroge des propriétés géométriques (comme offsetWidth) après que les styles ont été invalidés par une modification de l'état du DOM. Cela peut entraîner de mauvaises performances. En savoir plus sur les ajustements de la mise en page forcés et les stratégies d'atténuation possiblesNon noté
Appel de fonction le plus fréquent
Temps total d'ajustement de la mise en page
6b8c38cc1ceab5fd.js:2
1 ms
Source
Temps total d'ajustement de la mise en page
installHook.js:1
1 ms
[non attribué]
11 ms

- **Répartition du LCP**
Chaque sous-partie comporte des stratégies d'amélioration spécifiques. Idéalement, la plupart du temps LCP devrait être consacré au chargement des ressources et non aux délais.LCPNon noté
Sous-partie
Durée
Time to First Byte
30 ms
Délai de chargement de la ressource
480 ms
Durée de chargement de la ressource
310 ms
Délai d'affichage de l'élément
3 550 ms
img.pointer-events-none.absolute.top-2/3.z-0.hidden.w-80.select-none.lg:left-9/12.lg:block.lg:w-128

- **Détection de la requête LCP**
Optimisez le LCP en rendant l'image LCP visible immédiatement à partir du code HTML et en évitant le chargement différéLCPNon noté
fetchpriority=high doit être appliqué
La demande est visible dans le document initial
chargement différé non appliqué
img.pointer-events-none.absolute.top-2/3.z-0.hidden.w-80.select-none.lg:left-9/12.lg:block.lg:w-128

- **Arborescence du réseau**
Évitez les chaînes de requêtes critiques en réduisant la longueur des chaînes ou la taille de téléchargement des ressources, ou en reportant le téléchargement de ressources inutiles, afin d'améliorer le chargement des pages.LCPNon noté
Latence de chemin d'accès critique maximale : 900 ms
Navigation initiale
https://rituels.vercel.app - 548 ms, 5,43 KiB
…chunks/b6a0f34f167871c9.css(rituels.vercel.app) - 724 ms, 7,63 KiB
…media/sweet_and_salty.8a6b8568.woff2(rituels.vercel.app) - 900 ms, 9,36 KiB

- **Réduisez les ressources JavaScript inutilisées** Économies estimées : 128 Kio
Réduisez les ressources JavaScript inutilisées et différez le chargement des scripts tant qu'ils ne sont pas requis afin de réduire la quantité d'octets consommés par l'activité réseau. Découvrez comment réduire les ressources JavaScript inutilisées.FCPLCPNon noté
URL
Taille de transfert
Économies estimées
vercel.app Propriétaire
120,2 KiB	89,6 KiB
…chunks/5d378f1643d019b9.js(rituels.vercel.app)
80,4 KiB
64,7 KiB
…chunks/112e47bf52ef07e7.js(rituels.vercel.app)
39,8 KiB
25,0 KiB
Non attribuable
57,6 KiB	37,9 KiB
chrome-extension://fmkadmapgofadopljbjfkapdkoienihi/build/installHook.js
57,6 KiB
37,9 Ki

- **La page a empêché la restauration du cache amélioré**
La navigation consiste généralement à revenir à une page précédente ou retourner à une page suivante. Le cache amélioré peut accélérer ce type de navigation. En savoir plus sur le cache amélioréNon noté
Motif de l'échec
Type d'échec
Les pages avec WebSocket ne peuvent pas être incluses dans le cache amélioré.
Assistance pour navigateur en attente
https://rituels.vercel.app

- **Utilise des cookies tiers** 18 cookies trouvés
Les cookies tiers peuvent être bloqués dans certains contextes. Découvrez comment vous préparer aux restrictions concernant les cookies tiers.
Nom
URL
Other Google APIs/SDKs utility 
__Secure-OSID
…th/15_S4Ql8q….js(www.google.com)
__Secure-OSID
…th/15_S4Ql8q….js(www.google.com)
__Secure-OSID
…th/15_S4Ql8q….js(www.google.com)
__Secure-OSID
…th/15_S4Ql8q….js(www.google.com)
__Secure-OSID
…th/15_S4Ql8q….js(www.google.com)
__Secure-OSID
…th/15_S4Ql8q….js(www.google.com)
__Secure-OSID
…th/15_S4Ql8q….js(www.google.com)
__Secure-OSID
…th/15_S4Ql8q….js(www.google.com)
GSP
…th/15_S4Ql8q….js(www.google.com)
__Secure-OSID
…th/15_S4Ql8q….js(www.google.com)
LSOLH
…th/15_S4Ql8q….js(www.google.com)
__Host-3PLSID
…th/15_S4Ql8q….js(www.google.com)
COMPASS
…th/15_S4Ql8q….js(www.google.com)
__Secure-3PSID
…th/15_S4Ql8q….js(www.google.com)
__Secure-3PAPISID
…th/15_S4Ql8q….js(www.google.com)
NID
…th/15_S4Ql8q….js(www.google.com)
__Secure-3PSIDTS
…th/15_S4Ql8q….js(www.google.com)
__Secure-3PSIDCC
…th/15_S4Ql8q….js(www.google.com)

- **Des problèmes ont été enregistrés dans le panneau Issues des outils de développement Chrome**
Les problèmes enregistrés dans le panneau Issues des outils de développement Chrome indiquent des problèmes non résolus. Ceux-ci peuvent être dus à des requêtes réseau qui ont échoué, à des contrôles de sécurité insuffisants ou à d'autres problèmes du navigateur. Ouvrez le panneau "Issues" dans les outils de développement Chrome pour en savoir plus sur chaque problème.
Type de problème
Cookie
/embed/jhxZaYCYIco(www.youtube-nocookie.com)
…th/15_S4Ql8q….js(www.google.com)

- **Mappages source manquants pour des fichiers JavaScript propriétaires volumineux**
Les mappages source traduisent le code minimisé pour obtenir le code source d'origine. Ce processus aide les développeurs à effectuer le débogage en phase de production. De plus, Lighthouse est en mesure de fournir d'autres renseignements. Envisagez de déployer des mappages source pour profiter de ces avantages. En savoir plus sur les mappages sourceNon noté
URL
URL de mappage du code source
vercel.app Propriétaire
…chunks/5d378f1643d019b9.js(rituels.vercel.app)
Il manque un mappage source dans un fichier JavaScript volumineux
Non attribuable
chrome-extension://fmkadmapgofadopljbjfkapdkoienihi/build/react_devtools_backend_compact.js
chrome-extension://fmkadmapgofadopljbjfkapdkoienihi/build/react_devtools_backend_compact.js.map
Error: Failed fetching source map (null)
chrome-extension://fmkadmapgofadopljbjfkapdkoienihi/build/installHook.js
chrome-extension://fmkadmapgofadopljbjfkapdkoienihi/build/installHook.js.map
Error: Failed fetching source map (null)
Stormcrow Chrome Extension 
chrome-extension://bgpmiljelfnilfcfmoppijdkmccbccel/cosmetic-filtering.js
chrome-extension://bgpmiljelfnilfcfmoppijdkmccbccel/cosmetic-filtering.js.map
Error: Failed fetching source map (null)

