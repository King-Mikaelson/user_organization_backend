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
import { check, param } from "express-validator";
import * as organisationController from "../controllers/OrganisationController.ts";
const router = express.Router();
router.post("/", [
    authorizationMiddleware.authorize(),
    check("name").notEmpty().withMessage("name is required"),
    check("description").notEmpty().withMessage("description is required"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield organisationController.createOrganisation(req, res);
}));
router.post("/:orgId/users", [
    authorizationMiddleware.authorize(),
    param("orgId").notEmpty().withMessage("orgId is required"),
    check("userId").notEmpty().withMessage("userId is required"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield organisationController.addNewMember(req, res);
}));
router.get("/:orgId", [
    authorizationMiddleware.authorize(),
    param("orgId").notEmpty().withMessage("orgId is required"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield organisationController.getOrganisation(req, res);
}));
router.get("/", [authorizationMiddleware.authorize()], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield organisationController.getOrganisations(req, res);
}));
export default router;
