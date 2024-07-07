var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
function generateAccessToken(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return jwt.sign({ userId: user.userId, email: user.email }, process.env.SECRET_KEY, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });
    });
}
function generateRefreshToken(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return jwt.sign({ user }, process.env.SECRET_KEY, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        });
    });
}
function verifyToken(token, secret) {
    return __awaiter(this, void 0, void 0, function* () {
        return jwt.verify(token, secret);
    });
}
;
export { generateAccessToken, verifyToken, generateRefreshToken };
