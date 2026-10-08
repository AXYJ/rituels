import EmailLink from "../EmailLink";
import { LegalSection, LegalArticle, LegalParagraph } from "./LegalBlocks";

const DATA_ROWS = [
  {
    data: "Pseudonyme",
    purpose:
      "Identifier le joueur auprès des autres participants du salon et pré-remplir le champ de saisie lors des prochaines visites.",
    retention:
      "Conservé localement sur votre navigateur (localStorage) jusqu'à ce que vous le supprimiez.",
  },
  {
    data: "Code / Numéro de salon",
    purpose:
      "Permettre de rejoindre ou rester connecté à son salon de jeu actif (notamment en cas de rechargement de page).",
    retention:
      "Conservé pour la durée de la session de navigation (sessionStorage) et supprimé à la fermeture de l'onglet ou du navigateur.",
  },
  {
    data: "Données de partie",
    purpose:
      "Assurer le bon fonctionnement des mécaniques de jeu en temps réel via WebSockets (scores, réponses, état du jeu).",
    retention:
      "Traitées uniquement en mémoire vive (RAM) du serveur et supprimées automatiquement dès que tous les joueurs quittent le salon.",
  },
  {
    data: "Réglages du volume sonore",
    purpose:
      "Mémoriser les réglages de volume sonore générale et des effets sonores choisis par le joueur pour les sessions futures.",
    retention:
      "Conservés localement sur votre navigateur (localStorage) jusqu'à ce que vous les supprimiez.",
  },
  {
    data: "Statut de première visite",
    purpose:
      "Déterminer s'il convient de lancer ou d'ignorer l'animation d'introduction au chargement de l'accueil.",
    retention:
      "Conservé localement sur votre navigateur (localStorage) jusqu'à ce que vous le supprimiez.",
  },
  {
    data: "Identifiant de session (Session ID)",
    purpose:
      "Associer de manière unique le joueur à sa connexion en cours et permettre la reconnexion automatique en cas de coupure réseau.",
    retention:
      "Conservé localement sur votre navigateur (localStorage) pour permettre les reconnexions.",
  },
  {
    data: "Pseudonyme et messages du chat",
    purpose:
      "Transmis à un service tiers de modération automatique par intelligence artificielle (Groq) afin de détecter et filtrer les contenus vulgaires, haineux ou sexuels avant diffusion aux autres joueurs.",
    retention:
      "Traités ponctuellement lors de l'envoi, non conservés par ce prestataire ni par Rituels au-delà de l'historique de la partie en cours (supprimé à la fermeture du salon).",
  },
];

const emailLinkClass =
  "font-semibold text-white underline transition-colors hover:text-gray-300";

