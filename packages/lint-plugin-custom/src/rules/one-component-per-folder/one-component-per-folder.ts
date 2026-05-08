import fs from "fs";
import path from "path";

const monitoredDirs = [
  "/components/atoms/",
  "/components/molecules/",
  "/components/organisms/"
];

export default {
  meta: {
    type: "problem",
    docs: { description: "Enforce one component per folder in atoms, molecules, and organisms" },
    messages: {
      multipleComponents:
        "Folder '{{folderName}}' contains multiple components ({{files}}). Each component must be in its own folder with its own story and test."
    }
  },
  create(context) {
    return {
      Program(node) {
        const filename = context.filename;

        if (filename === "<input>" || !filename.includes("/src/")) return;
        if (!monitoredDirs.some((dir) => filename.includes(dir))) return;

        const dirname = path.dirname(filename);
        const folderName = path.basename(dirname);
        const parentFolderName = path.basename(path.dirname(dirname));

        if (parentFolderName === "components") return;

        try {
          const files = fs.readdirSync(dirname);
          const componentFiles = files.filter((f) => f.endsWith(".component.tsx"));

          if (componentFiles.length > 1 && path.basename(filename).endsWith(".component.tsx")) {
            context.report({
              node,
              messageId: "multipleComponents",
              data: { folderName, files: componentFiles.join(", ") }
            });
          }
        } catch {
        }
      }
    };
  }
};
