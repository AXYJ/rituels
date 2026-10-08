import { ReactNode } from "react";

// Section de la page avec son grand titre ; `id` permet d'y faire défiler directement
export function LegalSection({
  title,
  id,
  className = "",
  children,
}: {
  title: string;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`flex flex-col ${className}`}>
      <div className="mb-16 flex flex-col items-center justify-center gap-8 text-center">
        <h1 className="text-6xl text-white">{title}</h1>
      </div>
      {children}
    </section>
  );
}

// Bloc de texte avec un titre optionnel
export function LegalArticle({
  title,
  className = "",
  children,
}: {
  title?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article className={`flex flex-col gap-4 ${className}`}>
      {title && <h2>{title}</h2>}
      {children}
    </article>
  );
}

export function LegalParagraph({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p className={`text-lg leading-relaxed text-white/80 ${className}`}>
      {children}
    </p>
  );
}
