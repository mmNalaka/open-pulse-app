import { Hono } from "hono";
import { requireAuth } from "@/middlewares/auth.mw";
import * as handlers from "./site.handlers";

const siteRouter = new Hono()
  .post("/", requireAuth, ...handlers.createSiteHandler)
  .get("/", requireAuth, ...handlers.listSitesHandler)
  .get("/:id", requireAuth, ...handlers.getSiteHandler)
  .patch("/:id", requireAuth, ...handlers.updateSiteHandler)
  .delete("/:id", requireAuth, ...handlers.deleteSiteHandler);

export default siteRouter;
