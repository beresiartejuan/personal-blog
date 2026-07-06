// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

import vercel from "@astrojs/vercel";

import sitemap from "@astrojs/sitemap";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.beresiarte.xyz",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx(), sitemap(), preact()],
  adapter: vercel(),
  output: "server"
});