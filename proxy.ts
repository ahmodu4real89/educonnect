// middleware.js (JavaScript instead of TypeScript)
import { NextRequest, NextResponse } from "next/server";
import { isUserAuthenticated, response } from "./app/lib/helpers";


const whiteListedEndpoint = ['/auth/sign-in/email', '/auth/sign-out', '/auth/sign-up/email', '/docs']

export async function proxy(request: NextRequest) {

     const userSession = await isUserAuthenticated(request)
    const routePath = request.url.split('/api')[1]

    if (!userSession) {
         if(!whiteListedEndpoint.includes(routePath) && request.url.includes('/api')){
            return response.unAuthenticated()
        }
    }

    if(!request.url.includes('/api') && !userSession){
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/api/:path*", '/lecturer', '/student'],
};