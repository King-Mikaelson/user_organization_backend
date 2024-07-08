import express from "express";
import * as authorizationMiddleware from "../middleware/AuthorizationMiddleware.ts";
import { body, check, cookie } from "express-validator";
import * as authController from "../controllers/AuthController.ts";

const router = express.Router();

router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 5 })
      .withMessage("Password length must be at least 5"),
  ],
  async (req, res) => {
    await authController.login(req, res);
  }
);

router.post(
  "/register",
  [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("phone").notEmpty().withMessage("Phone number is required."),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 5 })
      .withMessage("Password length must be at least 5"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid"),
  ],
  async (req, res) => {
    await authController.signUp(req, res);
  }
);

router.get("/logout", [], async (req, res) => {
  res.status(200).json({
    status: 200,
    message: "USER_LOGGED_OUT",
    data: "user",
  });
});

export default router;
