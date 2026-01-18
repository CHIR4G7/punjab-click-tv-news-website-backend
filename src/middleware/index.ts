import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    username: string;
  };
}

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
};

export const fetchUser = (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    if (request.cookies && request.cookies.access_token) {
      token = request.cookies.access_token;
    }

    if (!token) {
      return response.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as any;
    console.log(decoded)
    request.user = {
      id: decoded.id,
      name: decoded.name,
      username: decoded.username,
    };

    next();
  } catch (error) {
    console.log("/fetchUser MiddleWare Error : ", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return response.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return response.status(401).json({
        success: false,
        message: "Token expired.",
      });
    }

    return response.status(500).json({
      success: false,
      message: "Token verification failed.",
    });
  }
};

export {AuthenticatedRequest}