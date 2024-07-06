import process from "process";
import config from "../config.ts";
import * as toolbox from "../utilities/ToolBoxUtility.ts";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

async function HandleCreateOrganisation(name: string, description: string) {
  try {
    const orgId = uuidv4();
    const newOrganisation = await prisma.organisation.create({
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
  } catch (error) {
    throw {
      message: error.message,
      statusCode: error.code,
      status: error.status,
    };
  }
}

async function HandleGetOrganisation(orgId) {
  try {
    const organisation = await prisma.organisation.findUnique({
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
  } catch (error) {
    throw {
      message: error.message,
      statusCode: error.statusCode,
      status: error.status,
    };
  }
}
async function HandleGetOrganisations(userDetails) {
  try {
    console.log(userDetails);
    const userOrganisations = await prisma.userOrganisations.findMany({
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
    const organisations = userOrganisations.map(
      (userOrg) => userOrg.organisation
    );

    return organisations;
  } catch (error) {
    throw {
      message: error.message,
      statusCode: error.statusCode,
      status: error.status,
    };
  }
}

async function HandleAddNewMember(orgId, userId) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        userId
      },
    });

    if (!user) {
      throw {
        message: "User Not Found",
        code: config.HTTP_CODES.NOT_FOUND|| 404,
        status: "Bad request",
      };
    }
    const organisation = await prisma.organisation.findUnique({
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

    const newOrganisation = await prisma.userOrganisations.create({
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
  } catch (error) {
    throw {
      message: error.message,
      statusCode: error.code,
      status: error.status,
    };
  }
}

export {
  HandleCreateOrganisation,
  HandleGetOrganisation,
  HandleGetOrganisations,
  HandleAddNewMember,
};
