var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import process from "process";
import config from "../config.ts";
import * as toolbox from "../utilities/ToolBoxUtility.ts";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
const saltRounds = 10;
const jwtVerifyAsync = promisify(jwt.verify);
const prisma = new PrismaClient();
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt.genSalt(saltRounds);
        const hashedPassword = yield bcrypt.hash(password, salt);
        return hashedPassword;
    });
}
function verifyPassword(password, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt.compare(password, hashedPassword);
    });
}
function HandleCreateUser(email, password, firstName, lastName, phone) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const orgName = `${firstName}'s Organisation`;
            const orgId = uuidv4();
            const user = yield prisma.user.findUnique({
                where: {
                    email: email,
                },
            });
            // const organization = await prisma.organisation.findFirst({
            //   where: {
            //     name: orgName,
            //   },
            // });
            // if (user) {
            //   await prisma.userOrganisations.delete({
            //     where: {
            //       authorId_organisationId: {
            //         authorId: user.userId,
            //         organisationId: organization.orgId,
            //       },
            //     },
            //   });
            // }
            // if (user) {
            //   await prisma.user.delete({
            //     where: {
            //       email,
            //     },
            //   });
            // }
            // if (organization) {
            //   await prisma.organisation.delete({
            //     where: {
            //       orgId: organization.orgId,
            //     },
            //   });
            // }
            if (user) {
                throw {
                    message: "Registration unsuccessful",
                    code: config.HTTP_CODES.BAD_REQUEST || 400,
                    status: "Bad request",
                };
            }
            const hashedPassword = yield hashPassword(password);
            // Create a new organisation and a new user, and connect the user to the organisation
            const savedUser = yield prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    phone,
                    organisations: {
                        create: {
                            organisation: {
                                create: {
                                    orgId: orgId,
                                    name: orgName,
                                    description: "Default description",
                                },
                            },
                        },
                    },
                },
            });
            if (!savedUser) {
                throw {
                    message: "Registration unsuccessful",
                    code: config.HTTP_CODES.BAD_REQUEST || 400,
                    status: "Bad request",
                };
            }
            const accessToken = yield toolbox.generateAccessToken(savedUser);
            return { accessToken, user: savedUser };
        }
        catch (error) {
            throw {
                message: error.message,
                code: error.code
                    ? error.code
                    : config.HTTP_CODES.BAD_REQUEST || 400,
                status: error.status,
            };
        }
    });
}
function HandleLogin(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield prisma.user.findUnique({
                where: {
                    email: email,
                },
            });
            if (!user) {
                throw {
                    status: "Bad request",
                    message: "Authentication failed",
                    statusCode: 401,
                };
            }
            const isMatch = yield verifyPassword(password, user.password);
            if (!isMatch) {
                throw {
                    status: "Bad request",
                    message: "Authentication failed",
                    statusCode: 401,
                };
            }
            const accessToken = yield toolbox.generateAccessToken(user);
            return { accessToken, user };
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
function HandleRefreshToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!token) {
                throw {
                    message: config.RESPONSE_MESSAGES.NO_REFRESH_TOKEN,
                    code: config.HTTP_CODES.BAD_REQUEST,
                };
            }
            const existingToken = yield this.userRepository.getRefreshToken({
                token: token,
            });
            if (!existingToken) {
                throw {
                    message: config.RESPONSE_MESSAGES.INVALID_REFRESH_TOKEN,
                    code: config.HTTP_CODES.BAD_REQUEST,
                };
            }
            const decoded = yield jwtVerifyAsync(token, process.env.SECRET_KEY);
            const user = yield this.userRepository.getUserById(decoded.user._id);
            if (!user) {
                throw {
                    message: config.RESPONSE_MESSAGES.USER_NOT_FOUND,
                    code: config.HTTP_CODES.NOT_FOUND || 404,
                };
            }
            const accessToken = yield toolbox.generateAccessToken(user);
            const refreshToken = yield toolbox.generateRefreshToken(user);
            // Delete any existing refresh tokens for this user
            yield this.userRepository.deleteRefreshTokens({ userId: user._id });
            yield this.userRepository.storeRefreshToken({
                token: refreshToken,
                userId: user._id,
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });
            return { accessToken, refreshToken };
        }
        catch (error) {
            throw {
                message: error.message,
                code: error.code
                    ? error.code
                    : config.HTTP_CODES.INTERNAL_SERVER_ERROR || 500,
            };
        }
    });
}
export { HandleCreateUser, HandleLogin, HandleRefreshToken };
