import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const viteUrl = import.meta.env.VITE_API_URL;
const processUrl = typeof process !== "undefined" ? process.env?.["VITE_API_URL"] : undefined;
const API_BASE_URL = viteUrl ?? processUrl ?? "http://localhost:3001";

export const authClient = createAuthClient({
  baseURL: `${API_BASE_URL}/api/auth`,
  fetchOptions: { credentials: "include" },
  plugins: [
    inferAdditionalFields({
      user: {
        firstName: { type: "string" },
        lastName: { type: "string" },
        birthday: { type: "date" }
      }
    })
  ]
});

export const { useSession, signIn, signUp, signOut, getSession, updateUser } = authClient;
