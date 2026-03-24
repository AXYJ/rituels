import type { Metadata } from "next";
import "./globals.css";
import OrientationGuard from "../components/OrientationGuard";

export const metadata: Metadata = {
  title: "Rituels",
  description: "Projet Rituels",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <OrientationGuard />
        {children}
      </body>
    </html>
  );
}
