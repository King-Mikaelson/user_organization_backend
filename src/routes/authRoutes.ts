import express from "express";
import * as authorizationMiddleware from "../middleware/AuthorizationMiddleware.ts";
import { check, cookie } from "express-validator";
import * as authController from "../controllers/AuthController.ts";

const router = express.Router();

router.post(
  "/login",
  [
    check("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is not valid"),
    check("password")
      .notEmpty()
      .isLength({ min: 11 })
      .withMessage("Password length must be at least 11"),
  ],
  async (req, res) => {
    await authController.login(req, res);
  }
);

router.post(
  "/register",
  [
    check("firstName").notEmpty().withMessage("firstName is required."),
    check("lastName").notEmpty().withMessage("lastName is required."),
    check("phone").notEmpty().withMessage("phone is required."),
    check("password")
      .notEmpty()
      .isLength({ min: 11 })
      .withMessage("password length must be at least 11"),
    check("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is not valid"),
  ],
  async (req, res) => {
    await authController.signUp(req, res);
  }
);


router.post("/logout", [], async (req, res) => {
  await authController.logout(req, res);
});

export default router;
