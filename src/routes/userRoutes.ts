import express from "express";
import * as authorizationMiddleware from "../middleware/AuthorizationMiddleware.ts";
import { check, cookie, param } from "express-validator";
import * as userController from "../controllers/UserController.ts";

const router = express.Router();


router.get(
  "/:id",
  [
    authorizationMiddleware.authorize(),
    param("id")
      .notEmpty()
      .withMessage("userId is required")
  ],
  async (req, res) => {
    await userController.getUser(req, res);
  }
);

export default router;
