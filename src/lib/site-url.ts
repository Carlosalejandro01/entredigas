// Dominio público del sitio: usa NEXT_PUBLIC_SITE_URL si lo has configurado
// (por ejemplo, tras comprar un dominio propio), si no usa el dominio de
// producción o de este despliegue que Vercel expone automáticamente.
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd) return `https://${vercelProd}`;

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}
