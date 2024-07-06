import process from "process";
import config from "../config.ts";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { Request, Response, NextFunction } from "express";

// Define the structure of the decoded JWT payload
interface DecodedToken {
  user: {
    role: string;
  };
}

// Extend Express's Request interface to include the decoded user information
declare module "express-serve-static-core" {
  interface Request {
    user?: DecodedToken;
  }
}

/**
 * Authenticates or authorizes a user.
 * @param {string[]} roles - The array of roles to authorize.
 * @returns {Function} A middleware function for authorization.
 */

function authorize() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const jwtVerifyAsync = promisify(jwt.verify);
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(config.HTTP_CODES.UNAUTHORIZED).json({
          status: config.HTTP_CODES.UNAUTHORIZED,
          message: "Access denied. No access token provided.",
          data: "Access denied. No access token provided.",
        });
      }

      const decoded = await jwtVerifyAsync(token, process.env.SECRET_KEY);

      if (!decoded) {
        return res.status(config.HTTP_CODES.UNAUTHORIZED).json({
          code: config.HTTP_CODES.UNAUTHORIZED,
          message: config.RESPONSE_MESSAGES.ACCESS_DENIED,
          data: null,
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      res.status(config.HTTP_CODES.UNAUTHORIZED).json({
        status: error.name,
        message: error.message,
        code:config.HTTP_CODES.UNAUTHORIZED
      });
    }
  };
}

export { authorize };
