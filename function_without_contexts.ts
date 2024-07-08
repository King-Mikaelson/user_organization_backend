import prisma from "./client";

interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

export async function createUser(user: CreateUser) {
  return await prisma.user.create({
    data: user,
  });
}
interface CreateOrganisation {
  name: string;
  orgId: string;
  description: string;
}

export async function createOrganisation(organisation: CreateOrganisation) {
  return await prisma.organisation.create({
    data: organisation,
  });
}

interface userOrganisation {
  userId: string;
  orgId: string;
}

export async function getUserOrganisation(user: userOrganisation) {
  return await prisma.userOrganisations.findMany({
    where: { authorId: user.userId, organisationId: user.orgId },
  });
}
