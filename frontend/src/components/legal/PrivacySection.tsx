import EmailLink from "../EmailLink";
import { LegalSection, LegalArticle, LegalParagraph } from "./LegalBlocks";

const DATA_ROWS = [
  {
    data: "Pseudonyme",
    purpose:
      "Identifier le joueur auprès des autres participants du salon et pré-remplir le champ de saisie lors des prochaines visites.",
    retention:
      "Dans votre navigateur (localStorage) jusqu'à ce que vous le supprimiez. Côté serveur : en mémoire vive, tant que le salon existe.",
  },
  {
    data: "Code de salon",
    purpose:
      "Permettre de rester connecté à son salon de jeu actif, notamment en cas de rechargement de page.",
    retention:
      "Dans votre navigateur (sessionStorage), supprimé à la fermeture de l'onglet.",
  },
  {
    data: "Données de partie (scores, cartes jouées, état du jeu)",
    purpose:
      "Faire fonctionner le jeu en temps réel via WebSockets.",
    retention:
      "En mémoire vive du serveur uniquement, supprimées dès que tous les joueurs ont quitté le salon, et au plus tard au redémarrage du serveur.",
  },
  {
    data: "Messages du chat",
    purpose: "Échanger avec les autres joueurs du salon.",
    retention:
      "En mémoire vive du serveur (200 derniers messages par salon), supprimés avec le salon. Aucun message n'est écrit sur disque.",
  },
  {
    data: "Réglages du volume sonore",
    purpose:
      "Mémoriser les volumes de la musique et des effets sonores choisis par le joueur.",
    retention:
      "Dans votre navigateur (localStorage) jusqu'à ce que vous les supprimiez. Jamais envoyés au serveur.",
  },
  {
    data: "Statut de première visite",
    purpose:
      "Savoir s'il faut jouer l'animation d'introduction de l'accueil.",
    retention:
      "Dans votre navigateur (localStorage) jusqu'à ce que vous le supprimiez. Jamais envoyé au serveur.",
  },
  {
    data: "Identifiant de session (identifiant aléatoire)",
    purpose:
      "Vous reconnaître d'une connexion à l'autre et vous replacer dans votre salon après un rechargement ou une coupure réseau.",
    retention:
      "Dans votre navigateur (localStorage) jusqu'à ce que vous le supprimiez. Côté serveur : en mémoire vive, tant que le salon existe.",
  },
  {
    data: "Pseudonyme et messages envoyés à la modération automatique",
    purpose:
      "Détecter et filtrer les contenus vulgaires, haineux ou sexuels avant diffusion aux autres joueurs, grâce à un service d'intelligence artificielle (Groq).",
    retention:
      "Envoyés à Groq au moment de la saisie. Selon la documentation de Groq, le contenu des requêtes n'est pas conservé par défaut. Côté serveur, seul le verdict (OK / refusé) des 500 derniers pseudonymes jugés est gardé en mémoire vive jusqu'au redémarrage, sans lien avec un salon ni un joueur.",
  },
  {
    data: "Adresse IP et journaux techniques",
    purpose:
      "Établir la connexion et protéger le service contre les abus. Le serveur du jeu journalise la date de connexion ou de déconnexion et un identifiant technique de connexion, sans le pseudonyme ni l'adresse IP.",
    retention:
      "L'adresse IP est vue par l'hébergeur et son infrastructure réseau, qui conservent leurs journaux selon leur propre politique de rétention.",
  },
  {
    data: "Lecture de la vidéo des règles (YouTube)",
    purpose:
      "Afficher la vidéo d'explication des règles, hébergée sur YouTube.",
    retention:
      "Rien n'est chargé depuis YouTube tant que vous n'avez pas cliqué sur la vidéo. Après ce clic, Google reçoit votre adresse IP et peut déposer des traceurs, sous sa propre politique de confidentialité.",
  },
];

const emailLinkClass =
  "font-semibold text-white underline transition-colors hover:text-gray-300";

const externalLinkClass =
  "text-white underline transition-colors hover:text-gray-300";

