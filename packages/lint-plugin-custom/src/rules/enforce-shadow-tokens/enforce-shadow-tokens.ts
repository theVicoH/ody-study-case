const SHADOW_RE = /^shadow-(.+)$/;

const ALLOWED_SHADOWS = new Set([
  "xs", "sm", "md", "lg", "xl", "primary", "none"
]);

const ARBITRARY_RE = /^\[/;

const checkClassNames = (context, node, value: string) => {
  if (typeof value !== "string") return;

  for (const cls of value.split(/\s+/)) {
    if (!cls) continue;

    const baseClass = cls.replace(/^[a-z0-9-]+:/, "");

    if (baseClass === "shadow") continue;

    const match = baseClass.match(SHADOW_RE);

    if (!match) continue;

    const suffix = match[1];

    if (ALLOWED_SHADOWS.has(suffix)) continue;

    if (ARBITRARY_RE.test(suffix)) {
      context.report({
        node,
        messageId: "noArbitraryShadow",
        data: { cls }
      });
    } else {
      context.report({
        node,
        messageId: "useShadowToken",
        data: { cls }
      });
    }
  }
};

export default {
  meta: {
    type: "problem",
    docs: { description: "Enforce design system shadow tokens instead of raw Tailwind/arbitrary shadow values" },
    messages: {
      useShadowToken:
        "'{{cls}}' uses a non-token shadow. Use: shadow, shadow-xs, shadow-sm, shadow-md, shadow-lg, shadow-xl, shadow-primary, shadow-none",
      noArbitraryShadow:
        "'{{cls}}' uses an arbitrary shadow value. Use a shadow token: shadow-xs/sm/md/lg/xl/primary/none"
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
