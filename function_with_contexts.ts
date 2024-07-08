import { Context } from "./context";
import { SimplifiedUser, SimplifiedOrganisation } from "./types";

interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  userId: string;
}

export async function createUser(
  user: CreateUser,
  ctx: Context
): Promise<SimplifiedUser> {
  return await ctx.prisma.user.create({
    data: user,
  });
}

interface CreateOrganisation {
  name: string;
  orgId: string;
  description: string;
}

export async function createOrganisation(
  organisation: CreateOrganisation,
  ctx: Context
): Promise<SimplifiedOrganisation> {
  return await ctx.prisma.organisation.create({
    data: organisation,
  });
}

interface userOrganisation {
  userId: string;
  orgId: string;
}

export async function getUserOrganisation(
  user: userOrganisation,
  ctx: Context
) {
  return await ctx.prisma.userOrganisations.findFirst({
    where: { authorId: user.userId, organisationId: user.orgId },
  });
}
