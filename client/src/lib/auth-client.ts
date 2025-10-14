import { customSessionClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "../../../server/src/modules/auth/better-auth.config"; // Import the auth instance as a type

export const authClient = createAuthClient({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api/auth`,
  plugins: [
    organizationClient(), // Add organization client plugin
    customSessionClient<typeof auth>(), // So the custom session is inferred
  ],
});
