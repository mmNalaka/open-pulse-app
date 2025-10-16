import { Hono } from "hono";
import { trackEventHandler } from "./track.handlers";

const healthRouter = new Hono().post("/track", ...trackEventHandler);

export default healthRouter;
