import express from "express";
import * as authorizationMiddleware from "../middleware/AuthorizationMiddleware.ts";
import { check, cookie, param } from "express-validator";
import * as organisationController from "../controllers/OrganisationController.ts";

const router = express.Router();

router.post(
  "/",
  [
    authorizationMiddleware.authorize(),
    check("name").notEmpty().withMessage("name is required"),
  ],
  async (req, res) => {
    await organisationController.createOrganisation(req, res);
  }
);

router.post(
  "/:orgId/users",
  [
    authorizationMiddleware.authorize(),
    param("orgId").notEmpty().withMessage("orgId is required"),
    check("userId").notEmpty().withMessage("userId is required"),
  ],
  async (req, res) => {
    await organisationController.addNewMember(req, res);
  }
);

router.get(
  "/:orgId",
  [
    authorizationMiddleware.authorize(),
    param("orgId").notEmpty().withMessage("orgId is required"),
  ],
  async (req, res) => {
    await organisationController.getOrganisation(req, res);
  }
);

router.get("/", [authorizationMiddleware.authorize()], async (req, res) => {
  await organisationController.getOrganisations(req, res);
});

export default router;
