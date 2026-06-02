import type { MetadataRoute } from "next";

const base = "https://www.public-id.co.kr";
const routes = ["", "/subscribe", "/work", "/about", "/credentials", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${base}${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
