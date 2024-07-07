var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import config from "../config.ts";
import * as ExpressValidatorHelper from "../helpers/ExpressValidatorHelper.ts";
import * as organisationService from "../services/OrganisationService.ts";
function createOrganisation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield ExpressValidatorHelper.resolveMessageWithResponse(req, res);
            const { name, description } = req.body;
            const organisation = yield organisationService.HandleCreateOrganisation(name, description);
            res.status(201).json({
                status: config.RESPONSE_MESSAGES.SUCCESS,
                message: "Organisation created successfully",
                data: organisation,
            });
        }
        catch (error) {
            res.status(error.statusCode ? error.statusCode : error.code).json(Object.assign(Object.assign(Object.assign({}, (error.status ? { status: error.status } : {})), (error.errors ? { errors: error.errors } : { message: error.message })), (error.errors
                ? {}
                : error.statusCode
                    ? { statusCode: error.statusCode }
                    : { code: error.code })));
        }
    });
}
function addNewMember(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield ExpressValidatorHelper.resolveMessageWithResponse(req, res);
            const { userId } = req.body;
            const { orgId } = req.params;
            // Authenticate the user and get the token
            yield organisationService.HandleAddNewMember(orgId, userId);
            res.status(200).json({
                status: "success",
                message: "User added to organisation successfully",
            });
        }
        catch (error) {
            res.status(error.statusCode ? error.statusCode : error.code).json(Object.assign(Object.assign(Object.assign({}, (error.status ? { status: error.status } : {})), (error.errors ? { errors: error.errors } : { message: error.message })), (error.statusCode
                ? { statusCode: error.statusCode }
                : { code: error.code })));
        }
    });
}
// 1725d55b-32d3-40ee-bf81-9308b6f49af3
function getOrganisations(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield ExpressValidatorHelper.resolveMessageWithResponse(req, res);
            const userDetails = req.user;
            const organisations = yield organisationService.HandleGetOrganisations(userDetails);
            res.status(200).json({
                status: config.RESPONSE_MESSAGES.SUCCESS,
                message: "Organisation successfully fetched",
                data: { organisations },
            });
        }
        catch (error) {
            res.status(error.statusCode ? error.statusCode : error.code).json(Object.assign(Object.assign(Object.assign({}, (error.status ? { status: error.status } : {})), (error.errors ? { errors: error.errors } : { message: error.message })), (error.errors
                ? {}
                : error.statusCode
                    ? { statusCode: error.statusCode }
                    : { code: error.code })));
        }
    });
}
function getOrganisation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield ExpressValidatorHelper.resolveMessageWithResponse(req, res);
            const { orgId } = req.params;
            const organisation = yield organisationService.HandleGetOrganisation(orgId);
            res.status(200).json({
                status: config.RESPONSE_MESSAGES.SUCCESS,
                message: "Organisation successfully fetched",
                data: organisation,
            });
        }
        catch (error) {
            res.status(error.statusCode ? error.statusCode : error.code).json(Object.assign(Object.assign(Object.assign({}, (error.status ? { status: error.status } : {})), (error.errors ? { errors: error.errors } : { message: error.message })), (error.errors
                ? {}
                : error.statusCode
                    ? { statusCode: error.statusCode }
                    : { code: error.code })));
        }
    });
}
export { createOrganisation, addNewMember, getOrganisation, getOrganisations };
