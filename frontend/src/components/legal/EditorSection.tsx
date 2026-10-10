import EmailLink from "../EmailLink";
import { LegalSection, LegalArticle, LegalParagraph } from "./LegalBlocks";

const linkClass =
  "text-white underline transition-colors hover:text-gray-300";

function Label({ children }: { children: string }) {
  return <span className="font-semibold text-white">{children}</span>;
}

export default function EditorSection() {
  return (
    <LegalSection title="Mentions Légales" className="gap-8 py-16">
      <div className="grid gap-16 md:grid-cols-2">
        <LegalArticle title="Éditeur" className="items-center">
          <LegalParagraph className="text-center">
            Site édité à titre non professionnel par un particulier, qui a
            choisi de rester anonyme conformément à l&apos;article 6-III-2 de
            la loi n° 2004-575 du 21 juin 2004 (LCEN). Son identité a été
            communiquée à l&apos;hébergeur ci-contre.
          </LegalParagraph>
          <LegalParagraph>
            <Label>Contact :</Label> <EmailLink className={linkClass} />
          </LegalParagraph>
        </LegalArticle>

        <LegalArticle title="Hébergeur" className="items-center">
          <LegalParagraph className="text-center">
            <Label>Nom :</Label> Hostinger, UAB
          </LegalParagraph>
          <LegalParagraph className="text-center">
            <Label>Adresse postale :</Label>
            <br />
            Švitrigailos g. 34,
            <br />
            LT-03230 Vilnius,
            <br />
            Lituanie
          </LegalParagraph>
          <LegalParagraph className="text-center">
            <Label>Téléphone :</Label> +370 6003 1712
          </LegalParagraph>
          <LegalParagraph>
            <Label>Site Web :</Label>{" "}
            <a
              className={linkClass}
              href="https://www.hostinger.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.hostinger.com
            </a>
          </LegalParagraph>
        </LegalArticle>
      </div>
    </LegalSection>
  );
}
