import { NextResponse } from "next/server";
import { signup } from "@/server/actions/auth.actions";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data, error } = await signup(body);

    if (error) {
      // Handle Prisma unique constraint (duplicate email) nicely
      const err = error as any
      if (err?.code === 'P2002') {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
      }

      // If validation returned a structured errors object, send it under
      // the `errors` key so the client can display per-field messages.
      if (typeof error === 'object') {
        return NextResponse.json({ errors: error }, { status: 400 })
      }

  const message = typeof error === 'string' ? error : JSON.stringify(error);
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ data, message: 'User created' }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
