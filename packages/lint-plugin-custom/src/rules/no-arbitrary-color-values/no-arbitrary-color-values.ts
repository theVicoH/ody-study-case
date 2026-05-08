const arbitraryColorPattern =
  /\b(bg|text|border|ring|fill|stroke|from|via|to|placeholder|caret|accent|outline|divide|decoration|shadow)-\[(#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\(|hsla\()\S*?\]/g;

const tokenMap = {
  bg: "bg-muted",
  text: "text-muted-foreground",
  border: "border-border",
  ring: "ring-ring",
  fill: "fill-primary",
  stroke: "stroke-primary",
  from: "from-primary",
  via: "via-primary",
  to: "to-primary",
  placeholder: "placeholder-muted-foreground",
  caret: "caret-primary",
  accent: "accent-primary",
  outline: "outline-border",
  divide: "divide-border",
  decoration: "decoration-primary",
  shadow: "shadow"
};

const checkStringForArbitraryColors = (context, node, value, templateLiteralNode: { quasis: Array<{ value: { cooked: string; raw: string } }> } | null = null) => {
  if (typeof value !== "string") return;

  let match;
  const matches: Array<RegExpExecArray> = [];

  while ((match = arbitraryColorPattern.exec(value)) !== null) {
    matches.push({ ...match });
  }

  arbitraryColorPattern.lastIndex = 0;

  for (const m of matches) {
    const arbitraryValue = m[0];
    const prefix = m[1];
    const replacement = tokenMap[prefix] || "bg-muted";

    context.report({
      node,
      messageId: "noArbitraryColors",
      data: { value: arbitraryValue },
      fix(fixer) {
        if (templateLiteralNode) {
          const quasi = templateLiteralNode.quasis[0];
          const newText = quasi.value.cooked.replace(arbitraryValue, replacement);
          return fixer.replaceText(quasi, `\`${newText}\``);
        }

        const nodeText = node.type === "TemplateElement" ? node.value.raw : node.value;
        const newText = nodeText.replace(arbitraryValue, replacement);

        if (node.type === "TemplateElement") {
          return fixer.replaceText(node, newText);
        }

        return fixer.replaceText(
          node,
          typeof node.value === "string" ? `"${newText}"` : newText
        );
      }
    });
  }
};

export default {
  meta: {
    type: "problem",
    fixable: "code",
    docs: {
      description: "Disallow arbitrary color values in Tailwind classes (e.g., bg-[#f5e0e9])"
    },
    messages: {
      noArbitraryColors:
        "Use design system colors instead of arbitrary values like '{{value}}'. Use shadcn/ui design tokens: bg-background, bg-foreground, bg-primary, bg-secondary, bg-accent, bg-muted, bg-card, bg-popover, bg-destructive, text-primary, text-secondary, text-muted-foreground, border-border, border-input, ring-ring"
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
        if (node.name?.name === "className" && node.value) {
          if (node.value.type === "Literal") {
            checkStringForArbitraryColors(context, node.value, node.value.value);
          } else if (node.value.type === "JSXExpressionContainer") {
            const expr = node.value.expression;

            if (expr.type === "TemplateLiteral") {
              checkStringForArbitraryColors(context, node.value, expr.quasis[0].value.raw, expr);
            } else if (expr.type === "Literal") {
              checkStringForArbitraryColors(context, expr, expr.value);
            }
          }
        }
      }
    };
  }
};
