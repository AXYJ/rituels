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
    default: "Rituels - Le jeu de cartes expérimental aux règles changeantes",
    template: "%s | Rituels",
  },
  description:
    "Rituels est un jeu de cartes expérimental pour 2 à 4 joueurs où le but est d'être le premier joueur à atteindre le quota de graines fixé à l'avance.",
  applicationName: "Rituels",
  authors: [{ name: "Rituels" }],
  creator: "Rituels",
  publisher: "Rituels",
  keywords: [
    "jeu de cartes",
    "jeu de cartes en ligne",
    "jeu de stratégie",
    "jeu de déduction",
    "règles changeantes",
    "jeu multijoueur",
    "jeu entre amis",
    "rituels",
    "rituels jeu",
    "laboratoire skinner",
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
  manifest: "/manifest.json",
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
    title: "Rituels - Le jeu de cartes expérimental aux règles changeantes",
    description:
      "Rituels est un jeu de cartes expérimental pour 2 à 4 joueurs où le but est d'être le premier joueur à atteindre le quota de graines fixé à l'avance.",
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
    title: "Rituels - Le jeu de cartes expérimental aux règles changeantes",
    description:
      "Rituels est un jeu de cartes expérimental pour 2 à 4 joueurs où le but est d'être le premier joueur à atteindre le quota de graines fixé à l'avance.",
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
    "Rituels est un jeu de cartes expérimental pour 2 à 4 joueurs où le but est d'être le premier joueur à atteindre le quota de graines fixé à l'avance.",
  applicationCategory: "GameApplication",
  genre: ["Jeu de cartes", "Stratégie", "Déduction", "Multijoueur"],
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
