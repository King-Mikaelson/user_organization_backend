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
import * as ExpressValidatorHelper from "../helpers/ExpressValidatorHelper.ts";
import * as userService from "../services/UserService.ts";
function signUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield ExpressValidatorHelper.resolveMessageWithResponse(req, res);
            const { email, password, firstName, lastName, phone } = req.body;
            const user = yield userService.HandleCreateUser(email, password, firstName, lastName, phone);
            res.status(201).json({
                status: config.RESPONSE_MESSAGES.SUCCESS,
                message: config.RESPONSE_MESSAGES.USER_CREATED,
                data: user,
            });
        }
        catch (error) {
            res.status(error.code).json(Object.assign(Object.assign(Object.assign({}, (error.status ? { status: error.status } : {})), (error.errors ? { errors: error.errors } : { message: error.message })), { code: error.code }));
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield ExpressValidatorHelper.resolveMessageWithResponse(req, res);
            const { email, password } = req.body;
            // Authenticate the user and get the token
            const user = yield userService.HandleLogin(email, password);
            res.status(200).json({
                status: config.RESPONSE_MESSAGES.SUCCESS,
                message: config.RESPONSE_MESSAGES.LOGIN_SUCCESSFUL,
                data: user,
            });
        }
        catch (error) {
            res.status(error.code).json(Object.assign(Object.assign(Object.assign({}, (error.status ? { status: error.status } : {})), (error.errors ? { errors: error.errors } : { message: error.message })), (error.statusCode
                ? { statusCode: error.statusCode }
                : { code: error.code })));
        }
    });
}
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () { });
}
export { signUp, login, logout, };
