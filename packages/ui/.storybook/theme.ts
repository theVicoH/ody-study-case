import { create } from "@storybook/theming/create";

export const darkTheme = create({
  base: "dark",

  brandTitle: "ODY UI",

  // Page
  appBg: "#14151f",
  appContentBg: "#14151f",
  appPreviewBg: "#14151f",
  appBorderColor: "rgba(168, 85, 247, 0.18)",
  appBorderRadius: 10,

  // Toolbar (zoom bar inside docs story)
  barBg: "#111220",
  barTextColor: "#8888aa",
  barHoverColor: "#e0e0f0",
  barSelectedColor: "#a855f7",

  // Inputs (args table controls)
  inputBg: "#1a1b2c",
  inputBorder: "rgba(255, 255, 255, 0.08)",
  inputTextColor: "#e0e0f0",
  inputBorderRadius: 6,

  // Text
  textColor: "#e0e0f0",
  textInverseColor: "#14151f",
  textMutedColor: "#7070a0",

  // Accent
  colorPrimary: "#a855f7",
  colorSecondary: "#a855f7",
});

export const lightTheme = create({
  base: "light",

  brandTitle: "ODY UI",

  appBg: "#f8f8fc",
  appContentBg: "#ffffff",
  appPreviewBg: "#f8f8fc",
  appBorderColor: "rgba(168, 85, 247, 0.2)",
  appBorderRadius: 10,

  barBg: "#ffffff",
  barTextColor: "#555575",
  barHoverColor: "#1a1a2e",
  barSelectedColor: "#7c3aed",

  inputBg: "#f0f0f8",
  inputBorder: "rgba(0, 0, 0, 0.1)",
  inputTextColor: "#1a1a2e",
  inputBorderRadius: 6,

  textColor: "#1a1a2e",
  textInverseColor: "#ffffff",
  textMutedColor: "#7070a0",

  colorPrimary: "#7c3aed",
  colorSecondary: "#7c3aed",
});
