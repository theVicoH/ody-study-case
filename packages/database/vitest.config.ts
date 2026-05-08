import { defineConfig, mergeConfig } from "vitest/config";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default mergeConfig(
  defineConfig({
    test: {
      environment: "node",
      globals: true,
      include: ["src/**/*.test.ts"],
      reporters: ["verbose"],
      passWithNoTests: true,
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        exclude: ["node_modules/**", "**/index.ts"]
      }
    }
  }),
  defineConfig({
    plugins: [viteTsConfigPaths()]
  })
);
