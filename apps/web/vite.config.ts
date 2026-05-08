import path from "path"

import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import tailwindcss from "@tailwindcss/vite"
import viteReact from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"
import viteTsConfigPaths from "vite-tsconfig-paths"
import type { Plugin } from "vite"

const packagesRoot = path.resolve(__dirname, "../../packages")
const webSrc = path.resolve(__dirname, "src")

const packageSrcMap: Array<{ match: string; src: string }> = [
  { match: "/packages/ui/", src: path.join(packagesRoot, "ui/src") },
  { match: "/packages/client/", src: path.join(packagesRoot, "client/src") },
  { match: "/packages/domain/", src: path.join(packagesRoot, "domain/src") },
  { match: "/packages/application/", src: path.join(packagesRoot, "application/src") },
  { match: "/packages/shared/", src: path.join(packagesRoot, "shared/src") },
]

function monorepoAtAlias(): Plugin {
  return {
    name: "monorepo-at-alias",
    enforce: "pre",
    async resolveId(source, importer) {
      if (!source.startsWith("@/")) return null

      const rel = source.slice(2)
      const pkg = packageSrcMap.find((p) => importer?.includes(p.match))
      const base = pkg ? pkg.src : webSrc

      return this.resolve(path.resolve(base, rel), importer, { skipSelf: true })
    },
  }
}

const config = defineConfig({
  plugins: [
    nitro(),
    monorepoAtAlias(),
    viteTsConfigPaths({
      root: "../../",
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  resolve: {
    dedupe: [
      "react",
      "react-dom",
      "@tanstack/react-query",
      "@tanstack/react-router",
      "react-i18next",
      "i18next"
    ]
  },
  envDir: path.resolve(__dirname, "../../"),
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true
      }
    }
  }
})

export default config
