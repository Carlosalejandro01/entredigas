import { NextResponse } from "next/server";
import { z } from "zod";
import { checkPassword, createSessionToken, COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

const schema = z.object({ password: z.string().min(1) });

export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "El panel de administración no está configurado (ADMIN_PASSWORD)." },
      { status: 500 }
    );
  }

  const allowed = await checkRateLimit(`login:${clientIp(request)}`, 8, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera unos minutos y vuelve a intentarlo." },
      { status: 429 }
    );
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Contraseña requerida." }, { status: 400 });
  }

  if (!checkPassword(parsed.data.password)) {
    return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return response;
}
