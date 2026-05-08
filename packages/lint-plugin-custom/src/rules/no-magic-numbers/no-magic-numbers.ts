import { TSESTree } from "@typescript-eslint/utils";

const DEFAULT_OPTIONS = {
  ignore: [-1, 0, 1, 2],
  ignoreArrayIndexes: true,
  ignoreTypeIndexes: true,
  ignoreEnums: true,
  ignoreInTypeAnnotations: true,
  ignoreInComparison: false,
  ignoreConfigObjects: true,
  ignoreObjectProperties: true,
  ignoreCallArguments: true
};

const isIgnoredValue = (node: TSESTree.Literal, ignoredValues: number[]) => {
  return ignoredValues.includes(node.value as number);
};

const isParentArrayExpression = (node: TSESTree.Node) => {
  return node.parent?.type === "ArrayExpression";
};

const isObjectPropertyValue = (node: TSESTree.Node) => {
  return node.parent?.type === "Property";
};

const isCallArgument = (node: TSESTree.Node) => {
  const parent = node.parent;

  if (parent?.type !== "CallExpression") return false;

  return parent.arguments.includes(node as TSESTree.CallExpressionArgument);
};

const isIndexSpecifier = (node: TSESTree.Node) => {
  if (node.parent?.type === "TSIndexSignature") return true;
  if (node.parent?.type === "TSTypeReference") return true;
  return false;
};

const isInEnumDeclaration = (node: TSESTree.Node) => {
  let parent = node.parent;

  while (parent) {
    if (parent.type === "TSEnumDeclaration") {
      return true;
    }
    parent = parent.parent;
  }

  return false;
};

const isInTypeAnnotation = (node: TSESTree.Node) => {
  let parent = node.parent;

  while (parent) {
    if (
      parent.type === "TSTypeAnnotation" ||
      parent.type === "TSInterfaceDeclaration" ||
      parent.type === "TSTypeAliasDeclaration"
    ) {
      return true;
    }
    parent = parent.parent;
  }

  return false;
};

const isUsedInComparison = (node: TSESTree.Node) => {
  const parent = node.parent;

  if (!parent) return false;

  const comparisonOperators = [
    "BinaryExpression",
    "LogicalExpression",
    "ConditionalExpression"
  ];

  if (comparisonOperators.includes(parent.type)) {
    return true;
  }

  return false;
};

const isConfigObject = (node: TSESTree.Node) => {
  let parent = node.parent;

  while (parent) {
    if (parent.type === "ObjectExpression") {
      const wrapper = parent.parent;
      const grandParent = wrapper?.type === "TSAsExpression" ? wrapper.parent : wrapper;

      if (grandParent) {
        if (
          grandParent.type === "VariableDeclarator" &&
          grandParent.id.type === "Identifier"
        ) {
          const name = grandParent.id.name;
          const nameLower = name.toLowerCase();

          if (
            nameLower.includes("config") ||
            nameLower.includes("option") ||
            nameLower.includes("setting") ||
            nameLower.includes("env")
          ) {
            return true;
          }

          if (/^[A-Z]/.test(name)) {
            return true;
          }
        }

        if (
          grandParent.type === "ExportNamedDeclaration" ||
          grandParent.type === "ExportDefaultDeclaration"
        ) {
          return true;
        }
      }
    }

    parent = parent.parent;
  }

  return false;
};

const isInNamedConstantDeclaration = (node: TSESTree.Node) => {
  const parent = node.parent;

  if (parent?.type === "VariableDeclarator" && parent.id.type === "Identifier") {
    const name = parent.id.name;

    if (/^[A-Z]/.test(name)) {
      return true;
    }
  }

  return false;
};

export default {
  meta: {
    type: "problem" as const,
    docs: {
      description: "Disallow magic numbers"
    },
    messages: {
      noMagicNumbers:
        "No magic number allowed. Extract '{{value}}' to a named constant with a descriptive name."
    },
    schema: [
      {
        type: "object",
        properties: {
          ignore: {
            type: "array",
            items: {
              type: "number"
            }
          },
          ignoreArrayIndexes: {
            type: "boolean"
          },
          ignoreTypeIndexes: {
            type: "boolean"
          },
          ignoreEnums: {
            type: "boolean"
          },
          ignoreInTypeAnnotations: {
            type: "boolean"
          },
          ignoreInComparison: {
            type: "boolean"
          },
          ignoreConfigObjects: {
            type: "boolean"
          },
          ignoreObjectProperties: {
            type: "boolean"
          },
          ignoreCallArguments: {
            type: "boolean"
          }
        },
        additionalProperties: false
      }
    ]
  },
  create(context) {
    const options = context.options[0] || {};
    const ignoredValues = options.ignore || DEFAULT_OPTIONS.ignore;
    const ignoreArrayIndexes = options.ignoreArrayIndexes ?? DEFAULT_OPTIONS.ignoreArrayIndexes;
    const ignoreTypeIndexes = options.ignoreTypeIndexes ?? DEFAULT_OPTIONS.ignoreTypeIndexes;
    const ignoreEnums = options.ignoreEnums ?? DEFAULT_OPTIONS.ignoreEnums;
    const ignoreInTypeAnnotations =
      options.ignoreInTypeAnnotations ?? DEFAULT_OPTIONS.ignoreInTypeAnnotations;
    const ignoreInComparison = options.ignoreInComparison ?? DEFAULT_OPTIONS.ignoreInComparison;
    const ignoreConfigObjects = options.ignoreConfigObjects ?? DEFAULT_OPTIONS.ignoreConfigObjects;
    const ignoreObjectProperties =
      options.ignoreObjectProperties ?? DEFAULT_OPTIONS.ignoreObjectProperties;
    const ignoreCallArguments = options.ignoreCallArguments ?? DEFAULT_OPTIONS.ignoreCallArguments;

    return {
      Literal(node: TSESTree.Literal) {
        if (typeof node.value !== "number") return;

        if (isIgnoredValue(node, ignoredValues)) return;

        if (ignoreArrayIndexes && isParentArrayExpression(node)) return;

        if (ignoreTypeIndexes && isIndexSpecifier(node)) return;

        if (ignoreEnums && isInEnumDeclaration(node)) return;

        if (ignoreInTypeAnnotations && isInTypeAnnotation(node)) return;

        if (ignoreInComparison && isUsedInComparison(node)) return;

        if (ignoreConfigObjects && isConfigObject(node)) return;

        if (ignoreObjectProperties && isObjectPropertyValue(node)) return;

        if (ignoreCallArguments && isCallArgument(node)) return;

        if (isInNamedConstantDeclaration(node)) return;

        context.report({
          node,
          messageId: "noMagicNumbers",
          data: {
            value: String(node.value)
          }
        });
      }
    };
  }
};
