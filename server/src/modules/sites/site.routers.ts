import { Hono } from "hono";
import { requireAuth } from "@/middlewares/auth.mw";
import { createSiteHandler, listSitesHandler } from "./site.handlers";

const siteRouter = new Hono()
  .post("/", requireAuth, ...createSiteHandler)
  .get("/", requireAuth, ...listSitesHandler);

export default siteRouter;
