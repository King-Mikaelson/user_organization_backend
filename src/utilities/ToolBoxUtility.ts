import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
async function generateAccessToken(user) {
  return jwt.sign(
    { userId: user.userId, email: user.email },
    process.env.SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
}

async function generateRefreshToken(user) {
  return jwt.sign({ user }, process.env.SECRET_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
}

async function verifyToken(token, secret) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

export { generateAccessToken, verifyToken, generateRefreshToken };
