import { LegalSection, LegalArticle, LegalParagraph } from "./LegalBlocks";

const CREDITS = [
  {
    title: "Musique",
    items: [
      '"Sunshine through Feathers" - Nicolas Merva, composée spécialement pour Rituels et utilisée avec son accord',
    ],
  },
  {
    title: "Effets sonores",
    items: [
      '"ShuffleAndCardFlip1" - hartleysaurus (via freesound_community), Pixabay, licence de contenu Pixabay, extrait modifié',
      '"New Notification 040" - Universfield, Pixabay, licence de contenu Pixabay',
    ],
  },
  {
    title: "Illustrations et animations",
    items: ["Cartes, personnages, décors et animations : créés par l'éditeur du site"],
  },
];

export default function CreditsSection() {
  return (
    <LegalSection title="Crédits" id="credits" className="py-16 pb-32">
      <div className="grid gap-16">
        {CREDITS.map(({ title, items }) => (
          <LegalArticle key={title} title={title}>
            {items.map((item) => (
              <LegalParagraph key={item}>{item}</LegalParagraph>
            ))}
          </LegalArticle>
        ))}
      </div>
    </LegalSection>
  );
}
