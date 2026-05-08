const generateI18nKey = (text, ctx, filename) => {
  const cleaned = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 30);

  if (ctx.attributeName) {
    if (ctx.attributeName === "placeholder") return `common.placeholders.${cleaned}`;
    if (ctx.attributeName === "label" || ctx.attributeName === "aria-label")
      return `common.labels.${cleaned}`;
    if (ctx.attributeName === "title") return `common.titles.${cleaned}`;
    if (ctx.attributeName === "alt") return `common.alt.${cleaned}`;
  }

  if (ctx.elementName) {
    const el = ctx.elementName.toLowerCase();

    if (el === "button") return `common.buttons.${cleaned}`;
    if (el === "label") return `common.labels.${cleaned}`;
    if (el === "h1" || el === "h2" || el === "h3") return `common.titles.${cleaned}`;
  }

  const namespace = filename.includes("/coordination/")
    ? "coordination"
    : filename.includes("/company/")
      ? "company"
      : filename.includes("/resources/")
        ? "resources"
        : filename.includes("/materials/")
          ? "materials"
          : filename.includes("/clients/")
            ? "clients"
            : filename.includes("/personnel/")
              ? "personnel"
              : "common";

  return `${namespace}.${cleaned}`;
};

const isValidString = (value) => {
  if (!value || typeof value !== "string") return true;
  if (value.trim() === "") return true;
  if (value.length === 1) return true;

  if (
    value.startsWith("/") ||
    value.startsWith("./") ||
    value.startsWith("../") ||
    value.startsWith("http") ||
    value.startsWith("#") ||
    value.startsWith("@") ||
    value.includes("@") ||
    value.startsWith("<") ||
    value.includes("className") ||
    value.match(/^[a-z-]+:[a-z-]+$/) ||
    value.match(/^\d+$/) ||
    value.match(/^[a-z0-9-_/.]+\.(png|jpg|jpeg|svg|gif|webp)$/i)
  ) {
    return true;
  }

  const tailwindStricts = ["flex", "absolute", "relative", "block", "grid", "hidden"];
  const isProbablyTailwind = value.split(" ").every(word => word.includes("-") || word.includes(":") || tailwindStricts.includes(word));
  if (value.includes(" ") && isProbablyTailwind) return true;

  if (
    !value.includes(" ") &&
    (value.match(/^[a-z][a-zA-Z0-9]*$/) ||
      value.match(/^[a-z][a-z0-9-]*$/) ||
      value.match(/^[a-z][a-z0-9_]*$/) ||
      value.match(/^[a-z][a-zA-Z0-9.]*$/))
  ) {
    return true;
  }

  return false;
};

export default {
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: { description: "Enforce i18n keys instead of hardcoded text" },
    messages: {
      noHardcodedText:
        "Use i18n keys instead of hardcoded text. Use t('{{key}}') from useI18n() hook."
    }
  },
  create(context) {
    const filename = context.filename;

    if (
      filename.includes("/services/") ||
      filename.includes("/lib/api") ||
      filename.includes("/lib/case-converter") ||
      filename.includes("/types") ||
      filename.includes(".test.") ||
      filename.includes(".spec.") ||
      filename.includes(".stories.") ||
      filename.includes("/i18n/") ||
      filename.includes("/components/ui/") ||
      filename.endsWith("eslint.config.js") ||
      filename.endsWith("vite.config.ts") ||
      filename.endsWith("tailwind.config.ts")
    ) {
      return {};
    }

    const technicalAttrs = [
      "className",
      "style",
      "key",
      "id",
      "data-testid",
      "data-test",
      "name",
      "type",
      "href",
      "src",
      "to",
      "from",
      "as",
      "value",
      "accept"
    ];

    const attributesToCheck = ["placeholder", "label", "title", "alt", "aria-label"];

    return {
      Literal(node) {
        if (typeof node.value !== "string") return;
        if (!isValidString(node.value)) {
          let parent = node.parent;
          let isInJSX = false;

          if (parent && parent.type === "JSXAttribute") {
            return;
          }

          while (parent) {
            if (
              parent.type === "JSXElement" ||
              parent.type === "JSXFragment" ||
              parent.type === "JSXExpressionContainer"
            ) {
              isInJSX = true;
              break;
            }
            parent = parent.parent;
          }

          if (isInJSX) {
            const key = generateI18nKey(node.value, {}, filename);

            context.report({ node, messageId: "noHardcodedText", data: { key } });
          }
        }
      },
      JSXText(node) {
        const text = node.value.trim();

        if (!isValidString(text)) {
          let elementName = null;
          let parent = node.parent;

          while (parent && !elementName) {
            if (
              parent.type === "JSXElement" &&
              parent.openingElement &&
              parent.openingElement.name
            ) {
              elementName = parent.openingElement.name.name;
              break;
            }
            parent = parent.parent;
          }

          const key = generateI18nKey(text, { elementName }, filename);

          context.report({ node, messageId: "noHardcodedText", data: { key } });
        }
      },
      JSXAttribute(node) {
        if (
          node.name &&
          !technicalAttrs.includes(node.name.name) &&
          attributesToCheck.includes(node.name.name) &&
          node.value &&
          node.value.type === "Literal"
        ) {
          if (!isValidString(node.value.value)) {
            const key = generateI18nKey(
              node.value.value,
              { attributeName: node.name.name },
              filename
            );

            context.report({ node: node.value, messageId: "noHardcodedText", data: { key } });
          }
        }
      }
    };
  }
};
