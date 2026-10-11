import Link from "next/link";

const LEGAL_LINKS = [
  { label: "Mentions légales et confidentialité", href: "/mentions-legales" },
  { label: "Crédits", href: "/mentions-legales#credits" },
];

export default function HomeFooter() {
  return (
    <footer className="bg-[#191918] py-8 text-center text-white">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex gap-16">
          {LEGAL_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} className="hover:underline">
              {label}
            </Link>
          ))}
        </div>

        <p>© Rituels 2026</p>
      </div>
    </footer>
  );
}
