import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/signin", "/signup", "/privacidad"],
        disallow: ["/app/"],
      },
    ],
    sitemap: "http://localhost:3000/sitemap.xml",
  };
}

