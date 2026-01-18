import { Request, Response } from "express";
import crypto from "crypto";

export const imageUploadController = async (
  request: Request,
  response: Response
) => {
  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 60; // 1 minute
  const signature = crypto
    .createHmac("sha1", process.env.IMAGEKIT_PRIVATE_KEY!)
    .update(token + expire)
    .digest("hex");

  const resData = { token, expire, signature };
  return response.status(200).json({
    status: true,
    message: "Image Signature Generated!",
    data: resData,
  });
};
