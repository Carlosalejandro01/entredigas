import { prisma } from "@/lib/prisma";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

// Suma una visita al contador del día. No guarda IP, cookies ni ningún
// dato personal — solo un número agregado por fecha. Si falla, no debe
// romper el render de la página, así que nunca lanza.
export async function trackPageView() {
  try {
    const date = todayIso();
    await prisma.pageView.upsert({
      where: { date },
      update: { count: { increment: 1 } },
      create: { date, count: 1 },
    });
  } catch {
    // silencioso: una visita no registrada no debe afectar a la web
  }
}
