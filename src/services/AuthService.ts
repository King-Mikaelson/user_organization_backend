import config from "../config.ts";
import * as toolbox from "../utilities/ToolBoxUtility.ts";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
const saltRounds = 10;
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

    if (user) {
      throw {
        message: "Registration unsuccessful",
        statusCode: config.HTTP_CODES.BAD_REQUEST || 400,
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
        statusCode: config.HTTP_CODES.BAD_REQUEST || 400,
        status: "Bad request",
      };
    }

    const accessToken = await toolbox.generateAccessToken(savedUser);
    delete savedUser.password
    return { accessToken, user: savedUser };
  } catch (error) {
    throw {
      message: error.message,
      statusCode: error.statusCode,
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
    delete user.password
    return { accessToken, user };
  } catch (error) {
    throw {
      message: error.message,
      statusCode: error.statusCode,
      status: error.status,
    };
  }
}


export { HandleCreateUser, HandleLogin };
