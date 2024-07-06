import config from "../config.ts";
import * as ExpressValidatorHelper from "../helpers/ExpressValidatorHelper.ts";
import * as userService from "../services/UserService.ts";

async function getUser(req, res) {
  try {
    await ExpressValidatorHelper.resolveMessageWithResponse(req, res);
    const { email, password } = req.body;

    // Authenticate the user and get the token
    const user = await userService.HandleLogin(email, password);

    res.status(201).json({
      status: config.RESPONSE_MESSAGES.SUCCESS,
      message: config.RESPONSE_MESSAGES.LOGIN_SUCCESSFUL,
      data: user,
    });
  } catch (error) {
    res.status(error.code).json({
      ...(error.status ? { status: error.status } : {}),
      ...(error.errors ? { errors: error.errors } : { message: error.message }),
      ...(error.statusCode
        ? { statusCode: error.statusCode }
        : { code: error.code }),
    });
  }
}

export {getUser };
