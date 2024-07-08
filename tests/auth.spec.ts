import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  verifyToken,
} from "../src/utilities/ToolBoxUtility.ts"; // Adjust the import based on your setup
import {
  createUser,
  createOrganisation,
  getUserOrganisation,
} from "../function_without_contexts.ts";
import { prismaMock } from "../singleton.ts";

import { SimplifiedUser, SimplifiedOrganisation } from "../types.ts";

import { v4 as uuidv4 } from "uuid";

jest.mock("jsonwebtoken");

describe("Token Generation", () => {
  const userPayload = {
    userId: "user-id",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    phone: "1234567890",
  };

  it("should generate a token with correct user details and expiration time", async () => {
    const mockSign = jwt.sign as jest.Mock;
    mockSign.mockReturnValue("mockToken");

    const token = await generateAccessToken(userPayload);

    expect(token).toBe("mockToken");
    expect(mockSign).toHaveBeenCalledWith(
      {
        email: userPayload.email,
        userId: userPayload.userId,
      },
      process.env.SECRET_KEY,
      { expiresIn: "15m" }
    );
  });

  it("should verify the token and return user details", async () => {
    const mockVerify = jwt.verify as jest.Mock;
    mockVerify.mockReturnValue(userPayload);

    const decoded = await verifyToken("mockToken", process.env.SECRET_KEY);

    expect(decoded).toEqual(userPayload);
    expect(mockVerify).toHaveBeenCalledWith(
      "mockToken",
      process.env.SECRET_KEY
    );
  });

  it("should return null for invalid token", async () => {
    const mockVerify = jwt.verify as jest.Mock;
    mockVerify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const decoded = await verifyToken("mockToken", process.env.SECRET_KEY);

    expect(decoded).toBeNull();
    expect(mockVerify).toHaveBeenCalledWith(
      "mockToken",
      process.env.SECRET_KEY
    );
  });
});
describe("Organisation Access", () => {
  test("Ensure users can’t see data from organisations they don’t have access to", async () => {
    const orgId = uuidv4();

    const organisation = {
      name: "Test Description",
      orgId: orgId,
      description: "Test Description",
    };

    const user = {
      userId: "user-id",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      phone: "1234567890",
      password: "Password12*",
    };

    (prismaMock.user as any).create.mockResolvedValue(user as SimplifiedUser);

    await expect(createUser(user)).resolves.toEqual({
      userId: "user-id",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      phone: "1234567890",
      password: "Password12*",
    });

    // Mock organisation creation
    (prismaMock.organisation as any).create.mockResolvedValue(
      organisation as SimplifiedOrganisation
    );

    await expect(createOrganisation(organisation)).resolves.toEqual({
      name: "Test Description",
      orgId: orgId,
      description: "Test Description",
    });

    

    const org = await (prismaMock.organisation as any).create({
      data: { name: "Test Organisation", description: "New Organization" },
    });


    // Mock finding user organisations
    (
      prismaMock.userOrganisations as any
    ).findMany.mockResolvedValue({
      userId: user.userId,
      orgId: org.orgId
    });

    const res = await (
      prismaMock.userOrganisations as any
    ).findMany({
      where: { authorId: user.userId, organisationId: org.orgId },
    });

    console.log(res)


    expect(res.length).toBe(0);
  });
});
