import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { prisma } from "../db/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createAdminController,
  loginAdminController,
} from "../controllers/verify.controller";
import {
  createValidation,
  loginValidation,
} from "../middleware/verify.validation";

const router = Router();

// GET /verify - Basic verification endpoint
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Verification endpoint is working",
    timestamp: new Date().toISOString(),
  });
});

//CREATE A NEW ADMIN USER TO ACCESS THE UPLOAD ENDPOINT - ONLY I WILL CREATE A USER
router.post("/create", createValidation, createAdminController);

// POST route where the admin will login and token will be provided
router.post("/login", loginValidation, loginAdminController);

export default router;
