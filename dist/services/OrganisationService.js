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
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();
function HandleCreateOrganisation(name, description) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const orgId = uuidv4();
            const newOrganisation = yield prisma.organisation.create({
                data: {
                    orgId,
                    name,
                    description,
                },
            });
            if (!newOrganisation) {
                throw {
                    message: "Client error",
                    code: config.HTTP_CODES.BAD_REQUEST || 400,
                    status: "Bad request",
                };
            }
            return newOrganisation;
        }
        catch (error) {
            throw {
                message: error.message,
                statusCode: error.code,
                status: error.status,
            };
        }
    });
}
function HandleGetOrganisation(orgId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const organisation = yield prisma.organisation.findUnique({
                where: {
                    orgId,
                },
            });
            if (!organisation) {
                throw {
                    message: "Organisation Does Not Exist",
                    statusCode: 404,
                    status: "Not Found",
                };
            }
            return organisation;
        }
        catch (error) {
            throw {
                message: error.message,
                statusCode: error.statusCode,
                status: error.status,
            };
        }
    });
}
function HandleGetOrganisations(userDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userOrganisations = yield prisma.userOrganisations.findMany({
                where: {
                    authorId: userDetails.userId,
                },
                select: {
                    organisation: true,
                },
            });
            if (userOrganisations.length === 0) {
                throw {
                    status: "Bad request",
                    message: "No organisations found for the user",
                    statusCode: 404,
                };
            }
            // Extract and return the organisation details
            const organisations = userOrganisations.map((userOrg) => userOrg.organisation);
            return organisations;
        }
        catch (error) {
            throw {
                message: error.message,
                statusCode: error.statusCode,
                status: error.status,
            };
        }
    });
}
function HandleAddNewMember(orgId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield prisma.user.findUnique({
                where: {
                    userId
                },
            });
            if (!user) {
                throw {
                    message: "User Not Found",
                    code: config.HTTP_CODES.NOT_FOUND || 404,
                    status: "Bad request",
                };
            }
            const organisation = yield prisma.organisation.findUnique({
                where: {
                    orgId,
                },
            });
            if (!organisation) {
                throw {
                    message: "Organisation Does Not Exist",
                    statusCode: 404,
                    status: "Not Found",
                };
            }
            const newOrganisation = yield prisma.userOrganisations.create({
                data: {
                    organisationId: orgId,
                    authorId: userId,
                },
            });
            if (!newOrganisation) {
                throw {
                    message: "Client error",
                    code: config.HTTP_CODES.BAD_REQUEST || 400,
                    status: "Bad request",
                };
            }
            return newOrganisation;
        }
        catch (error) {
            throw {
                message: error.message,
                statusCode: error.code,
                status: error.status,
            };
        }
    });
}
export { HandleCreateOrganisation, HandleGetOrganisation, HandleGetOrganisations, HandleAddNewMember, };
