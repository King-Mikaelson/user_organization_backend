import config from "../config.ts";
import * as ExpressValidatorHelper from "../helpers/ExpressValidatorHelper.ts";
import * as authService from "../services/AuthService.ts";
async function signUp(req, res) {
  try {
    await ExpressValidatorHelper.resolveMessageWithResponse(req, res);

    const { email, password, firstName, lastName, phone } = req.body;
    const user = await authService.HandleCreateUser(
      email,
      password,
      firstName,
      lastName,
      phone
    );
    res.status(201).json({
      status: config.RESPONSE_MESSAGES.SUCCESS,
      message: config.RESPONSE_MESSAGES.USER_CREATED,
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

async function login(req, res) {
  try {
    await ExpressValidatorHelper.resolveMessageWithResponse(req, res);
    const { email, password } = req.body;

    // Authenticate the user and get the token
    const user = await authService.HandleLogin(email, password);

    res.status(200).json({
      status: config.RESPONSE_MESSAGES.SUCCESS,
      message: config.RESPONSE_MESSAGES.LOGIN_SUCCESSFUL,
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


async function logout(req, res) {}


export { signUp, login,  logout};
