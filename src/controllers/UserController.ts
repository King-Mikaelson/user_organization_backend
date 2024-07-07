import config from "../config.ts";
import * as ExpressValidatorHelper from "../helpers/ExpressValidatorHelper.ts";
import * as userService from "../services/UserService.ts";

async function getUser(req, res) {
  try {
    await ExpressValidatorHelper.resolveMessageWithResponse(req, res);
    const {id} = req.params;
    const userDetails = req.user

    // Authenticate the user and get the token
    const user = await userService.HandleGetUser(id, userDetails);

    res.status(200).json({
      status: config.RESPONSE_MESSAGES.SUCCESS,
      message: "User Details fetched successfully",
      data: user,
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

export {getUser };
