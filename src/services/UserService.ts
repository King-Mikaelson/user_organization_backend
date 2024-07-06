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

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

async function HandleCreateUser(email, password, firstName, lastName, phone) {
  try {
    const orgName = `${firstName}'s Organisation`;
    const orgId = uuidv4();

    const user = await prisma.user.findUnique({
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

    const hashedPassword = await hashPassword(password);
    // Create a new organisation and a new user, and connect the user to the organisation
    const savedUser = await prisma.user.create({
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

    const accessToken = await toolbox.generateAccessToken(savedUser);

    return { accessToken, user: savedUser };
  } catch (error) {
    throw {
      message: error.message,
      code: error.code
        ? error.code
        : config.HTTP_CODES.BAD_REQUEST || 400,
      status: error.status,
    };
  }
}

async function HandleLogin(email, password) {
  try {
    const user = await prisma.user.findUnique({
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

    const isMatch = await verifyPassword(password, user.password);

    if (!isMatch) {
      throw {
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      };
    }

    const accessToken = await toolbox.generateAccessToken(user);

    return { accessToken, user };
  } catch (error) {
    throw {
      message: error.message,
      statusCode: error.statusCode,
      status: error.status,
    };
  }
}
async function HandleRefreshToken(token) {
  try {
    if (!token) {
      throw {
        message: config.RESPONSE_MESSAGES.NO_REFRESH_TOKEN,
        code: config.HTTP_CODES.BAD_REQUEST,
      };
    }

    const existingToken = await this.userRepository.getRefreshToken({
      token: token,
    });

    if (!existingToken) {
      throw {
        message: config.RESPONSE_MESSAGES.INVALID_REFRESH_TOKEN,
        code: config.HTTP_CODES.BAD_REQUEST,
      };
    }

    const decoded = await jwtVerifyAsync(token, process.env.SECRET_KEY);

    const user = await this.userRepository.getUserById(decoded.user._id);

    if (!user) {
      throw {
        message: config.RESPONSE_MESSAGES.USER_NOT_FOUND,
        code: config.HTTP_CODES.NOT_FOUND || 404,
      };
    }

    const accessToken = await toolbox.generateAccessToken(user);
    const refreshToken = await toolbox.generateRefreshToken(user);

    // Delete any existing refresh tokens for this user
    await this.userRepository.deleteRefreshTokens({ userId: user._id });

    await this.userRepository.storeRefreshToken({
      token: refreshToken,
      userId: user._id,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw {
      message: error.message,
      code: error.code
        ? error.code
        : config.HTTP_CODES.INTERNAL_SERVER_ERROR || 500,
    };
  }
}

export { HandleCreateUser, HandleLogin, HandleRefreshToken };