export default function PrivacySection() {
  return (
    <LegalSection title="Politique de Confidentialité" className="gap-8 py-16">
      <div className="grid gap-12">
        <LegalArticle>
          <LegalParagraph>
            La protection de votre vie privée et de vos données personnelles
            est une priorité. Cette politique de confidentialité explique en
            toute transparence quelles données sont traitées lors de votre
            utilisation du jeu, pour quelles finalités et comment elles sont
            gérées.
          </LegalParagraph>
        </LegalArticle>

        <LegalArticle title="1. Principe général : Le respect de la vie privée par défaut">
          <LegalParagraph>
            Le jeu est conçu selon le principe de minimisation des données :{" "}
            <strong>aucune donnée n&apos;est conservée à long terme</strong>. Le
            traitement des données est temporaire, strictement limité au temps
            d&apos;une session de jeu, et hébergé en mémoire volatile (RAM).
          </LegalParagraph>
        </LegalArticle>

        <LegalArticle title="2. Données traitées et finalités">
          <LegalParagraph>
            Pendant votre navigation et vos parties, nous traitons uniquement
            les éléments suivants :
          </LegalParagraph>

          <div className="w-full overflow-x-auto rounded-lg border border-white/10 bg-white/5">
            <table className="w-full border-collapse text-left text-lg text-white">
              <thead>
                <tr className="border-b border-white/10 bg-white/10 font-semibold">
                  <th className="p-4">Donnée collectée</th>
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
            Aucune donnée n&apos;est vendue, cédée, ni partagée avec des régies
            publicitaires ou des tiers à des fins marketing.
          </p>
        </LegalArticle>

        <LegalArticle title="3. Durée de conservation et suppression automatique">
          <LegalParagraph>
            <strong>Suppression immédiate :</strong> Dès que tous les joueurs
            quittent un salon de jeu, l&apos;intégralité des données rattachées
            à ce salon (salon, pseudos, scores, états de partie) est{" "}
            <strong>définitivement effacée de la mémoire du serveur</strong>.
          </LegalParagraph>
          <LegalParagraph>
            <strong>Absence de base de données persistante :</strong> Aucune
            information relative à vos parties, historiques ou habitudes de jeu
            n&apos;est enregistrée dans une base de données permanente.
          </LegalParagraph>
        </LegalArticle>

        <LegalArticle title="4. Cookies et stockage local (LocalStorage / SessionStorage)">
          <LegalParagraph>
            Ce site &quot;n&apos;utilise aucun cookie publicitaire, aucun
            traceur tiers et aucun outil d&apos;analyse d&apos;audience
            invasif&quot; (type Google Analytics).
          </LegalParagraph>
          <LegalParagraph>
            Seuls des éléments strictement techniques et nécessaires au
            fonctionnement du service peuvent être déposés sur votre terminal :
          </LegalParagraph>
          <LegalParagraph className="border-l-2 border-white/50 pl-4 italic">
            <strong>Stockage local de confort :</strong> Votre navigateur peut
            garder en mémoire locale votre dernier pseudonyme utilisé ou le
            dernier code de salon pour vous éviter de les retaper lors
            d&apos;un rechargement de page.
          </LegalParagraph>
          <p className="mt-2 text-lg font-semibold text-white">
            Gestion et suppression :
          </p>
          <LegalParagraph>
            Conformément aux recommandations de la CNIL et du RGPD, ces
            traceurs purement techniques ne requièrent pas de consentement
            préalable par bandeau. Si vous souhaitez supprimer ces éléments
            locaux, vous pouvez le faire à tout moment :
          </LegalParagraph>
          <ul className="flex list-disc flex-col gap-2 pl-6 text-lg leading-relaxed text-white/80">
            <li>
              Directement depuis les paramètres de votre navigateur (section
              &quot;Historique&quot; {"->"} &quot;Effacer les données de
              navigation / Cookies et données de sites&quot;).
            </li>
            <li>
              Via l&apos;outil d&apos;inspection de votre navigateur (F12{" "}
              {"->"} Onglet Application ou Stockage {"->"} Local Storage /
              Cookies {"->"} Effacer).
            </li>
          </ul>
        </LegalArticle>

        <LegalArticle title="5. Vos droits (RGPD)">
          <LegalParagraph>
            Conformément au Règlement Général sur la Protection des Données
            (RGPD), vous disposez d&apos;un droit d&apos;accès, de
            rectification et de suppression de vos données personnelles.
          </LegalParagraph>
          <LegalParagraph>
            Compte tenu de l&apos;absence de stockage persistant et de comptes
            utilisateurs,{" "}
            <strong>
              quitter la partie et fermer votre navigateur supprime de facto
              l&apos;ensemble de vos données de session
            </strong>
            .
          </LegalParagraph>
          <LegalParagraph>
            Pour toute question ou demande relative à vos données, vous pouvez
            contacter l&apos;éditeur du site à l&apos;adresse suivante :
          </LegalParagraph>
          <div className="mt-2 text-center text-lg">
            <EmailLink className={emailLinkClass} />
          </div>
        </LegalArticle>
      </div>
    </LegalSection>
  );
}
