import { News } from "../types/news";
import { prisma } from "../db/prisma";

export const createNewNewsArticleService = async (payload:News)=>{

    const newsArticle = await prisma.article.create({
        data:{
            title:payload.title,
            content:payload.content,
            summary:payload.summary,
            coverPageImg:payload.coverPageImg,
            imageUrls:payload.imageUrls,
            region:payload.region,
            category:payload.category,
            isDrafted:true,
        }
    })
    return newsArticle
}