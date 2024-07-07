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
import * as authorizationMiddleware from "../middleware/AuthorizationMiddleware.ts";
import { param } from "express-validator";
import * as userController from "../controllers/UserController.ts";
const router = express.Router();
router.get("/organisations/:id", [
    authorizationMiddleware.authorize(),
    param("id")
        .notEmpty()
        .withMessage("orgId is required")
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield userController.getUser(req, res);
}));
export default router;
