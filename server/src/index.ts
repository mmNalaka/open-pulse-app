import { createApp } from "./app";

export const app = createApp();

export default {
	port: process.env.PORT || 3000,
	fetch: app.fetch,
}