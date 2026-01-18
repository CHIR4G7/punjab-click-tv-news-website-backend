import { validationResult } from "express-validator";
import { AuthenticatedNewsRequest } from "../types/news";
import { Response } from "express";
import { createNewNewsArticleService } from "../services/news.service";

export const createNewNewsArticleController = async (
  request: AuthenticatedNewsRequest,
  response: Response
) => {
  try {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({
        success: false,
        message: "Validation Failed!",
        errors: errors.array(),
      });
    }

    const newsArticle = await createNewNewsArticleService(request.body);
    return response.status(201).json({
      status: true,
      message: "News Draft Created",
      data: newsArticle,
    });
  } catch (error) {
    console.log("/create-draft error : ", error);
    return response.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
