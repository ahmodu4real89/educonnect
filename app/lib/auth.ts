// lib/auth.ts
import { betterAuth } from "better-auth";
import { openAPI } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession } from 'better-auth/plugins';

import prisma from "./prisma";
const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    siteUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // set to true in production
    },
    plugins: [
        customSession(async ({ user, session }) => {
            // const userId = session.userId
            // console.log("userId", userId)
            // const roles = await prisma.user.findFirst({where: {id:userId}});
            const result = {
                // roles,
                user: {
                    ...user,
                },
                session
            };
            // console.log(result, "custome sesstion data")
            return result
        }),
        openAPI(),
    ],
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 24 hours
    },
    advanced: { disableOriginCheck: true },
    secret: process.env.BETTER_AUTH_SECRET!,
    // Optional: Add additional configuration
    trustHost: true,
    trustedOrigins: [baseUrl],
    cors: {
        origin: [baseUrl],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization", "Origin"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    },

    // Additional security settings
    csrf: {
        enabled: process.env.NODE_ENV === "production",
    },
    user: {
        // Define which fields are required
        additionalFields: {
            phoneNumber: {
                type: "string",
                required: false, // phoneNumber is optional
            },
            level: {
                type: "string",
                required: true, // phoneNumber is optional
                returned: true
            },
            gender: {
                type: "string",
                required: true,
            },
            role: {
                type: "string",
                input: true,
                returned: true
            }
        },

    },


});

// export type Session = typeof auth.$Infer.Session;
// export type User = typeof auth.$Infer.User;

