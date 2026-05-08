import path from "path";
import fs from "fs";

const folderedDirs = [
  { dir: "/hooks/", pattern: /\.hook\.ts$/, prefix: "use-" },
  { dir: "/services/", pattern: /\.service\.ts$/, prefix: "" },
  { dir: "/stores/", pattern: /\.store\.ts$/, prefix: "" },
  { dir: "/providers/", pattern: /\.(tsx|ts)$/, prefix: "" },
  { dir: "/utils/", pattern: /\.util\.ts$/, prefix: "" }
];

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce that hooks, services, stores, providers, and utils are in subfolders"
    },
    messages: {
      mustBeInSubfolder:
        "Files in '{{directory}}' must be in a subfolder. Expected: {{directory}}{{subfolder}}/{{filename}}"
    }
  },
  create(context) {
    return {
      Program(node) {
        const filename = context.filename;

        if (filename === "<input>" || !filename.includes("/src/")) return;
        if (filename.endsWith("index.ts") || filename.endsWith("index.tsx")) return;
        if (filename.includes(".test.")) return;
        if (filename.includes("/lib/")) return;

        for (const { dir, pattern, prefix } of folderedDirs) {
          if (!filename.includes(dir)) continue;
          if (!pattern.test(filename)) continue;

          const parts = filename.split(dir);
          const relativePath = parts[1];
          const pathSegments = relativePath.split("/");

          if (pathSegments.length === 1) {
            const basename = path.basename(filename);
            const subfolder = basename
              .replace(/\.(hook|service|store|util)\.ts$/, "")
              .replace(/\.tsx$/, "");

            context.report({
              node,
              messageId: "mustBeInSubfolder",
              data: { directory: dir, subfolder, filename: basename }
            });

            return;
          }

          const subfolderName = pathSegments[0];
          const basename = path.basename(filename);
          const expectedName = basename.replace(/\.(hook|service|store|util)\.ts$/, "").replace(/\.tsx$/, "");

          if (prefix && !subfolderName.startsWith(prefix)) {
            continue;
          }
        }
      }
    };
  }
};
