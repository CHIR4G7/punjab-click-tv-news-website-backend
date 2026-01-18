import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { prisma } from "../db/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createAdminService,
  loginAdminService,
} from "../services/verify.service";

export const createAdminController = async (
  request: Request,
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
    const { name, username, password } = request.body;

    const res = await createAdminService(request.body); //Service Layer Being Called

    return response.status(201).json({
      status: true,
      message: "User Created",
      data: res,
    });
  } catch (error) {
    console.log("/create error : ", error);
    return response.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const loginAdminController = async (
  request: Request,
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

    const { username, password } = request.body;

    const { existingUser, token } = await loginAdminService(username, password);

    response.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 2 * 60 * 60 * 1000, //1 hr
    });

    return response.status(200).json({
      success: true,
      message: "Login Successful",
      data: {
        user: {
          id: existingUser.id,
          name: existingUser.name,
          username: existingUser.username,
        },
      },
    });
  } catch (error: any) {
    console.log("/login error : ", error);

    if (error.message === "USER_NOT_FOUND") {
      return response.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (error.message === "PASSWORD_INVALID") {
      return response.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }
    return response.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
