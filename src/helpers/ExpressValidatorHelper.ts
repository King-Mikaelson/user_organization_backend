import { validationResult, ValidationError } from "express-validator";
import config from "../config.ts";

/**
 * Resolves the error message and automatically send http response based on the validation result.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with errors if validation fails.
 */

let newArray = []
const resolveMessageWithResponse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array()
    newArray.push(formattedErrors)
    throw {
      errors: newArray[0].map(data => ({
        field: data.path,
        message: data.msg
        
      })),
      code: config.HTTP_CODES.UNPROCESSABLE_ENTITY || 422,
    };
  }
};

export { resolveMessageWithResponse };
