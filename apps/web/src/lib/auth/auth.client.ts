import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const API_BASE_URL = import.meta.env["VITE_API_URL"] ?? "http://localhost:3001";

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

export const { useSession, signIn, signUp, signOut, getSession } = authClient;
