import fileNaming from "./rules/file-naming/file-naming";
import noHardcodedText from "./rules/no-hardcoded-text/no-hardcoded-text";
import noUnnecessaryComments from "./rules/no-unnecessary-comments/no-unnecessary-comments";
import requireComponentStory from "./rules/require-component-story/require-component-story";
import requireUnitTest from "./rules/require-unit-test/require-unit-test";
import noRelativeParentImports from "./rules/no-relative-parent-imports/no-relative-parent-imports";
import enforceExplicitImports from "./rules/enforce-explicit-imports/enforce-explicit-imports";
import enforceFolderStructure from "./rules/enforce-folder-structure/enforce-folder-structure";
import noArbitraryColorValues from "./rules/no-arbitrary-color-values/no-arbitrary-color-values";
import fixRawTailwindColors from "./rules/fix-raw-tailwind-colors/fix-raw-tailwind-colors";
import fixExplicitAny from "./rules/fix-explicit-any/fix-explicit-any";
import enforceFileSuffix from "./rules/enforce-file-suffix/enforce-file-suffix";
import oneComponentPerFolder from "./rules/one-component-per-folder/one-component-per-folder";
import noMagicNumbers from "./rules/no-magic-numbers/no-magic-numbers";
import enforceSpacingTokens from "./rules/enforce-spacing-tokens/enforce-spacing-tokens";
import enforceRadiusTokens from "./rules/enforce-radius-tokens/enforce-radius-tokens";
import enforceShadowTokens from "./rules/enforce-shadow-tokens/enforce-shadow-tokens";
import enforceTypographyTokens from "./rules/enforce-typography-tokens/enforce-typography-tokens";
import enforceMotionTokens from "./rules/enforce-motion-tokens/enforce-motion-tokens";

export default {
  meta: { name: "custom" },
  rules: {
    "file-naming": fileNaming,
    "no-hardcoded-text": noHardcodedText,
    "no-unnecessary-comments": noUnnecessaryComments,
    "require-component-story": requireComponentStory,
    "require-unit-test": requireUnitTest,
    "no-relative-parent-imports": noRelativeParentImports,
    "enforce-explicit-imports": enforceExplicitImports,
    "enforce-folder-structure": enforceFolderStructure,
    "no-arbitrary-color-values": noArbitraryColorValues,
    "fix-raw-tailwind-colors": fixRawTailwindColors,
    "fix-explicit-any": fixExplicitAny,
    "enforce-file-suffix": enforceFileSuffix,
    "one-component-per-folder": oneComponentPerFolder,
    "no-magic-numbers": noMagicNumbers,
    "enforce-spacing-tokens": enforceSpacingTokens,
    "enforce-radius-tokens": enforceRadiusTokens,
    "enforce-shadow-tokens": enforceShadowTokens,
    "enforce-typography-tokens": enforceTypographyTokens,
    "enforce-motion-tokens": enforceMotionTokens
  }
};
