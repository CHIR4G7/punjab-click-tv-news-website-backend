import { Router, Request, Response } from "express";
import { fetchUser } from "../middleware";
import { AuthenticatedNewsRequest } from "../types/news";
import { newsValidationRules } from "../middleware/verify.validation";
import { validationResult } from "express-validator";
import { createNewNewsArticleController, editArticleController, getAllNewsForAdminPaginatedController, getArticleController, getCustomNewsController, publishNewsController } from "../controllers/news.controller";

const router = Router();

// GET /verify - Basic verification endpoint
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "News endpoint is working",
    timestamp: new Date().toISOString(),
  });
});

//create a draft of the new news
router.post(
  "/create-draft",
  // fetchUser,
  newsValidationRules,
  createNewNewsArticleController
);

router.get(
  "/admin-news",
  fetchUser,
  getAllNewsForAdminPaginatedController
)

router.get(
  "/get-news",
  getCustomNewsController
)

router.put(
  "/publish-article",
  fetchUser,
  publishNewsController
)

router.get(
  "/article",
  getArticleController
)

router.put(
  '/edit-article',
  editArticleController
)

export default router;
