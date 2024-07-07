var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { validationResult } from "express-validator";
import config from "../config.ts";
/**
 * Resolves the error message and automatically send http response based on the validation result.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with errors if validation fails.
 */
let newArray = [];
const resolveMessageWithResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array();
        newArray.push(formattedErrors);
        throw {
            errors: newArray[0].map(data => ({
                field: data.path,
                message: data.msg
            })),
            code: config.HTTP_CODES.UNPROCESSABLE_ENTITY || 422,
        };
    }
});
export { resolveMessageWithResponse };
