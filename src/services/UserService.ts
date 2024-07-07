import { PrismaClient } from "@prisma/client";
import config from "../config.ts";

const prisma = new PrismaClient();

async function HandleGetUser(id, userDetails) {
  try {

    const user = await prisma.user.findUnique({
      where: {
        userId: id,
      },
    });

    if (!user) {
      throw {
        message: "User Not Found",
        statusCode: config.HTTP_CODES.NOT_FOUND || 404,
        status: "Bad request",
      };
    }

    delete user.password

    // if the requested user is same as requested user return the user
    if (userDetails.userId === user.userId) {
      return user;
    }


    // Check if the authenticated user and the requested user share any organizations
    const userOrganizations = await prisma.userOrganisations.findFirst({
      where: {
        authorId: userDetails.userId,
        organisation: {
          users: {
            some: {
              authorId:  user.userId
            }
          }
        }
      }
    });

    if (!userOrganizations) {
      throw {
        status: "Forbidden",
        message: "No similar organisation found",
        statusCode: config.HTTP_CODES.FORBIDDEN,
      };
    }

  return user;
  } catch (error) {
    throw {
      message: error.message,
      statusCode: error.statusCode,
      status: error.status,
    };
  }
}

export { HandleGetUser };
