import fs from "fs";
import path from "path";

export default {
  meta: {
    type: "problem",
    docs: { description: "Enforce that every component has a corresponding .stories.tsx file" },
    messages: {
      missingStory:
        "Component file '{{filename}}' must have a corresponding '{{storyFile}}' file in the same directory"
    }
  },
  create(context) {
    return {
      Program(node) {
        const filename = context.filename;

        if (filename === "<input>" || !filename.includes("/src/")) return;

        let shouldCheck = false;
        let componentName = "";

        const atomicSuffixes: Array<{ dir: string; suffix: string }> = [
          { dir: "/components/atoms/", suffix: ".atom.tsx" },
          { dir: "/components/molecules/", suffix: ".molecule.tsx" },
          { dir: "/components/organisms/", suffix: ".organism.tsx" },
          { dir: "/components/layouts/", suffix: ".layout.tsx" }
        ];

        const matchedAtomic = atomicSuffixes.find(
          ({ dir, suffix }) => filename.includes(dir) && filename.endsWith(suffix)
        );

        if (matchedAtomic) {
          shouldCheck = true;
          componentName = path.basename(filename).replace(matchedAtomic.suffix, "");
        } else if (filename.includes("/components/ui/") && filename.endsWith(".tsx")) {
          if (
            !filename.endsWith(".stories.tsx") &&
            !filename.endsWith(".test.tsx") &&
            !filename.endsWith("index.tsx")
          ) {
            shouldCheck = true;
            componentName = path.basename(filename).replace(".tsx", "");
          }
        }

        if (!shouldCheck) return;

        const dirname = path.dirname(filename);
        const basename = path.basename(filename);
        const storyFile = `${componentName}.stories.tsx`;
        const storyPath = path.join(dirname, storyFile);

        if (!fs.existsSync(storyPath)) {
          context.report({
            node,
            messageId: "missingStory",
            data: { filename: basename, storyFile }
          });
        }
      }
    };
  }
};
