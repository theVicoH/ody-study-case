import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";

import "../src/styles/globals.css";
import "../src/styles/storybook.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
    backgrounds: { disable: true },
    viewport: {
      defaultViewport: "responsive",
    },
    options: {
      storySort: {
        order: [
          "Foundations", ["Introduction", "Principles", "Getting Started", "Theming", "Accessibility", "Icons"],
          "Tokens", ["Colors", "Typography", "Spacing", "Radius", "Elevation", "Motion", "Glass Surfaces", "Gradients & Effects"],
          "Components", ["Primitives", "Atoms", "Layouts"],
          "Patterns",
        ],
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "dark",
    }),
  ],
};

export default preview;
