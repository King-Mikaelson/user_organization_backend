import config from "../config.ts";
import * as ExpressValidatorHelper from "../helpers/ExpressValidatorHelper.ts";
import * as organisationService from "../services/OrganisationService.ts";
async function createOrganisation(req, res) {
  try {
    await ExpressValidatorHelper.resolveMessageWithResponse(req, res);

    const { name, description } = req.body;
    const organisation = await organisationService.HandleCreateOrganisation(
      name,
      description
    );
    res.status(201).json({
      status: config.RESPONSE_MESSAGES.SUCCESS,
      message: "Organisation created successfully",
      data: organisation,
    });
  } catch (error) {
    res.status(error.statusCode ? error.statusCode : error.code).json({
      ...(error.status ? { status: error.status } : {}),
      ...(error.errors ? { errors: error.errors } : { message: error.message }),
      ...(error.errors
        ? {}
        : error.statusCode
        ? { statusCode: error.statusCode }
        : { code: error.code }),
    });
  }
}

async function addNewMember(req, res) {
  try {
    await ExpressValidatorHelper.resolveMessageWithResponse(req, res);
    const { userId } = req.body;
    const { orgId } = req.params;

    // Authenticate the user and get the token
    await organisationService.HandleAddNewMember(orgId, userId);
    res.status(200).json({
      status: "success",
      message: "User added to organisation successfully",
    });
  } catch (error) {
    res.status(error.statusCode ? error.statusCode : error.code).json({
      ...(error.status ? { status: error.status } : {}),
      ...(error.errors ? { errors: error.errors } : { message: error.message }),
      ...(error.statusCode
        ? { statusCode: error.statusCode }
        : { code: error.code }),
    });
  }
}

// 1725d55b-32d3-40ee-bf81-9308b6f49af3
async function getOrganisations(req, res) {
  try {
    await ExpressValidatorHelper.resolveMessageWithResponse(req, res);

    const userDetails = req.user;
    const organisations = await organisationService.HandleGetOrganisations(
      userDetails
    );
    res.status(200).json({
      status: config.RESPONSE_MESSAGES.SUCCESS,
      message: "Organisation successfully fetched",
      data: { organisations },
    });
  } catch (error) {
    res.status(error.statusCode ? error.statusCode : error.code).json({
      ...(error.status ? { status: error.status } : {}),
      ...(error.errors ? { errors: error.errors } : { message: error.message }),
      ...(error.errors
        ? {}
        : error.statusCode
        ? { statusCode: error.statusCode }
        : { code: error.code }),
    });
  }
}
async function getOrganisation(req, res) {
  try {
    await ExpressValidatorHelper.resolveMessageWithResponse(req, res);

    const { orgId } = req.params;
    const organisation = await organisationService.HandleGetOrganisation(orgId);
    res.status(200).json({
      status: config.RESPONSE_MESSAGES.SUCCESS,
      message: "Organisation successfully fetched",
      data: organisation,
    });
  } catch (error) {
    res.status(error.statusCode ? error.statusCode : error.code).json({
      ...(error.status ? { status: error.status } : {}),
      ...(error.errors ? { errors: error.errors } : { message: error.message }),
      ...(error.errors
        ? {}
        : error.statusCode
        ? { statusCode: error.statusCode }
        : { code: error.code }),
    });
  }
}

export { createOrganisation, addNewMember, getOrganisation, getOrganisations };
