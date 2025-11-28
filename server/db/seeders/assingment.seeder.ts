
import { faker } from "@faker-js/faker"
import { loop } from "./seeder.util"
import prisma from "@/app/lib/prisma"

export async function assignment(courseId: string) {
  const today = new Date()
  const min = today.setHours(72)
  const max = today.setHours(72)
  return {
    title: faker.word.words(3),
    description: faker.word.sample(),
    dueDate: faker.date.between({from: min, to: max}),
    courseId,
  }
}

const data = await loop(15, () => assignment('cmhvy8hch0000nvvwt4cls00o'))

const a  = await prisma.assignment.createMany({data})
console.log(a)
