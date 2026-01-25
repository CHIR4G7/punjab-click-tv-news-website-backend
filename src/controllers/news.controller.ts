import { validationResult } from "express-validator";
import { ArticleFilters, AuthenticatedNewsRequest } from "../types/news";
import { Request, Response } from "express";
import {
  createNewNewsArticleService,
  getArticlesPaginatedService,
  publishArticleService,
} from "../services/news.service";
import { dynamicQueryBuilder, getNextCursor, parseBoolean } from "../utils";

export const createNewNewsArticleController = async (
  request: AuthenticatedNewsRequest,
  response: Response,
) => {
  try {
    console.log(request.body);
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      console.log(errors.array());
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

export const getAllNewsForAdminPaginatedController = async (
  request: AuthenticatedNewsRequest,
  response: Response,
) => {
  try {
    const limit = Number(request.query.limit) || 2;
    const cursor = request.query.cursor as string | undefined;
    console.log("Admin Limit:", limit);
    const query = await dynamicQueryBuilder({ limit, cursor });
    const articles = await getArticlesPaginatedService(query);

    const data = {
      articles: articles,
      nextCursor: getNextCursor(articles),
      hasMore: articles.length === limit,
    };
    return response.status(200).json({
      success: true,
      message: "Articles Fetched",
      data: data,
    });
  } catch (error: any) {
    console.log("/admin-news error :", error);
    return response.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getCustomNewsController = async (
  request: Request,
  response: Response,
) => {
  try {
    const {
      category,
      region,
      search,
      published,
      drafted,
      cursor,
      fromDate,
      toDate,
      limit,
    } = request.query;

    const filters: ArticleFilters = {
      category: category as string | undefined,
      region: region as string | undefined,
      search: search as string | undefined,
      published: parseBoolean(published as string),
      drafted: parseBoolean(drafted as string),
      cursor: cursor as string | undefined,
      fromDate: fromDate as string | undefined,
      toDate: toDate as string | undefined,
      limit: Number(limit) || 2,
    };

    const query = await dynamicQueryBuilder(filters);
    const articles = await getArticlesPaginatedService(query);

    const data = {
      articles: articles,
      nextCursor: getNextCursor(articles),
      hasMore: articles.length === filters.limit,
    };
    return response.status(200).json({
      success: true,
      message: "Articles Fetched",
      data: data,
    });
  } catch (error) {
    console.log("/news error : ", error);
    return response.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const publishNewsController = async (
  request: AuthenticatedNewsRequest,
  response: Response,
) => {
  try {
    const { id } = request.body;

    if (!id) {
      return response.status(400).json({
        success: false,
        message: "Article ID is required",
      });
    }
    const data = {
      isPublished: true,
      isDrafted: false,
      publishedAt: new Date(),
    };
    const updatedArticle = await publishArticleService(id, data);

    return response.status(200).json({
      success: true,
      message: "Article published successfully",
      data: updatedArticle,
    });
  } catch (error: any) {
    console.log("/publish-news error:", error);

    if (error.message == "ARTICLE_NOT_FOUND") {
      return response.status(500).json({
        success: false,
        message: "Please Provide Valid Article ID!",
      });
    }
    if (error.message == "ARTICLE_NOT_DRAFTED") {
      return response.status(500).json({
        success: false,
        message: "Article Not Drafted or already Published!",
      });
    }
    return response.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
