import type { MetadataRoute } from "next";

// Mettre à jour ces dates uniquement quand le contenu de la page change.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://rituels.xiao-web.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-10-11"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date("2026-10-10"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
