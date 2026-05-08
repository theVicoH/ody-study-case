const isAllowedComment = (comment) => {
  const value = comment.value.trim();

  if (value.startsWith("TODO:") || value.startsWith("FIXME:")) return true;
  if (/^[=\-+*#]+$/.test(value)) return true;
  if (/^[=\-+*#]{3,}/.test(value) || /[=\-+*#]{3,}$/.test(value)) return true;
  if (value.startsWith("eslint-") || value.includes("@ts-")) return true;

  return false;
};

export default {
  meta: {
    type: "suggestion",
    docs: { description: "Disallow unnecessary comments except TODO and FIXME" },
    messages: {
      unnecessaryComment: "Unnecessary comment. Only TODO: and FIXME: comments are allowed."
    }
  },
  create(context) {
    return {
      Program() {
        const comments = context.sourceCode.getAllComments();

        for (const comment of comments) {
          if (!isAllowedComment(comment)) {
            context.report({ node: comment, messageId: "unnecessaryComment" });
          }
        }
      }
    };
  }
};
