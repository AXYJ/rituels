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
          <LegalParagraph>
            <Label>Nom :</Label> Alex Xiao
          </LegalParagraph>
          <LegalParagraph>
            <Label>Contact :</Label> <EmailLink className={linkClass} />
          </LegalParagraph>
        </LegalArticle>

        <LegalArticle title="Hébergeur" className="items-center">
          <LegalParagraph className="text-center">
            <Label>Nom :</Label> Hostinger
          </LegalParagraph>
          <LegalParagraph className="text-center">
            <Label>Adresse postale :</Label>
            <br />
            UAB &quot;HOSTINGER LT&quot;,
            <br />
            Švitrigailos g. 34C, LT-03110 Vilnius,
            <br />
            Lituanie
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
