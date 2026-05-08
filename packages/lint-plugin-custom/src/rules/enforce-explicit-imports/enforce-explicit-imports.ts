const importMapping = {
  queryKeys: "@/lib/query-keys",
  queryClient: "@/lib/query-client",
  apiClient: "@/lib/api-client",
  ApiClientError: "@/lib/api-client",
  ApiError: "@/lib/api-client"
};

export default {
  meta: {
    type: "problem",
    docs: { description: "Enforce explicit imports from specific modules instead of parent barrels" },
    messages: {
      explicitImport: "Import from '{{correctPath}}' instead of '{{wrongPath}}' for better clarity",
      shadcnUtils: "Shadcn utils must be imported from '@/lib/utils' not '@/lib'"
    }
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        if (importPath === "@/lib") {
          const importedNames = node.specifiers
            .filter((spec) => spec.type === "ImportSpecifier")
            .map((spec) => spec.imported.name);

          if (importedNames.includes("cn")) {
            context.report({ node: node.source, messageId: "shadcnUtils" });
          } else {
            for (const name of importedNames) {
              if (importMapping[name]) {
                context.report({
                  node: node.source,
                  messageId: "explicitImport",
                  data: { wrongPath: "@/lib", correctPath: importMapping[name] }
                });
                break;
              }
            }
          }
        }

        const barrelPaths = {
          "@/stores": "@/stores/auth (or specific store)",
          "@/services": "@/services/auth (or specific service)",
          "@/utils": "@/utils/case-converter (or specific util)",
          "@/components/templates": "@/components/templates/auth-layout (or specific template)"
        };

        if (barrelPaths[importPath]) {
          context.report({
            node: node.source,
            messageId: "explicitImport",
            data: { wrongPath: importPath, correctPath: barrelPaths[importPath] }
          });
        }
      }
    };
  }
};
