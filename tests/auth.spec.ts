import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import {
  generateAccessToken,
  verifyToken,
} from "../src/utilities/ToolBoxUtility.ts"; // Adjust the import based on your setup
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

jest.mock("jsonwebtoken");

describe("Token Generation", () => {
  const userPayload = {
    userId: "user-id",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    phone: "1234567890",
  };

  it("should generate a token with correct user details and expiration time", async() => {
    const mockSign = jwt.sign as jest.Mock;
    mockSign.mockReturnValue("mockToken");

    const token = await generateAccessToken(userPayload);

    expect(token).toBe("mockToken");
    expect(mockSign).toHaveBeenCalledWith({
      email:userPayload.email,
      userId:userPayload.userId
    }, process.env.SECRET_KEY, { expiresIn: "15m" });
  });

  it("should verify the token and return user details", async () => {
    const mockVerify = jwt.verify as jest.Mock;
    mockVerify.mockReturnValue(userPayload);

    const decoded = await verifyToken("mockToken", process.env.SECRET_KEY);

    expect(decoded).toEqual(userPayload);
    expect(mockVerify).toHaveBeenCalledWith("mockToken",  process.env.SECRET_KEY);
  });



  it("should return null for invalid token", async () => {
    const mockVerify = jwt.verify as jest.Mock;
    mockVerify.mockReturnValue(null);

    const decoded = await verifyToken("mockToken", process.env.SECRET_KEY);

    expect(decoded).toBeNull();
    expect(mockVerify).toHaveBeenCalledWith("mockToken",  process.env.SECRET_KEY);
  });
  
});
