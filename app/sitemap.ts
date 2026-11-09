import { MetadataRoute } from "next";
import { TOOLS_REGISTRY } from "@/data/toolsRegistry";
import { AI_CATEGORIES, getAllAiTools } from "@/data/aiToolsDirectory";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || "https://ai-text-utility.vercel.app").replace(/\/+$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Dedicated client-side document converter routes
  const converterRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/tools/pdf-to-word`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools/word-to-pdf`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Only index verified public tool pages
  const toolRoutes: MetadataRoute.Sitemap = TOOLS_REGISTRY.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: tool.featured ? 0.9 : 0.7,
  }));

  // Curated AI Directory programmatic routes
  const directoryRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/ai-tools`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    ...AI_CATEGORIES.map((cat) => ({
      url: `${baseUrl}/ai-tools/${cat.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...getAllAiTools().map((tool) => ({
      url: `${baseUrl}/ai-tools/alternatives/${tool.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  return [...staticRoutes, ...converterRoutes, ...toolRoutes, ...directoryRoutes];
}
