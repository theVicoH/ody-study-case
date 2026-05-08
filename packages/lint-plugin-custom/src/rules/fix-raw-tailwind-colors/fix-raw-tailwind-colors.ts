const generateColorMapping = () => {
  const mapping = {};

  const colorGroups = {
    primary: ["blue", "indigo", "sky"],
    destructive: ["red", "rose"],
    warning: ["yellow", "amber", "orange"],
    success: ["green", "emerald", "lime"],
    muted: ["gray", "slate", "zinc", "neutral", "stone"]
  };

  const prefixes = ["bg", "text", "border", "ring", "fill", "stroke"];
  const modifiers = ["", "hover:", "focus:", "active:", "dark:"];
  const shades = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

  for (const [token, colors] of Object.entries(colorGroups)) {
    for (const color of colors) {
      for (const shade of shades) {
        let replacement;

        if (["50", "100"].includes(shade)) {
          replacement = `${token}/${shade === "50" ? "10" : "20"}`;
        } else if (["200", "300", "400"].includes(shade)) {
          replacement = token === "muted" ? "muted" : `${token}/50`;
        } else {
          replacement = token;
        }

        for (const prefix of prefixes) {
          for (const modifier of modifiers) {
            mapping[`${modifier}${prefix}-${color}-${shade}`] =
              `${modifier}${prefix}-${replacement}`;
          }
        }
      }
    }
  }

  for (const mod of modifiers) {
    mapping[`${mod}text-white`] = `${mod}text-primary-foreground`;
    mapping[`${mod}text-black`] = `${mod}text-foreground`;
    mapping[`${mod}bg-white`] = `${mod}bg-background`;
    mapping[`${mod}bg-black`] = `${mod}bg-foreground`;
  }

  return mapping;
};

const colorMapping = generateColorMapping();

const rawColorPattern = new RegExp(
  `\\b(${Object.keys(colorMapping)
    .map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})\\b`,
  "g"
);

const checkAndFixColors = (context, node, value, templateLiteralNode: { quasis: Array<{ value: { cooked: string; raw: string } }> } | null = null) => {
  if (typeof value !== "string") return;

  let match;
  const matches: Array<{ value: string }> = [];

  while ((match = rawColorPattern.exec(value)) !== null) {
    matches.push({ value: match[0] });
  }

  rawColorPattern.lastIndex = 0;

  for (const m of matches) {
    const original = m.value;
    const replacement = colorMapping[original];

    if (!replacement) continue;

    context.report({
      node,
      messageId: "useDesignToken",
      data: { original, replacement },
      fix(fixer) {
        if (templateLiteralNode) {
          const quasi = templateLiteralNode.quasis[0];
          const newText = quasi.value.cooked.replace(new RegExp(`\\b${original}\\b`, "g"), replacement);
          return fixer.replaceText(quasi, `\`${newText}\``);
        }

        const nodeText = node.type === "TemplateElement" ? node.value.raw : node.value;
        const newText = nodeText.replace(new RegExp(`\\b${original}\\b`, "g"), replacement);

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
    docs: { description: "Auto-fix raw Tailwind colors to Shadcn design tokens" },
    messages: { useDesignToken: "Use '{{replacement}}' instead of '{{original}}'" }
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
      JSXAttribute(node) {
        if (node.name?.name === "className" && node.value) {
          if (node.value.type === "Literal") {
            checkAndFixColors(context, node.value, node.value.value);
          } else if (node.value.type === "JSXExpressionContainer") {
            const expr = node.value.expression;

            if (expr.type === "TemplateLiteral") {
              checkAndFixColors(context, node.value, expr.quasis[0].value.raw, expr);
            } else if (expr.type === "Literal") {
              checkAndFixColors(context, expr, expr.value);
            }
          }
        }
      }
    };
  }
};