export default function PrivacySection() {
  return (
    <LegalSection title="Politique de Confidentialité" className="gap-8 py-16">
      <div className="grid gap-12">
        <LegalArticle>
          <LegalParagraph>
            Cette politique explique quelles données sont traitées lors de
            votre utilisation du jeu, pour quelles finalités, à qui elles sont
            transmises et comment les contrôler.
          </LegalParagraph>
        </LegalArticle>

        <LegalArticle title="1. Responsable du traitement et principe général">
          <LegalParagraph>
            Le responsable du traitement est l&apos;éditeur du site, un
            particulier non professionnel joignable à l&apos;adresse{" "}
            <EmailLink className={emailLinkClass} />.
          </LegalParagraph>
          <LegalParagraph>
            Le jeu n&apos;a ni compte utilisateur ni base de données : les
            salons et les parties vivent uniquement en mémoire vive du serveur.
            Seules quelques préférences sont enregistrées dans votre
            navigateur.
          </LegalParagraph>
        </LegalArticle>

        <LegalArticle title="2. Données traitées et finalités">
          <LegalParagraph>
            Pendant votre navigation et vos parties, les données suivantes sont
            traitées :
          </LegalParagraph>

          <div className="w-full overflow-x-auto rounded-lg border border-white/10 bg-white/5">
            <table className="w-full border-collapse text-left text-lg text-white">
              <thead>
                <tr className="border-b border-white/10 bg-white/10 font-semibold">
                  <th className="p-4">Donnée</th>
                  <th className="p-4">Finalité</th>
                  <th className="p-4">Durée de conservation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {DATA_ROWS.map(({ data, purpose, retention }) => (
                  <tr key={data}>
                    <td className="p-4 font-semibold text-white">{data}</td>
                    <td className="p-4">{purpose}</td>
                    <td className="p-4 text-white/60">{retention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-center text-lg font-semibold text-white">
            Aucune donnée n&apos;est vendue ni utilisée à des fins publicitaires
            ou de profilage.
          </p>
        </LegalArticle>

        <LegalArticle title="3. Bases légales">
          <ul className="flex list-disc flex-col gap-2 pl-6 text-lg leading-relaxed text-white/80">
            <li>
              <strong>Exécution du service demandé</strong> : pseudonyme, code
              de salon, données de partie, messages du chat et identifiant de
              session, sans lesquels le jeu ne peut pas fonctionner.
            </li>
            <li>
              <strong>Intérêt légitime</strong> : modération automatique des
              contenus et sécurité du service (adresse IP, journaux techniques).
            </li>
            <li>
              <strong>Consentement</strong> : lecture de la vidéo YouTube, qui
              n&apos;est chargée qu&apos;après votre clic.
            </li>
          </ul>
        </LegalArticle>

        <LegalArticle title="4. Destinataires et transferts hors Union européenne">
          <LegalParagraph>
            Vos données ne sont communiquées qu&apos;aux prestataires techniques
            suivants :
          </LegalParagraph>
          <ul className="flex list-disc flex-col gap-2 pl-6 text-lg leading-relaxed text-white/80">
            <li>
              <strong>Hostinger, UAB</strong> (Lituanie, Union européenne) :
              hébergement du site et du serveur de jeu.
            </li>
            <li>
              <strong>Groq, Inc.</strong> (États-Unis) : modération
              automatique des pseudonymes et des messages. Ce transfert vers un
              pays hors Union européenne est encadré par l&apos;addendum de
              traitement des données de Groq, qui le désigne comme sous-traitant
              (
              <a
                className={externalLinkClass}
                href="https://console.groq.com/docs/legal/customer-data-processing-addendum"
                target="_blank"
                rel="noopener noreferrer"
              >
                consulter l&apos;addendum
              </a>
              ). Si la modération est indisponible, le texte est diffusé sans
              avoir été analysé.
            </li>
            <li>
              <strong>Google (YouTube)</strong> (États-Unis) : uniquement si vous
              lancez la vidéo des règles, via le domaine youtube-nocookie.com.
            </li>
          </ul>
          <LegalParagraph>
            Les messages et pseudonymes sont aussi visibles des autres joueurs
            de votre salon, par nature du jeu.
          </LegalParagraph>
        </LegalArticle>

        <LegalArticle title="5. Durée de conservation et suppression">
          <LegalParagraph>
            <strong>Côté serveur :</strong> dès que tous les joueurs ont quitté
            un salon, l&apos;ensemble de ses données (pseudonymes, scores,
            états de partie, messages) est effacé de la mémoire. Un
            redémarrage du serveur efface aussi tous les salons en cours.
          </LegalParagraph>
          <LegalParagraph>
            <strong>Côté navigateur :</strong> les préférences listées ci-dessus
            restent sur votre appareil tant que vous ne les supprimez pas
            (voir l&apos;article 6).
          </LegalParagraph>
        </LegalArticle>

        <LegalArticle title="6. Cookies et stockage local (LocalStorage / SessionStorage)">
          <LegalParagraph>
            Ce site n&apos;utilise aucun cookie publicitaire, aucun outil
            d&apos;analyse d&apos;audience et aucun traceur tiers, hormis ce
            qui peut être déposé par YouTube si vous lancez la vidéo.
          </LegalParagraph>
          <LegalParagraph>
            Le site écrit uniquement dans le stockage de votre navigateur :
            votre pseudonyme, votre identifiant de session, vos réglages de
            volume, le statut de première visite (localStorage) et le code de
            votre salon actif (sessionStorage). Ces éléments sont nécessaires
            au fonctionnement du service ou correspondent à des préférences que
            vous choisissez : ils ne requièrent pas de consentement par
            bandeau, conformément aux recommandations de la CNIL.
          </LegalParagraph>
          <p className="mt-2 text-lg font-semibold text-white">
            Gestion et suppression :
          </p>
          <ul className="flex list-disc flex-col gap-2 pl-6 text-lg leading-relaxed text-white/80">
            <li>
              Depuis les paramètres de votre navigateur (« Effacer les données
              de navigation / Cookies et données de sites »).
            </li>
            <li>
              Via les outils de développement (F12 {"->"} Application ou
              Stockage {"->"} Local Storage / Session Storage {"->"} Effacer).
            </li>
          </ul>
        </LegalArticle>

        <LegalArticle title="7. Mineurs">
          <LegalParagraph>
            Le jeu est accessible à tous les âges. Les messages sont filtrés
            automatiquement, sans relecture humaine : les plus jeunes sont
            invités à jouer avec l&apos;accord d&apos;un parent ou d&apos;un
            responsable légal, qui peut aussi exercer les droits décrits
            ci-dessous. Nous recommandons de ne jamais utiliser de vrai nom ni
            de coordonnées personnelles comme pseudonyme ou dans le chat.
          </LegalParagraph>
        </LegalArticle>

        <LegalArticle title="8. Vos droits (RGPD)">
          <LegalParagraph>
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
            rectification, d&apos;effacement, d&apos;opposition, de limitation
            et de portabilité de vos données. Le site ne conservant aucune
            donnée liée à un compte, la plupart de ces données disparaissent
            quand vous quittez le salon ; celles de votre navigateur se
            suppriment comme indiqué à l&apos;article 6.
          </LegalParagraph>
          <LegalParagraph>
            Pour toute demande, contactez l&apos;éditeur :
          </LegalParagraph>
          <div className="mt-2 text-center text-lg">
            <EmailLink className={emailLinkClass} />
          </div>
          <LegalParagraph>
            Vous pouvez également introduire une réclamation auprès de la
            CNIL (Commission Nationale de l&apos;Informatique et des Libertés,{" "}
            <a
              className={externalLinkClass}
              href="https://www.cnil.fr/"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.cnil.fr
            </a>
            ).
          </LegalParagraph>
          <LegalParagraph>
            Pour signaler un contenu illicite publié dans le chat, écrivez à la
            même adresse.
          </LegalParagraph>
        </LegalArticle>
      </div>
    </LegalSection>
  );
}
