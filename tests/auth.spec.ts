import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
import {generateAccessToken,verifyToken } from '../src/utilities/ToolBoxUtility.ts'; // Adjust the import based on your setup
import { v4 as uuidv4 } from 'uuid';

// Generate a UUID (v4)
const userId: string = uuidv4();

// Create a random email address using UUID
const randomEmail: string = `${userId}@example.com`;

const prisma = new PrismaClient();

describe('Token Generation', () => {

  afterAll(async () => {
    await prisma.$disconnect();
  });
  it('should generate a token with the correct expiry time', async() => {
    const user = { userId: 1, email: randomEmail };
    const token = await generateAccessToken(user);
    const decoded: any = jwt.decode(token);

    expect(decoded.exp).toBeGreaterThan(decoded.iat);
  });

  it('should find correct user details in token', async() => {
    const user = { userId: 1, email: randomEmail };
    const token = await generateAccessToken(user);
    const decoded = await verifyToken(token, process.env.SECRET_KEY);


    expect(decoded.userId).toEqual(user.userId);
    expect(decoded.email).toEqual(user.email);
  });
});

describe('Organisation Access', () => {
  it('should deny access to organisations the user does not belong to', async () => {
    const user = await prisma.user.create({
      data: { email: randomEmail, password: 'password', firstName: 'Test User',lastName:"Anazodo", phone:"07049078543" }
    });

    const org = await prisma.organisation.create({
      data: { name: 'Test Organisation', description:"New Organization" }
    });

    const res = await prisma.userOrganisations.findMany({
      where: { authorId: user.userId, organisationId: org.orgId }
    });

    expect(res.length).toBe(0);
  });
});
