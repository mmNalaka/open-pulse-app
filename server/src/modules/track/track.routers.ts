import { Hono } from "hono";
import type { AppBindings } from "../../app";
import { trackEventHandler } from "./track.handlers";

const healthRouter = new Hono<AppBindings>().post("/track", ...trackEventHandler);

export default healthRouter;
