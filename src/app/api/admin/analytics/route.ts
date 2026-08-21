import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

function isoDaysAgo(days: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const since = isoDaysAgo(30);
  const [daily, totalAgg] = await Promise.all([
    prisma.pageView.findMany({
      where: { date: { gte: since } },
      orderBy: { date: "asc" },
    }),
    prisma.pageView.aggregate({ _sum: { count: true } }),
  ]);

  const byDate = new Map(daily.map((d) => [d.date, d.count]));
  const today = isoDaysAgo(0);
  const last7Start = isoDaysAgo(6);
  const last30Start = isoDaysAgo(29);

  let last7 = 0;
  let last30 = 0;
  for (const [date, count] of byDate) {
    if (date >= last7Start) last7 += count;
    if (date >= last30Start) last30 += count;
  }

  return NextResponse.json({
    total: totalAgg._sum.count ?? 0,
    today: byDate.get(today) ?? 0,
    last7,
    last30,
    daily: daily.map((d) => ({ date: d.date, count: d.count })),
  });
}
