const isKebabCase = (str) => /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(str);

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce kebab-case file naming conventions"
    }
  },
  create(context) {
    return {
      Program(node) {
        const filename = context.filename;

        if (filename === "<input>") return;
        if (filename.endsWith("vite-env.d.ts")) return;
        if (filename.endsWith("main.tsx")) return;
        if (filename.endsWith("index.tsx")) return;
        if (filename.endsWith("App.tsx")) return;
        if (filename.includes("/assets/")) return;
        if (filename.includes("/routes/")) return;

        const isTsFile = filename.endsWith(".ts");
        const isTsxFile = filename.endsWith(".tsx");
        const basename = filename.split("/").pop().split(".").slice(0, -1).join(".");

        if ((isTsFile || isTsxFile) && !basename.split(".").every(isKebabCase)) {
          context.report({
            node,
            message:
              "Files must use kebab-case naming (example: user-profile.service.ts, user-list.component.tsx)"
          });
        }

        const projectPath = filename.split("src/")[1];

        if (projectPath) {
          const dirs = projectPath.split("/");

          dirs.pop();

          for (const dir of dirs) {
            if (dir === "" || dir === "." || dir === ".." || dir === "assets" || dir === "routes")
              continue;

            if (!isKebabCase(dir)) {
              context.report({
                node,
                message: `Directory "${dir}" must use kebab-case naming`
              });
            }
          }
        }
      }
    };
  }
};
