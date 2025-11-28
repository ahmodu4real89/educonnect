"use server"

import { validate } from "@/app/lib/helpers"
import { signUpDto, TLoginDto, TSignUpDto } from "@/common/auth.dto"
import { createSessionToken, destroyAuthCookie, hashPassword, setAuthCookie, verifyPassword } from "../helpers/auth.utils"
import prisma from "@/app/lib/prisma"
import { safe } from "@/common/lib"

export const login = async (credentials: TLoginDto) => {

  const { error, data: user } = await safe(prisma.user.findUnique({ where: { email: credentials.email } }))

  if (error) {
    return { error: "Something went wrong", }
  }
  if (!user) {
    return { error: "Invalid credentials, try again" }
  }


  const verification = await verifyPassword(credentials.password, user.password)

  if (!verification) {
    return { error: "Invalid credentials, try again" }
  }

  const access_token = await createSessionToken({ role: user.role, level: user.level, userId: user.id })

  await setAuthCookie(access_token)

  return { message: "Login was successful", data: user }
}

export const logout = async () => {
  await destroyAuthCookie()
}

export const signup = async (newUser: TSignUpDto) => {

  const validation = await validate(signUpDto, newUser)


  if (validation?.errors) {
    return { error: validation.errors, data: null }
  }

  const { confirmPassword, ...normalizeUser } = newUser
  normalizeUser.password = confirmPassword
  normalizeUser.password = await hashPassword(normalizeUser.password)
  const { data, error } = await safe(prisma.user.create({ data: normalizeUser }))

  if (error) {
    // unwrap common Prisma unique constraint error into friendly message
    const err: any = error
    if (err?.code === 'P2002') {
      return { error: 'Email already in use', data: null }
    }

    return { error, data: null }
  }

  return { data, error: null }
}