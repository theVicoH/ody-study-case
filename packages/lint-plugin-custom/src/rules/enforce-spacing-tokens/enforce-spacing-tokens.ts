const SPACING_PREFIX_RE =
  /^(px|py|pt|pr|pb|pl|ps|pe|mx|my|mt|mr|mb|ml|ms|me|gap-x|gap-y|space-x|space-y|inset-x|inset-y|min-w|min-h|max-w|max-h|inset|gap|top|right|bottom|left|start|end|size|p|m|w|h)-(.+)$/;

const ALLOWED_SUFFIXES = new Set([
  "3xs", "2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl",
  "0", "px", "auto", "full", "screen", "fit", "min", "max",
  "svh", "lvh", "dvh", "svw", "lvw", "dvw"
]);

const NUMERIC_RE = /^\d+(\.\d+)?$/;
const FRACTION_RE = /^\d+\/\d+$/;
const ARBITRARY_RE = /^\[/;

const getSpacingSuggestion = (suffix: string): string => {
  const num = parseFloat(suffix);

  if (num === 0) return "Use 0 directly";
  if (num <= 0.125) return "3xs (0.125rem)";
  if (num <= 0.25) return "2xs (0.25rem)";
  if (num <= 0.5) return "xs (0.5rem)";
  if (num <= 0.75) return "sm (0.75rem)";
  if (num <= 1) return "md (1rem)";
  if (num <= 1.5) return "lg (1.5rem)";
  if (num <= 2) return "xl (2rem)";
  if (num <= 3) return "2xl (3rem)";
  if (num <= 4) return "3xl (4rem)";

  return "4xl (6rem)";
};

const checkClassNames = (context, node, value: string) => {
  if (typeof value !== "string") return;

  for (const cls of value.split(/\s+/)) {
    if (!cls) continue;

    const baseClass = cls.replace(/^[a-z0-9-]+:/, "");
    const match = baseClass.match(SPACING_PREFIX_RE);

    if (!match) continue;

    const suffix = match[2];

    if (ALLOWED_SUFFIXES.has(suffix)) continue;
    if (FRACTION_RE.test(suffix)) continue;

    if (NUMERIC_RE.test(suffix)) {
      context.report({
        node,
        messageId: "useSpacingToken",
        data: {
          cls,
          suggestion: getSpacingSuggestion(suffix)
        }
      });
    } else if (ARBITRARY_RE.test(suffix)) {
      context.report({
        node,
        messageId: "noArbitrarySpacing",
        data: { cls }
      });
    }
  }
};

export default {
  meta: {
    type: "problem",
    docs: { description: "Enforce design system spacing tokens instead of raw Tailwind numeric/arbitrary spacing" },
    messages: {
      useSpacingToken:
        "'{{cls}}' uses a raw numeric value. Use a spacing token instead (closest: {{suggestion}}). Available: p-3xs, p-2xs, p-xs, p-sm, p-md, p-lg, p-xl, p-2xl, p-3xl, p-4xl (same for m, gap, w, h, inset, top, right, bottom, left, etc.)",
      noArbitrarySpacing:
        "'{{cls}}' uses an arbitrary spacing value. Use a spacing token: p-3xs/2xs/xs/sm/md/lg/xl/2xl/3xl/4xl or special values: p-0, p-auto, p-full, p-screen, p-fit, p-min, p-max"
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
