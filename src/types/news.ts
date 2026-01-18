import { Request } from "express";

export interface AuthenticatedNewsRequest extends Request {
  user?: {
    id: string;
    name: string;
    username: string;
  };
}

export type News = {
  title: string;
  content: string;
  summary: string;
  category: string;
  region: string;
  coverPageImg: string;
  imageUrls: string[];
};
