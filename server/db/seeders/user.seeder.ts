import prisma from "@/app/lib/prisma"
import { TRole } from "@/common/types"
import { hashPassword } from "@/server/helpers/auth.utils"
import { faker } from "@faker-js/faker"
import { loop } from "./seeder.util"

export async function user(type: TRole) {

  const levelMap = {
    STUDENT: faker.helpers.arrayElement(['100', '200', '300', '400', '500']),
    LECTURER: faker.helpers.arrayElement(['professor', 'senior', 'junior']),
    ADMIN: ""
  }
  
  return {
    fullname: faker.person.fullName(),
    email: faker.internet.email(),
    gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
    level: levelMap[type],
    password: await hashPassword('@Password1'),
    role: type
  }
}

const data = await loop(10, () => user('LECTURER'))

// Insert generated users
await prisma.user.createMany({ data })