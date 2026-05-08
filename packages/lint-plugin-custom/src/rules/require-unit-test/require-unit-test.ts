import fs from "fs";
import path from "path";

const testablePatterns = [
  /\.service\.ts$/,
  /\.hook\.ts$/,
  /\.store\.ts$/,
  /\.util\.ts$/,
  /\.entity\.ts$/,
  /\.use-case\.ts$/,
  /\.error\.ts$/,
  /\.value-object\.ts$/,
  /\.route\.ts$/,
  /\.middleware\.ts$/
];

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce that service, hook, store, and util files have corresponding unit tests"
    },
    messages: {
      missingTest:
        "File '{{filename}}' must have a corresponding '{{testFile}}' file in the same directory"
    }
  },
  create(context) {
    return {
      Program(node) {
        const filename = context.filename;

        if (filename === "<input>" || !filename.includes("/src/")) return;
        if (filename.includes(".test.ts")) return;

        const matchedPattern = testablePatterns.find((p) => p.test(filename));

        if (!matchedPattern) return;

        const dirname = path.dirname(filename);
        const basename = path.basename(filename);
        const testFile = basename.replace(/\.ts$/, ".test.ts");
        const testPath = path.join(dirname, testFile);

        if (!fs.existsSync(testPath)) {
          context.report({
            node,
            messageId: "missingTest",
            data: { filename: basename, testFile }
          });
        }
      }
    };
  }
};
