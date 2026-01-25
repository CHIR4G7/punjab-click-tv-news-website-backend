import { News } from "../types/news";
import { prisma } from "../db/prisma";

export const createNewNewsArticleService = async (payload: News) => {
  const newsArticle = await prisma.article.create({
    data: {
      title: payload.title,
      content: payload.content,
      summary: payload.summary,
      coverPageImg: payload.coverPageImg,
      imageUrls: payload.imageUrls,
      region: payload.region,
      category: payload.category,
      isDrafted: true,
    },
  });
  return newsArticle;
};

export const getArticlesPaginatedService = async (payload: any) => {
  const articles = await prisma.article.findMany(payload);
  return articles;
};

export const publishArticleService = async (id: string, data: any) => {
  const existingArticle = await prisma.article.findUnique({
    where: { id },
  });

  if (!existingArticle) {
    throw new Error("ARTICLE_NOT_FOUND");
  }

  if (!existingArticle.isDrafted) {
    throw new Error("ARTICLE_NOT_DRAFTED");
  }

  const updatedArticle = await prisma.article.update({
    where: { id },
    data: {
      isPublished: true,
      isDrafted: false,
      publishedAt: new Date(),
    },
  });

  return updatedArticle
};
