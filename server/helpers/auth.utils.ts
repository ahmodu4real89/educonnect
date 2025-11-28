import { PAGINATION, SERVER_MESSAGES } from "@/common/constants";
import { safe } from "@/common/lib";
import { TRequestQuery, TRole } from "@/common/types";
import { User } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { handleDBError } from "./db.utils";
import { message } from "antd";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET! || 'dihfiodhfoafh4dfhdfhdsofhdsfhdsfodsfdsfdf');

export interface UserPayload extends JWTPayload {
  userId: string;
  role: TRole;
  level: string;
}

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword);
}

export async function createSessionToken(payload: UserPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as UserPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  (await cookies()).set('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function destroyAuthCookie(): Promise<void> {
  (await cookies()).delete('access_token');
}

export async function getCurrentUserFromToken(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) return null;

  return await verifySessionToken(token);
}


export const withRole = async <RC>(role: TRole[], def:{action: () => Promise<RC>,  successMessage: string, meta?: TRequestQuery}) => {

  const {action, successMessage, meta} = def

  const user = await getCurrentUserFromToken()

  if(!user){
    return {message: SERVER_MESSAGES.UNAUTHORIZED}
  }

  if (!(user.role && role.includes(user.role))) {
    return { message: SERVER_MESSAGES.UNAUTHORIZED, data: undefined, error: undefined, meta: undefined, success: false }
  }

  const {error, data} = await safe<RC>(action())

  return {
    message: error ? handleDBError(error): successMessage,
    error: null,
    data,
    meta
  }
}

export const hasRole = async (role: TRole[]) => {
   const user = await getCurrentUserFromToken()

  if(!user){
    return {error: SERVER_MESSAGES.UNAUTHORIZED, status: false, user}
  }

  if (!(user.role && role.includes(user.role))) {
    return { error: SERVER_MESSAGES.UNAUTHORIZED, status: false, user }
  }

  return {status: true, message: undefined, user, error: null}
}