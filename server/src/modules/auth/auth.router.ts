import { Hono } from "hono";
import { auth } from "./better-auth.config";

const authRouter = new Hono().on(["POST", "GET"], "/*", (c) => auth.handler(c.req.raw));

export default authRouter;
