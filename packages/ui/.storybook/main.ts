import path from "path";

import tailwindcss from "@tailwindcss/vite";
import type { StorybookConfig } from "@storybook/react-vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.@(ts|tsx)",
    "../../../apps/web/src/**/*.stories.@(ts|tsx)",
  ],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.plugins = [
      ...(config.plugins ?? []),
      tailwindcss(),
      viteTsConfigPaths({
        projects: [
          path.resolve(__dirname, "../tsconfig.json"),
          path.resolve(__dirname, "../../../apps/web/tsconfig.json"),
        ],
      }),
    ];

    return config;
  },
};

export default config;
