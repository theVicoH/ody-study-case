import path from "path";

const directoryRules = [
  {
    directory: "/lib/",
    suffixes: [".lib.ts", ".ts"],
    suffix: ".lib.ts",
    example: "api-client.lib.ts",
    allowPlainTs: true
  },
  { directory: "/services/", suffix: ".service.ts", example: "auth.service.ts" },
  { directory: "/hooks/", suffix: ".hook.ts", example: "use-auth.hook.ts" },
  { directory: "/stores/", suffix: ".store.ts", example: "auth.store.ts" },
  { directory: "/utils/", suffix: ".util.ts", example: "case-converter.util.ts" },
  { directory: "/entities/", suffix: ".entity.ts", example: "user.entity.ts" },
  { directory: "/repositories/", suffix: ".repository.ts", example: "user.repository.ts" },
  { directory: "/dtos/", suffix: ".dto.ts", example: "create-user.dto.ts" },
  { directory: "/mappers/", suffix: ".mapper.ts", example: "user.mapper.ts" },
  { directory: "/fakes/", suffix: ".fake.ts", example: "user-repository.fake.ts" },
  { directory: "/schemas/", suffix: ".schema.ts", example: "auth-user.schema.ts" },
  { directory: "/use-cases/", suffix: ".use-case.ts", example: "create-user.use-case.ts" },
  { directory: "/errors/", suffix: ".error.ts", example: "user-not-found.error.ts" },
  { directory: "/value-objects/", suffix: ".value-object.ts", example: "user-email.value-object.ts" },
  { directory: "/routes/", suffix: ".route.ts", example: "user.route.ts" },
  { directory: "/middleware/", suffix: ".middleware.ts", example: "auth.middleware.ts" },
  { directory: "/ports/", suffix: ".port.ts", example: "email-sender.port.ts" },
  { directory: "/constants/", suffix: ".constants.ts", example: "session-cookie.constants.ts" }
];

const atomicComponentDirs = [
  { directory: "/components/atoms/", suffix: ".atom.tsx", example: "button.atom.tsx" },
  { directory: "/components/molecules/", suffix: ".molecule.tsx", example: "search-input.molecule.tsx" },
  { directory: "/components/organisms/", suffix: ".organism.tsx", example: "auth-form.organism.tsx" },
  { directory: "/components/layouts/", suffix: ".layout.tsx", example: "auth-layout.layout.tsx" }
];

export default {
  meta: {
    type: "problem",
    docs: { description: "Enforce proper file suffixes based on directory structure" },
    messages: {
      wrongSuffix:
        "File in '{{directory}}' directory must end with '{{expectedSuffix}}' (e.g., '{{example}}')",
      componentSuffix:
        "Component files in '{{directory}}' must end with '{{expectedSuffix}}' (e.g., '{{example}}')"
    }
  },
  create(context) {
    return {
      Program(node) {
        const filename = context.filename;

        if (filename === "<input>" || !filename.includes("/src/")) return;

        if (
          filename.includes(".test.ts") ||
          filename.includes(".stories.tsx") ||
          filename.endsWith("index.ts") ||
          filename.endsWith("index.tsx") ||
          filename.endsWith(".d.ts")
        )
          return;

        for (const rule of directoryRules) {
          if (filename.includes(rule.directory)) {
            if (rule.allowPlainTs) {
              const hasValidSuffix = rule.suffixes.some((suffix) => filename.endsWith(suffix));

              if (!hasValidSuffix) {
                context.report({
                  node,
                  messageId: "wrongSuffix",
                  data: { directory: rule.directory, expectedSuffix: rule.suffix, example: rule.example }
                });
              }
            } else {
              if (!filename.endsWith(rule.suffix)) {
                context.report({
                  node,
                  messageId: "wrongSuffix",
                  data: { directory: rule.directory, expectedSuffix: rule.suffix, example: rule.example }
                });
              }
            }

            return;
          }
        }

        for (const atomicDir of atomicComponentDirs) {
          if (filename.includes(atomicDir.directory) && filename.endsWith(".tsx")) {
            if (!filename.endsWith(atomicDir.suffix)) {
              context.report({
                node,
                messageId: "componentSuffix",
                data: {
                  directory: atomicDir.directory,
                  expectedSuffix: atomicDir.suffix,
                  example: atomicDir.example
                }
              });
            }

            return;
          }
        }
      }
    };
  }
};
