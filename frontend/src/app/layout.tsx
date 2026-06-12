import type { Metadata } from "next";
import "./globals.css";
import OrientationGuard from "../components/OrientationGuard";

export const metadata: Metadata = {
  title: "Rituels",
  description: "Jouer à Rituels, le jeu qui met à l'épreuve vos neurones !",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <OrientationGuard />
        {children}
      </body>
    </html>
  );
}
