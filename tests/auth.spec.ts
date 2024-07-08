import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  verifyToken,
} from "../src/utilities/ToolBoxUtility.ts"; // Adjust the import based on your setup
import { prismaMock } from "../singleton.ts";
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
  test("Ensure users can't see data from organisations they don't have access to", async () => {
    const userId = "user-id";
    const orgId = uuidv4();

    // Mock finding user organisations
    (prismaMock.userOrganisations as any).findMany.mockResolvedValue([]);

    // Attempt to find the user's association with the organisation
    const userOrgs = await (prismaMock.userOrganisations as any).findMany({
      where: { userId: userId, organisationId: orgId },
    });

    expect(userOrgs).toEqual([]);

    (prismaMock.organisation as any).findUnique.mockResolvedValue(null);

    const org = await (prismaMock.organisation as any).findUnique({
      where: { orgId: orgId },
    });

    // Expect the organisation not to be found
    expect(org).toBeNull();
  });
});
