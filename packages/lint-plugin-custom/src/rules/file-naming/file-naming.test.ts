import { describe, it, expect } from "vitest";
import rule from "./file-naming.js";

/**
 * Helper minimal pour simuler le contexte ESLint
 * et tester les règles custom sans dépendance à RuleTester
 */
function createContext(filename) {
  const reports: Array<{ message?: string }> = [];

  return {
    context: {
      filename,
      report: (data: { message?: string }) => reports.push(data),
    },
    getReports: () => reports,
  };
}

function runRule(filename) {
  const { context, getReports } = createContext(filename);
  const visitor = rule.create(context);
  const fakeNode = {};

  visitor.Program(fakeNode);

  return getReports();
}

describe("file-naming rule", () => {
  describe("valid files — should NOT report", () => {
    it("accepte un fichier kebab-case .ts", () => {
      const reports = runRule("/project/src/hooks/use-auth/use-auth.hook.ts");

      expect(reports).toHaveLength(0);
    });

    it("accepte un fichier kebab-case .tsx", () => {
      const reports = runRule("/project/src/components/user-card/user-card.component.tsx");

      expect(reports).toHaveLength(0);
    });

    it("ignore les fichiers dans /routes/", () => {
      const reports = runRule("/project/src/routes/index.tsx");

      expect(reports).toHaveLength(0);
    });

    it("ignore main.tsx", () => {
      const reports = runRule("/project/src/main.tsx");

      expect(reports).toHaveLength(0);
    });

    it("ignore vite-env.d.ts", () => {
      const reports = runRule("/project/src/vite-env.d.ts");

      expect(reports).toHaveLength(0);
    });

    it("ignore le contexte <input>", () => {
      const reports = runRule("<input>");

      expect(reports).toHaveLength(0);
    });

    it("accepte des dossiers kebab-case", () => {
      const reports = runRule("/project/src/use-cases/my-feature/my-feature.service.ts");

      expect(reports).toHaveLength(0);
    });

    it("accepte un fichier kebab-case .ts dans /src/components", () => {
      const reports = runRule("/src/components/button.ts");
      expect(reports).toHaveLength(0);
    });

    it("accepte un fichier kebab-case .tsx dans /src/hooks", () => {
      const reports = runRule("/src/hooks/use-auth.tsx");
      expect(reports).toHaveLength(0);
    });

    it("ignore les fichiers dans /src/routes", () => {
      const reports = runRule("/src/routes/Home.tsx");
      expect(reports).toHaveLength(0);
    });

    it("ignore /src/main.tsx", () => {
      const reports = runRule("/src/main.tsx");
      expect(reports).toHaveLength(0);
    });

    it("ignore /src/vite-env.d.ts", () => {
      const reports = runRule("/src/vite-env.d.ts");
      expect(reports).toHaveLength(0);
    });

    it("ignore le contexte <input>", () => {
      const reports = runRule("<input>");
      expect(reports).toHaveLength(0);
    });

    it("accepte un fichier kebab-case dans un sous-dossier kebab-case", () => {
      const reports = runRule("/src/hooks/use-auth/use-auth.ts");
      expect(reports).toHaveLength(0);
    });

    it("ignore /src/tailwind.config.ts", () => {
      const reports = runRule("/src/tailwind.config.ts");
      expect(reports).toHaveLength(0);
    });

    it("accepte un fichier kebab-case dans un sous-dossier ui", () => {
      const reports = runRule("/src/components/ui/some-component.tsx");
      expect(reports).toHaveLength(0);
    });

    it("ignore /src/package.json", () => {
      const reports = runRule("/src/package.json");
      expect(reports).toHaveLength(0);
    });
  });

  describe("invalid files — should report", () => {
    it("rejette un fichier en PascalCase", () => {
      const reports = runRule("/project/src/components/UserCard.component.tsx");

      expect(reports).toHaveLength(1);
      expect(reports[0].message).toMatch(/kebab-case/);
    });

    it("rejette un fichier en camelCase", () => {
      const reports = runRule("/project/src/services/userAuth.service.ts");

      expect(reports).toHaveLength(1);
      expect(reports[0].message).toMatch(/kebab-case/);
    });

    it("rejette un dossier en PascalCase", () => {
      const reports = runRule("/project/src/Components/user-card.component.tsx");

      expect(reports.some((r) => r.message?.includes("Components"))).toBe(true);
    });

    it("rejette un dossier en camelCase", () => {
      const reports = runRule("/project/src/userHooks/use-auth.hook.ts");

      expect(reports.some((r) => r.message?.includes("userHooks"))).toBe(true);
    });
  });
});
