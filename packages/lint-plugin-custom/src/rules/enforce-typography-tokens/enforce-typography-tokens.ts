const TYPO_PRESETS = new Set([
  "typo-display", "typo-h1", "typo-h2", "typo-h3", "typo-h4", "typo-h5",
  "typo-body-lg", "typo-body", "typo-body-sm",
  "typo-caption", "typo-overline", "typo-button", "typo-code"
]);

const ALLOWED_FONT_FAMILIES = new Set(["sans", "heading"]);

const TEXT_SIZE_SUFFIXES = new Set([
  "xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl"
]);

const TEXT_ALIGN_DECORATORS = new Set([
  "left", "center", "right", "justify", "balance",
  "wrap", "nowrap", "ellipsis", "clip", "truncate",
  "uppercase", "lowercase", "capitalize", "normal-case",
  "underline", "overline", "line-through", "no-underline",
  "decoration-solid", "decoration-double", "decoration-dotted",
  "decoration-dashed", "decoration-wavy", "decoration-auto",
  "decoration-from-font", "antialiased", "subpixel-antialiased",
  "italic", "not-italic", "ordinal", "slashed-zero",
  "lining-nums", "oldstyle-nums", "proportional-nums", "tabular-nums",
  "diagonal-fractions", "stacked-fractions", "normal-nums"
]);

const FONT_WEIGHT_CLASSES = new Set([
  "thin", "extralight", "light", "normal", "medium",
  "semibold", "bold", "extrabold", "black"
]);

const FONT_FAMILY_BLOCK = new Set(["mono", "serif"]);

const TRACKING_CLASSES = new Set([
  "tighter", "tight", "normal", "wide", "wider", "widest"
]);

const LEADING_CLASSES = new Set([
  "none", "tight", "snug", "normal", "relaxed", "loose"
]);

const LEADING_NUMERIC_RE = /^\d+$/;

const COLOR_TOKEN_PREFIXES_RE = /^(background|foreground|primary|secondary|accent|muted|card|popover|destructive|border|input|ring|sidebar|chart)/;

const checkClassNames = (context, node, value: string) => {
  if (typeof value !== "string") return;

  for (const cls of value.split(/\s+/)) {
    if (!cls) continue;

    const baseClass = cls.replace(/^[a-z0-9-]+:/, "");

    if (TYPO_PRESETS.has(baseClass)) continue;

    if (baseClass.startsWith("text-")) {
      const suffix = baseClass.slice(5);

      if (TEXT_ALIGN_DECORATORS.has(suffix)) continue;
      if (suffix.startsWith("[")) continue;
      if (COLOR_TOKEN_PREFIXES_RE.test(suffix)) continue;

      if (TEXT_SIZE_SUFFIXES.has(suffix)) {
        context.report({
          node,
          messageId: "useTypoPreset",
          data: { cls }
        });
      }

      continue;
    }

    if (baseClass.startsWith("font-")) {
      const suffix = baseClass.slice(5);

      if (ALLOWED_FONT_FAMILIES.has(suffix)) continue;
      if (suffix.startsWith("[")) continue;

      if (FONT_WEIGHT_CLASSES.has(suffix)) {
        context.report({
          node,
          messageId: "useTypoPreset",
          data: { cls }
        });
      }

      if (FONT_FAMILY_BLOCK.has(suffix)) {
        context.report({
          node,
          messageId: "useTypoPreset",
          data: { cls }
        });
      }

      continue;
    }

    if (baseClass.startsWith("tracking-")) {
      const suffix = baseClass.slice(9);

      if (TRACKING_CLASSES.has(suffix)) {
        context.report({
          node,
          messageId: "useTypoPreset",
          data: { cls }
        });
      }

      continue;
    }

    if (baseClass.startsWith("leading-")) {
      const suffix = baseClass.slice(8);

      if (LEADING_CLASSES.has(suffix) || LEADING_NUMERIC_RE.test(suffix)) {
        context.report({
          node,
          messageId: "useTypoPreset",
          data: { cls }
        });
      }
    }
  }
};

export default {
  meta: {
    type: "problem",
    docs: { description: "Enforce semantic typo presets instead of atomic text/font/tracking/leading utilities" },
    messages: {
      useTypoPreset:
        "'{{cls}}' is an atomic typography class. Use a typo preset instead: typo-display, typo-h1, typo-h2, typo-h3, typo-h4, typo-h5, typo-body-lg, typo-body, typo-body-sm, typo-caption, typo-overline, typo-button, typo-code"
    }
  },
  create(context) {
    const filename = context.filename;

    if (
      filename.includes(".test.") ||
      filename.includes(".spec.") ||
      filename.includes(".stories.") ||
      filename.includes("/components/ui/")
    ) {
      return {};
    }

    return {
      JSXAttribute(node: any) {
        if (node.name?.name !== "className" || !node.value) return;

        if (node.value.type === "Literal") {
          checkClassNames(context, node.value, node.value.value);
        } else if (node.value.type === "JSXExpressionContainer") {
          const expr = node.value.expression;

          if (expr.type === "Literal") {
            checkClassNames(context, expr, expr.value);
          } else if (expr.type === "TemplateLiteral") {
            for (const quasi of expr.quasis) {
              checkClassNames(context, quasi, quasi.value.cooked ?? quasi.value.raw);
            }
          }
        }
      }
    };
  }
};
