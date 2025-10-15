import { QueryClient } from "@tanstack/react-query";
import { hcWithType } from "server/dist/src/client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export const queryClient = new QueryClient();
export const client = hcWithType(`${SERVER_URL}/api`);
