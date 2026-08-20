import { prisma } from "@/lib/prisma";

// Límite de peticiones sencillo basado en base de datos (sin servicios
// externos): cuenta cuántos eventos ha habido para una clave (p. ej.
// "login:<ip>") en la ventana de tiempo dada, y por el camino borra los
// eventos ya caducados de esa misma clave para no acumular filas sin fin.
export async function checkRateLimit(
  key: string,
  maxEvents: number,
  windowMs: number
): Promise<boolean> {
  const since = new Date(Date.now() - windowMs);
  await prisma.rateLimitEvent.deleteMany({ where: { key, createdAt: { lt: since } } });
  const count = await prisma.rateLimitEvent.count({ where: { key } });
  if (count >= maxEvents) return false;
  await prisma.rateLimitEvent.create({ data: { key } });
  return true;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
