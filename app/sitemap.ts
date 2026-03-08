import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "http://localhost:3000";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/signin`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/signup`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];
}

