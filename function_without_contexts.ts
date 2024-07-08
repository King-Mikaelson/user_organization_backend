import prisma from './client'

interface CreateUser {
  firstName: string
  lastName: string
  email: string,
  password: string
  phone:string
}

export async function createUser(user: CreateUser) {
  if (user.acceptTermsAndConditions) {
    return await prisma.user.create({
      data: user,
    })
  } else {
    return new Error('User must accept terms!')
  }
}

interface UpdateUser {
  id: string
  name: string
  email: string
}

export async function updateUsername(user: UpdateUser) {
  return await prisma.user.update({
    where: { userId: user.id },
    data: user,
  })
}


interface LogInUser {
  name: string
  password: string
}

export async function logInUser(user: LogInUser) {
  return await prisma.user.findFirst({
    where: { userId: user. },
  })
}