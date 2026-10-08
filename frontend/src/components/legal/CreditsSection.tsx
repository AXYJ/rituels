import { LegalSection, LegalArticle, LegalParagraph } from "./LegalBlocks";

const CREDITS = [
  {
    title: "Musique",
    items: ['"Sunshine through Feathers" - Nicolas Merva'],
  },
  {
    title: "Effets sonores",
    items: [
      '"ShuffleAndCardFlip 1" - Freesound_community',
      '"New Notification 040" - Universfield',
    ],
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
