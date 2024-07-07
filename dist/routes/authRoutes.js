var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { check } from "express-validator";
import * as authController from "../controllers/AuthController.ts";
const router = express.Router();
router.post("/login", [
    check("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("email is not valid"),
    check("password")
        .notEmpty()
        .isLength({ min: 11 })
        .withMessage("Password length must be at least 11"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield authController.login(req, res);
}));
router.post("/register", [
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
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield authController.signUp(req, res);
}));
router.post("/logout", [], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield authController.logout(req, res);
}));
export default router;
