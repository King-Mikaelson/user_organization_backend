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
import jwt from "jsonwebtoken";
import { promisify } from "util";
/**
 * Authenticates or authorizes a user.
 * @param {string[]} roles - The array of roles to authorize.
 * @returns {Function} A middleware function for authorization.
 */
function authorize() {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const jwtVerifyAsync = promisify(jwt.verify);
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                return res.status(config.HTTP_CODES.UNAUTHORIZED).json({
                    status: config.HTTP_CODES.UNAUTHORIZED,
                    message: "Access denied. No access token provided.",
                    data: "Access denied. No access token provided.",
                });
            }
            const decoded = yield jwtVerifyAsync(token, process.env.SECRET_KEY);
            if (!decoded) {
                return res.status(config.HTTP_CODES.UNAUTHORIZED).json({
                    code: config.HTTP_CODES.UNAUTHORIZED,
                    message: config.RESPONSE_MESSAGES.ACCESS_DENIED,
                    data: null,
                });
            }
            req.user = decoded;
            next();
        }
        catch (error) {
            res.status(config.HTTP_CODES.UNAUTHORIZED).json({
                status: error.name,
                message: error.message,
                code: config.HTTP_CODES.UNAUTHORIZED
            });
        }
    });
}
export { authorize };
