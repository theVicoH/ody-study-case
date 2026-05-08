const inferTypeFromUsage = (node) => {
  const parent = node.parent;

  if (!parent) return null;

  if (
    parent.type === "FunctionDeclaration" ||
    parent.type === "FunctionExpression" ||
    parent.type === "ArrowFunctionExpression"
  ) {
    const param = parent.params.find(
      (p) => p === node || (p.type === "AssignmentPattern" && p.left === node)
    );

    if (param && parent.body?.type === "BlockStatement") {
      const usages: string[] = [];
      const arrayElementUsages: string[] = [];

      const findUsages = (searchNode) => {
        if (
          searchNode.type === "MemberExpression" &&
          searchNode.object.name === node.name
        ) {
          usages.push(searchNode.property.name);
        }

        if (
          searchNode.type === "MemberExpression" &&
          searchNode.object.type === "MemberExpression" &&
          searchNode.object.object.name === node.name &&
          searchNode.object.property.type === "Literal"
        ) {
          arrayElementUsages.push(searchNode.property.name);
        }

        for (const key in searchNode) {
          if (key === "parent" || key === "range" || key === "loc" || key === "tokens" || key === "comments") continue;
          if (searchNode[key] && typeof searchNode[key] === "object") {
            if (Array.isArray(searchNode[key])) {
              searchNode[key].forEach(findUsages);
            } else if (searchNode[key].type) {
              findUsages(searchNode[key]);
            }
          }
        }
      };

      findUsages(parent.body);

      if (arrayElementUsages.length > 0) {
        const props = arrayElementUsages.map((prop) => `${prop}: unknown`).join("; ");
        return `Array<{ ${props} }>`;
      }

      if (usages.length > 0) {
        const props = usages.map((prop) => `${prop}: unknown`).join("; ");

        return `{ ${props} }`;
      }
    }
  }

  if (parent.type === "VariableDeclarator" && parent.init) {
    const init = parent.init;

    if (init.type === "ObjectExpression") return "Record<string, unknown>";
    if (init.type === "ArrayExpression") return "Array<unknown>";
    if (init.type === "CallExpression") return "unknown";
  }

  return null;
};

const checkAny = (context, node) => {
  if (!node.typeAnnotation?.typeAnnotation) return;

  const typeNode = node.typeAnnotation.typeAnnotation;
  let hasAny = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let anyNode: any = null;

  if (typeNode.type === "TSAnyKeyword") {
    hasAny = true;
    anyNode = typeNode;
  } else if (
    typeNode.type === "TSArrayType" &&
    typeNode.elementType?.type === "TSAnyKeyword"
  ) {
    hasAny = true;
    anyNode = typeNode;
  }

  if (!hasAny) return;

  const suggestion = inferTypeFromUsage(node) || "unknown";

  context.report({
    node: anyNode,
    messageId: "noAny",
    data: { suggestion },
    fix(fixer) {
      if (anyNode.parent?.type === "TSArrayType") {
        return fixer.replaceText(
          anyNode.parent,
          suggestion === "unknown" ? "Array<unknown>" : `Array<${suggestion}>`
        );
      }

      return fixer.replaceText(anyNode, suggestion);
    }
  });
};

export default {
  meta: {
    type: "problem",
    fixable: "code",
    docs: { description: "Disallow explicit any types and auto-fix with type inference" },
    messages: { noAny: "Avoid using 'any'. Type can be inferred as '{{suggestion}}'" }
  },
  create(context) {
    return {
      Identifier: (node: any) => checkAny(context, node),
      AssignmentPattern: (node: any) => checkAny(context, node),
      RestElement: (node: any) => checkAny(context, node),
    };
  }
};
