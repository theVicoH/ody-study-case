const ALLOWED_DURATIONS = new Set([
  "instant", "fast", "base", "slow", "slower"
]);

const ALLOWED_EASINGS = new Set([
  "linear", "in", "out", "in-out", "emphasized", "bounce"
]);

const DEFAULT_DURATIONS = new Set([
  "0", "75", "100", "150", "200", "300", "500", "700", "1000"
]);

const ARBITRARY_RE = /^\[/;

const checkClassNames = (context, node, value: string) => {
  if (typeof value !== "string") return;

  for (const cls of value.split(/\s+/)) {
    if (!cls) continue;

    const baseClass = cls.replace(/^[a-z0-9-]+:/, "");

    if (baseClass.startsWith("duration-")) {
      const suffix = baseClass.slice(9);

      if (ALLOWED_DURATIONS.has(suffix)) continue;

      if (ARBITRARY_RE.test(suffix)) {
        context.report({
          node,
          messageId: "noArbitraryDuration",
          data: { cls }
        });
      } else if (DEFAULT_DURATIONS.has(suffix)) {
        context.report({
          node,
          messageId: "useDurationToken",
          data: { cls }
        });
      } else {
        context.report({
          node,
          messageId: "useDurationToken",
          data: { cls }
        });
      }

      continue;
    }

    if (baseClass.startsWith("ease-")) {
      const suffix = baseClass.slice(5);

      if (ALLOWED_EASINGS.has(suffix)) continue;

      if (ARBITRARY_RE.test(suffix)) {
        context.report({
          node,
          messageId: "noArbitraryEasing",
          data: { cls }
        });
      } else {
        context.report({
          node,
          messageId: "useEasingToken",
          data: { cls }
        });
      }
    }
  }
};

export default {
  meta: {
    type: "problem",
    docs: { description: "Enforce design system motion tokens instead of raw Tailwind duration/easing values" },
    messages: {
      useDurationToken:
        "'{{cls}}' uses a raw duration. Use a motion token: duration-instant, duration-fast, duration-base, duration-slow, duration-slower",
      noArbitraryDuration:
        "'{{cls}}' uses an arbitrary duration. Use a motion token: duration-instant, duration-fast, duration-base, duration-slow, duration-slower",
      useEasingToken:
        "'{{cls}}' uses a non-token easing. Use a motion token: ease-linear, ease-in, ease-out, ease-in-out, ease-emphasized, ease-bounce",
      noArbitraryEasing:
        "'{{cls}}' uses an arbitrary easing. Use a motion token: ease-linear, ease-in, ease-out, ease-in-out, ease-emphasized, ease-bounce"
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
