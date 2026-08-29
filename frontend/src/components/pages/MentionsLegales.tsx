// Import des modules
import Image from "next/image";
import { useEffect } from "react";

// Import du contexte
import { useGame } from "../../context/GameContext";

export default function MentionsLegales() {
  const { view, setView } = useGame();

  const emailUser = "contact";
  const emailDomain = "xiao-web.com";

  useEffect(() => {
    if (view === "mentions-legales#credits") {
      const timer = setTimeout(() => {
        const element = document.getElementById("credits");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [view]);

  return (
    <div className="min-h-screen bg-[#191918] px-4 py-16">
      <div className="mx-auto max-w-[1024px]">
        <button
          onClick={() => setView("home")}
          className="group mb-8 flex cursor-pointer items-center gap-2 text-white transition-colors hover:text-gray-300"
        >
          <Image
            src="/assets/arrow-down.png"
            alt="Retour"
            width={24}
            height={12}
            className="rotate-90 transition-transform group-hover:-translate-x-1"
          />
          <span>Retour à l&apos;accueil</span>
        </button>

        {/* SECTION 1: CHARTE DU PROTOCOLE RITUELS */}
        <section className="flex flex-col gap-8 pb-16">
          <div className="mb-16 flex flex-col items-center justify-center gap-8 text-center">
            <h1 className="text-6xl text-white">Charte du Protocole Rituels</h1>
          </div>

          <div className="grid gap-16">
            <article className="flex flex-col gap-4">
              <h2>
                Article 1 : Responsabilités et Effets Secondaires
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                &quot;Rituels&quot; décline toute responsabilité en cas de
                besoin irrépressible de picorer des graines au sol ou de hocher
                la tête de manière saccadée. Dans ce cas de figure, veuillez
                consulter un vétérinaire.
              </p>
            </article>

            <article className="flex flex-col gap-4">
              <h2>
                Article 2 : Profils Incompatibles
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                L&apos;accès au protocole Rituels est fortement déconseillé aux
                catégories de sujets suivantes :
              </p>
              <ul className="list-inside list-[decimal-leading-zero] space-y-2 text-lg text-white/80 leading-relaxed">
                <li className="text-2xl">
                  Les Déterministes Rigides : Les personnes croyant que &quot;1
                  + 1 font toujours 2&quot;. Ici, 1 + 1 peut faire -2 si la
                  couleur est d&apos;humeur taquine.
                </li>
                <li className="text-2xl">
                  Les Ornithophobes : Par respect pour l&apos;inspiration de
                  l&apos;expérience, bien qu&apos;aucun pigeon n&apos;ait été
                  maltraité (physiquement) durant le développement.
                </li>
                <li className="text-2xl">
                  Les daltoniens et les dyslexiques : La perception des couleurs
                  et des symboles peut en être altérée.
                </li>
                <li className="text-2xl">
                  Les cartomenciens du dimanche : Toute tentative de lire dans
                  les cartes se soldera par un échec. Le système est purement
                  mathématique, même s&apos;il ne vous aime pas.
                </li>
              </ul>
            </article>

            <article className="flex flex-col gap-4">
              <h2>
                Article 3 : Propriété Intellectuelle des Échecs
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                Toute stratégie perdante développée durant le test devient la
                propriété exclusive du Laboratoire. Nous nous réservons le droit
                de rire de vos hypothèses erronées enregistrées dans votre
                bloc-notes lors de nos prochaines réunions de département.
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                Le Laboratoire se réserve le droit d&apos;utiliser vos échecs
                comme exemples pédagogiques pour les sujets suivants.
              </p>
            </article>

            <article className="flex flex-col gap-4">
              <h2>
                Article 4 : Résolution des Conflits
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                En cas de désaccord avec le système, c&apos;est le système qui a
                raison. Toute plainte doit être formulée en picorant trois fois
                le sol et en inclinant la tête de manière saccadée.
              </p>
            </article>

            <article className="flex flex-col gap-4">
              <h2>
                Article 5 : Conditions de Fin de Protocole
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                Aucune condition d&apos;arrêt n&apos;est prévue pour le moment.
              </p>
            </article>
          </div>
        </section>

        <hr className="w-full border-white/10 my-16" />

        {/* SECTION 2: MENTIONS LEGALES REELLES */}
        <section className="flex flex-col gap-8 py-16">
          <div className="mb-16 flex flex-col items-center justify-center gap-8 text-center">
            <h1 className="text-6xl text-white">Mentions Légales</h1>
          </div>

          <div className="grid gap-16 md:grid-cols-2">
            <article className="flex flex-col gap-4 items-center">
              <h2>Éditeur</h2>
              <p className="text-lg text-white/80 leading-relaxed">
                <span className="font-semibold text-white">Nom :</span> Alex Xiao
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                <span className="font-semibold text-white">Contact :</span>{" "}
                <a
                  className="text-white underline transition-colors hover:text-gray-300"
                  href={`mailto:${emailUser}@${emailDomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {emailUser} [at] {emailDomain}
                </a>
              </p>
            </article>

            <article className="flex flex-col gap-4 items-center">
              <h2>Hébergeur</h2>
              <p className="text-lg text-white/80 leading-relaxed text-center">
                <span className="font-semibold text-white">Nom :</span> Hostinger
              </p>
              <p className="text-lg text-white/80 leading-relaxed text-center">
                <span className="font-semibold text-white">Adresse postale :</span>
                <br />
                UAB &quot;HOSTINGER LT&quot;,
                <br />
                Švitrigailos g. 34C, LT-03110 Vilnius,
                <br />
                Lituanie
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                <span className="font-semibold text-white">Site Web :</span>{" "}
                <a
                  className="text-white underline transition-colors hover:text-gray-300"
                  href="https://www.hostinger.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.hostinger.com
                </a>
              </p>
            </article>
          </div>
        </section>

        <hr className="w-full border-white/10 my-16" />

        {/* SECTION 3: POLITIQUE DE CONFIDENTIALITE */}
        <section className="flex flex-col gap-8 py-16">
          <div className="mb-16 flex flex-col items-center justify-center gap-8 text-center">
            <h1 className="text-6xl text-white">Politique de Confidentialité</h1>
          </div>

          <div className="grid gap-12">
            <article className="flex flex-col gap-4">
              <p className="text-lg text-white/80 leading-relaxed">
                La protection de votre vie privée et de vos données personnelles est
                une priorité. Cette politique de confidentialité explique en toute
                transparence quelles données sont traitées lors de votre utilisation
                du jeu, pour quelles finalités et comment elles sont gérées.
              </p>
            </article>

            <article className="flex flex-col gap-4">
              <h2 className="text-3xl text-white">
                1. Principe général : Le respect de la vie privée par défaut
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                Le jeu est conçu selon le principe de minimisation des données :{" "}
                <strong>aucune donnée n&apos;est conservée à long terme</strong>. Le
                traitement des données est temporaire, strictement limité au temps
                d&apos;une session de jeu, et hébergé en mémoire volatile (RAM).
              </p>
            </article>

            <article className="flex flex-col gap-4">
              <h2 className="text-3xl text-white">
                2. Données traitées et finalités
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                Pendant votre navigation et vos parties, nous traitons uniquement
                les éléments suivants :
              </p>

              <div className="w-full overflow-x-auto rounded-lg border border-white/10 bg-white/5">
                <table className="w-full border-collapse text-left text-lg text-white">
                  <thead>
                    <tr className="bg-white/10 font-semibold border-b border-white/10">
                      <th className="p-4">Donnée collectée</th>
                      <th className="p-4">Finalité</th>
                      <th className="p-4">Durée de conservation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="p-4 font-semibold text-white">Pseudonyme</td>
                      <td className="p-4">Identifier le joueur auprès des autres participants du salon et pré-remplir le champ de saisie lors des prochaines visites.</td>
                      <td className="p-4 text-white/60">Conservé localement sur votre navigateur (localStorage) jusqu&apos;à ce que vous le supprimiez.</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-white">Code / Numéro de salon</td>
                      <td className="p-4">Permettre de rejoindre ou rester connecté à son salon de jeu actif (notamment en cas de rechargement de page).</td>
                      <td className="p-4 text-white/60">Conservé pour la durée de la session de navigation (sessionStorage) et supprimé à la fermeture de l&apos;onglet ou du navigateur.</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-white">Données de partie</td>
                      <td className="p-4">Assurer le bon fonctionnement des mécaniques de jeu en temps réel via WebSockets (scores, réponses, état du jeu).</td>
                      <td className="p-4 text-white/60">Traitées uniquement en mémoire vive (RAM) du serveur et supprimées automatiquement dès que tous les joueurs quittent le salon.</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-white">Réglages du volume sonore</td>
                      <td className="p-4">Mémoriser les réglages de volume sonore générale et des effets sonores choisis par le joueur pour les sessions futures.</td>
                      <td className="p-4 text-white/60">Conservés localement sur votre navigateur (localStorage) jusqu&apos;à ce que vous les supprimiez.</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-white">Statut de première visite</td>
                      <td className="p-4">Déterminer s&apos;il convient de lancer ou d&apos;ignorer l&apos;animation d&apos;introduction au chargement de l&apos;accueil.</td>
                      <td className="p-4 text-white/60">Conservé localement sur votre navigateur (localStorage) jusqu&apos;à ce que vous le supprimiez.</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-white">Identifiant de session (Session ID)</td>
                      <td className="p-4">Associer de manière unique le joueur à sa connexion en cours et permettre la reconnexion automatique en cas de coupure réseau.</td>
                      <td className="p-4 text-white/60">Conservé localement sur votre navigateur (localStorage) pour permettre les reconnexions.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-center text-lg font-semibold text-white">
                Aucune donnée n&apos;est vendue, cédée, ni partagée avec des régies
                publicitaires ou des tiers à des fins marketing.
              </p>
            </article>

            <article className="flex flex-col gap-4">
              <h2 className="text-3xl text-white">
                3. Durée de conservation et suppression automatique
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                <strong>Suppression immédiate :</strong> Dès que tous les joueurs
                quittent un salon de jeu, l&apos;intégralité des données rattachées à
                ce salon (salon, pseudos, scores, états de partie) est{" "}
                <strong>définitivement effacée de la mémoire du serveur</strong>.
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                <strong>Absence de base de données persistante :</strong> Aucune
                information relative à vos parties, historiques ou habitudes de
                jeu n&apos;est enregistrée dans une base de données permanente.
              </p>
            </article>

            <article className="flex flex-col gap-4">
              <h2 className="text-3xl text-white">
                4. Cookies et stockage local (LocalStorage / SessionStorage)
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                Ce site &quot;n&apos;utilise aucun cookie publicitaire, aucun traceur tiers et
                aucun outil d&apos;analyse d&apos;audience invasif&quot; (type Google Analytics).
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                Seuls des éléments strictement techniques et nécessaires au
                fonctionnement du service peuvent être déposés sur votre terminal :
              </p>
              <p className="border-l-2 border-white/50 pl-4 italic text-lg text-white/80 leading-relaxed">
                <strong>Stockage local de confort :</strong> Votre navigateur peut
                garder en mémoire locale votre dernier pseudonyme utilisé ou le
                dernier code de salon pour vous éviter de les retaper lors d&apos;un
                rechargement de page.
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                Gestion et suppression :
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                Conformément aux recommandations de la CNIL et du RGPD, ces
                traceurs purement techniques ne requièrent pas de consentement
                préalable par bandeau. Si vous souhaitez supprimer ces éléments
                locaux, vous pouvez le faire à tout moment :
              </p>
              <ul className="flex list-disc flex-col gap-2 pl-6 text-lg text-white/80 leading-relaxed">
                <li>
                  Directement depuis les paramètres de votre navigateur (section
                  &quot;Historique&quot; {"->"} &quot;Effacer les données de navigation / Cookies
                  et données de sites&quot;).
                </li>
                <li>
                  Via l&apos;outil d&apos;inspection de votre navigateur (F12 {"->"} Onglet
                  Application ou Stockage {"->"} Local Storage / Cookies {"->"}{" "}
                  Effacer).
                </li>
              </ul>
            </article>

            <article className="flex flex-col gap-4">
              <h2 className="text-3xl text-white">
                5. Vos droits (RGPD)
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                Conformément au Règlement Général sur la Protection des Données
                (RGPD), vous disposez d&apos;un droit d&apos;accès, de rectification et de
                suppression de vos données personnelles.
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                Compte tenu de l&apos;absence de stockage persistant et de comptes
                utilisateurs,{" "}
                <strong>
                  quitter la partie et fermer votre navigateur supprime de facto
                  l&apos;ensemble de vos données de session
                </strong>
                .
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                Pour toute question ou demande relative à vos données, vous pouvez
                contacter l&apos;éditeur du site à l&apos;adresse suivante :
              </p>
              <div className="mt-2 text-center text-lg">
                <a
                  className="font-semibold text-white underline transition-colors hover:text-gray-300"
                  href={`mailto:${emailUser}@${emailDomain}`}
                >
                  {emailUser} [at] {emailDomain}
                </a>
              </div>
            </article>
          </div>
        </section>

        <hr className="w-full border-white/10 my-16" />

        {/* SECTION 4: CREDITS */}
        <section id="credits" className="py-16 pb-32">
          <div className="mb-16 flex flex-col items-center justify-center gap-8 text-center">
            <h1 className="text-6xl text-white">Crédits</h1>
          </div>
          <div className="grid gap-16">
            <article className="flex flex-col gap-4">
              <h2>
                Musique
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                &quot;Sunshine through Feathers&quot; - Nicolas Merva
              </p>
            </article>
            <article className="flex flex-col gap-4">
              <h2>
                Effets sonores
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                &quot;ShuffleAndCardFlip 1&quot; - Freesound_community
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                &quot;New Notification 040&quot; - Universfield
              </p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
