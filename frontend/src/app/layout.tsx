import type { Metadata, Viewport } from "next";
import "./globals.css";
import OrientationGuard from "../components/OrientationGuard";

export const viewport: Viewport = {
  themeColor: "#191918",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://rituels.xiao-web.com"
  ),
  title: {
    default: "Rituels — Le jeu de cartes des sujets d'expérience",
    template: "%s | Rituels",
  },
  description:
    "Rituels, jeu de cartes en ligne pour 2-4 joueurs. Posez vos cartes, déduisez la logique changeante du système et récoltez vos graines avant les autres.",
  applicationName: "Rituels",
  authors: [{ name: "Rituels" }],
  creator: "Rituels",
  publisher: "Rituels",
  keywords: [
    "jeu de cartes",
    "jeu de cartes en ligne",
    "jeu de déduction",
    "règles changeantes",
    "jeu multijoueur",
    "jeu entre amis",
    "rituels",
    "rituels jeu",
    "laboratoire skinner",
    "jeu de société en ligne",
    "jeu entre amis à distance",
    "superstition pigeon skinner",
    "expérience skinner jeu",
    "jeu de cartes mystérieux",
    "jeu de cartes psychologique",
    "cartes de zener"

  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "Rituels",
    title: "Rituels — Le jeu de cartes des sujets d'expérience",
    description:
      "Rituels, jeu de cartes en ligne pour 2-4 joueurs. Posez vos cartes, déduisez la logique changeante du système et récoltez vos graines avant les autres.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Rituels - Jeu de cartes expérimental",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rituels — Le jeu de cartes des sujets d'expérience",
    description:
      "Rituels, jeu de cartes en ligne pour 2-4 joueurs. Posez vos cartes, déduisez la logique changeante du système et récoltez vos graines avant les autres.",
    images: ["/opengraph-image.png"],
  },
  category: "game",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Rituels",
  url: "https://rituels.xiao-web.com",
  description:
    "Rituels, jeu de cartes en ligne pour 2-4 joueurs. Posez vos cartes, déduisez la logique changeante du système et récoltez vos graines avant les autres.",
  applicationCategory: "GameApplication",
  genre: ["Jeu de cartes", "Déduction", "Multijoueur"],
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
  inLanguage: "fr-FR",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <OrientationGuard />
        {children}
      </body>
    </html>
  );
}
