export default {
  meta: {
    type: "problem",
    docs: { description: "Enforce absolute imports with @/ instead of relative parent imports (../)" },
    messages: {
      noRelativeParent:
        "Use absolute import '@/{{absolutePath}}' instead of relative parent import '{{relativePath}}'"
    }
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        if (importPath.startsWith("../") || importPath.includes("/../")) {
          const filename = context.filename;

          if (filename === "<input>") return;

          const srcMatch = filename.match(/.*\/src\//);

          if (srcMatch) {
            const absolutePath = importPath.replace(/^(\.\.\/)+/, "");

            context.report({
              node: node.source,
              messageId: "noRelativeParent",
              data: { relativePath: importPath, absolutePath }
            });
          }
        }
      }
    };
  }
};
