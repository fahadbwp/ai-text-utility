import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || "https://ai-text-utility.vercel.app").replace(/\/+$/, "");

  return {
    rules: [
      {
        // Allow all crawlers including AI search bots full access to public content
        userAgent: "*",
        allow: ["/", "/tools/", "/ai-tools/", "/about", "/contact", "/privacy", "/terms"],
        disallow: [
          "/api/",
          "/admin/",
          "/private/",
        ],
      },
      // Explicit allow for AI search engine crawlers
      { userAgent: "OAI-SearchBot", allow: ["/"] },
      { userAgent: "PerplexityBot", allow: ["/"] },
      { userAgent: "ClaudeBot", allow: ["/"] },
      { userAgent: "Bingbot", allow: ["/"] },
      { userAgent: "Googlebot", allow: ["/"] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
