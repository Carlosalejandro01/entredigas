import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB, margen bajo el límite de Vercel
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "image/jpeg",
  "image/jpg": "image/jpeg",
  "image/png": "image/png",
  "image/webp": "image/webp",
};
const EXTENSION_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

// Detecta el tipo real de la imagen. Muchos navegadores móviles envían un
// Content-Type vacío o genérico ("application/octet-stream"), así que si el
// tipo declarado no nos vale, probamos con la extensión del nombre de archivo.
function resolveMimeType(file: File): string | null {
  if (ALLOWED_TYPES[file.type]) return ALLOWED_TYPES[file.type];
  const ext = file.name.split(".").pop()?.toLowerCase();
  return (ext && EXTENSION_TYPES[ext]) || null;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const photos = await prisma.photo.findMany({
    select: { id: true, alt: true, section: true, order: true, createdAt: true },
    orderBy: [{ section: "asc" }, { order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ photos });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const section = form?.get("section");
  const alt = form?.get("alt");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo de imagen." }, { status: 400 });
  }
  const mimeType = resolveMimeType(file);
  if (!mimeType) {
    const isHeic = /\.heic$/i.test(file.name) || file.type === "image/heic";
    return NextResponse.json(
      {
        error: isHeic
          ? "Esta foto está en formato HEIC (típico de iPhone) y no se puede subir así. En el iPhone: Ajustes → Cámara → Formatos → elige \"Más compatible\" para que las fotos nuevas se guarden en JPG, o al enviarte la foto elige \"Más compatible\" al compartirla."
          : "Formato no admitido. Usa una foto en JPG, PNG o WEBP.",
      },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "La imagen pesa demasiado (máximo 4 MB)." },
      { status: 400 }
    );
  }

  const sectionValue = section === "hero" ? "hero" : "galeria";
  const maxOrder = await prisma.photo.aggregate({
    where: { section: sectionValue },
    _max: { order: true },
  });

  const buffer = Buffer.from(await file.arrayBuffer());
  const photo = await prisma.photo.create({
    data: {
      data: buffer,
      mimeType,
      alt: typeof alt === "string" ? alt.slice(0, 200) : "",
      section: sectionValue,
      order: (maxOrder._max.order ?? -1) + 1,
    },
    select: { id: true, alt: true, section: true, order: true },
  });

  return NextResponse.json({ photo }, { status: 201 });
}

const deleteSchema = z.object({ id: z.string().min(1) });

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const parsed = deleteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos." }, { status: 400 });
  }
  await prisma.photo.delete({ where: { id: parsed.data.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}

const patchSchema = z.object({
  id: z.string().min(1),
  alt: z.string().max(200).optional(),
  order: z.number().int().optional(),
});

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos." }, { status: 400 });
  }
  const { id, ...data } = parsed.data;
  const photo = await prisma.photo.update({
    where: { id },
    data,
    select: { id: true, alt: true, section: true, order: true },
  });
  return NextResponse.json({ photo });
}
