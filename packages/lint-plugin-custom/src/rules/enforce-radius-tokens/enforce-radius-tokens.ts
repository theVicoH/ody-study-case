const RADIUS_PREFIX_RE =
  /^(rounded(?:-(?:t|r|b|l|tl|tr|br|bl|ss|se|es|ee))?)-(.+)$/;

const ALLOWED_RADIUS = new Set([
  "none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "full"
]);

const ARBITRARY_RE = /^\[/;

const checkClassNames = (context, node, value: string) => {
  if (typeof value !== "string") return;

  for (const cls of value.split(/\s+/)) {
    if (!cls) continue;

    const baseClass = cls.replace(/^[a-z0-9-]+:/, "");

    if (baseClass === "rounded") continue;

    const match = baseClass.match(RADIUS_PREFIX_RE);

    if (!match) continue;

    const suffix = match[2];

    if (ALLOWED_RADIUS.has(suffix)) continue;

    if (ARBITRARY_RE.test(suffix)) {
      context.report({
        node,
        messageId: "noArbitraryRadius",
        data: { cls }
      });
    } else {
      context.report({
        node,
        messageId: "useRadiusToken",
        data: { cls }
      });
    }
  }
};

export default {
  meta: {
    type: "problem",
    docs: { description: "Enforce design system radius tokens instead of raw Tailwind/arbitrary radius values" },
    messages: {
      useRadiusToken:
        "'{{cls}}' uses a non-token radius. Use: rounded, rounded-none, rounded-xs, rounded-sm, rounded-md, rounded-lg, rounded-xl, rounded-2xl, rounded-3xl, rounded-4xl, rounded-5xl, rounded-full",
      noArbitraryRadius:
        "'{{cls}}' uses an arbitrary radius value. Use a radius token: rounded-none/xs/sm/md/lg/xl/2xl/3xl/4xl/5xl/full"
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
