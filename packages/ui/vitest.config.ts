import { defineConfig, mergeConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    resolve: {
      dedupe: ["react", "react-dom", "react-i18next", "i18next"]
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/test-setup.ts"],
      include: ["src/**/*.test.{ts,tsx}"],
      reporters: ["verbose"],
      passWithNoTests: true,
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        exclude: [
          "node_modules/**",
          "dist/**",
          "**/*.stories.{ts,tsx}",
          "**/*.config.{ts,js}",
          "**/index.ts",
        ],
      },
    },
  }),
  defineConfig({
    plugins: [
      viteTsConfigPaths({
        projects: ["./tsconfig.json", "../client/tsconfig.json"],
      }),
    ],
  })
);
