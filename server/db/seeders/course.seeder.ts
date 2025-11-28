
import { faker } from "@faker-js/faker"
import { loop } from "./seeder.util"
import prisma from "@/app/lib/prisma"

export async function course() {
  
  return {
    code: faker.word.noun(),
    description: faker.word.words(6),
    level: faker.helpers.arrayElement(['100', '200']),
    name: faker.word.words(2),
    image: faker.image.urlPicsumPhotos()
  }
}

const data = await loop(30, () => course())

const a  = await prisma.course.createMany({data})
console.log(a)
