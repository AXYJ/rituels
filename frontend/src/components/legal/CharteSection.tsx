import { LegalSection, LegalArticle, LegalParagraph } from "./LegalBlocks";

const INCOMPATIBLE_PROFILES = [
  "Les Déterministes Rigides : Les personnes croyant que \"1 + 1 font toujours 2\". Ici, 1 + 1 peut faire -2 si la couleur est d'humeur taquine.",
  "Les Ornithophobes : Par respect pour l'inspiration de l'expérience, bien qu'aucun pigeon n'ait été maltraité (physiquement) durant le développement.",
  "Les daltoniens et les dyslexiques : La perception des couleurs et des symboles peut en être altérée.",
  "Les cartomenciens du dimanche : Toute tentative de lire dans les cartes se soldera par un échec. Le système est purement mathématique, même s'il ne vous aime pas.",
];

export default function CharteSection() {
  return (
    <LegalSection title="Charte du Protocole Rituels" className="gap-8 pb-16">
      <div className="grid gap-16">
        <LegalArticle title="Article 1 : Responsabilités et Effets Secondaires">
          <LegalParagraph>
            &quot;Rituels&quot; décline toute responsabilité en cas de besoin
            irrépressible de picorer des graines au sol ou de hocher la tête de
            manière saccadée. Dans ce cas de figure, veuillez consulter un
            vétérinaire.
          </LegalParagraph>
        </LegalArticle>

        <LegalArticle title="Article 2 : Profils Incompatibles">
          <LegalParagraph>
            L&apos;accès au protocole Rituels est fortement déconseillé aux
            catégories de sujets suivantes :
          </LegalParagraph>
          <ul className="list-inside list-[decimal-leading-zero] space-y-2 text-lg leading-relaxed text-white/80">
            {INCOMPATIBLE_PROFILES.map((profile) => (
              <li key={profile} className="text-2xl">
                {profile}
              </li>
            ))}
          </ul>
        </LegalArticle>

        <LegalArticle title="Article 3 : Propriété Intellectuelle des Échecs">
          <LegalParagraph>
            Toute stratégie perdante développée durant le test devient la
            propriété exclusive du Laboratoire. Nous nous réservons le droit de
            rire de vos hypothèses erronées enregistrées dans votre bloc-notes
            lors de nos prochaines réunions de département.
          </LegalParagraph>
          <LegalParagraph>
            Le Laboratoire se réserve le droit d&apos;utiliser vos échecs comme
            exemples pédagogiques pour les sujets suivants.
          </LegalParagraph>
        </LegalArticle>

        <LegalArticle title="Article 4 : Résolution des Conflits">
          <LegalParagraph>
            En cas de désaccord avec le système, c&apos;est le système qui a
            raison. Toute plainte doit être formulée en picorant trois fois le
            sol et en inclinant la tête de manière saccadée.
          </LegalParagraph>
        </LegalArticle>

        <LegalArticle title="Article 5 : Conditions de Fin de Protocole">
          <LegalParagraph>
            Aucune condition d&apos;arrêt n&apos;est prévue pour le moment.
          </LegalParagraph>
        </LegalArticle>
      </div>
    </LegalSection>
  );
}
