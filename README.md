# Entre Vigas — web de reservas

Web de reserva directa para el apartamento **Entre Vigas** en Santillana
del Mar. Construida con Next.js (App Router), Prisma + SQLite y Tailwind
CSS. Los clientes reservan desde la web, y en cuanto una reserva se crea
esas fechas quedan bloqueadas automáticamente para que nadie más pueda
solicitarlas.

## Puesta en marcha

```bash
npm install
cp .env.example .env   # y cambia ADMIN_PASSWORD por una clave segura
npx prisma migrate dev
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura

- `src/app/page.tsx` — página principal (hero, apartamento, galería,
  reservas, ubicación).
- `src/components/BookingWidget.tsx` — calendario y formulario de reserva
  (cliente).
- `src/app/admin` — panel privado del propietario (`/admin`), protegido
  por `ADMIN_PASSWORD`.
- `src/app/api/*` — endpoints: disponibilidad, creación de reservas y
  gestión de administración (reservas, precios, bloqueos manuales).
- `prisma/schema.prisma` — modelos `Booking`, `BlockedRange` y `Settings`.

## Cómo se evita el doble reserva

Cada reserva se crea dentro de una transacción que vuelve a comprobar,
justo antes de guardar, que las fechas elegidas no se solapan con
ninguna reserva `pending`/`confirmed` ni con ningún bloqueo manual. El
calendario público (`/api/availability`) también deshabilita esas fechas
para que no se puedan ni seleccionar.

## Panel del propietario (`/admin`)

Accede con la contraseña de `ADMIN_PASSWORD`. Desde ahí puedes:

- Ver todas las reservas, confirmarlas, cancelarlas o eliminarlas.
- Bloquear manualmente fechas (mantenimiento, uso propio, reservas por
  teléfono, etc.).
- Cambiar el precio por noche, la tasa de limpieza, la estancia mínima y
  los datos de contacto.

## Añadir fotos reales

Las secciones "Hero" y "Galería" de `src/app/page.tsx` usan bloques de
marcador de posición. Sustitúyelos por imágenes reales:

1. Copia tus fotos a `public/gallery/`.
2. Cambia los `div` de marcador por `<Image src="/gallery/tu-foto.jpg" .../>`
   usando `next/image`.

## Despliegue en producción

- **Base de datos**: por defecto se usa SQLite (`prisma/dev.db`), que
  funciona bien en un servidor con disco persistente (VPS, Railway,
  Render). Si despliegas en una plataforma *serverless* sin disco
  persistente (por ejemplo Vercel), cambia el `datasource` de
  `prisma/schema.prisma` a Postgres (Vercel Postgres, Neon, Supabase o
  Turso) y ejecuta `npx prisma migrate deploy`.
- **Variables de entorno**: define `DATABASE_URL` y `ADMIN_PASSWORD` en
  la plataforma de despliegue.
- **Notificaciones**: ahora mismo las reservas nuevas solo se ven en
  `/admin`. Si quieres recibir un email o WhatsApp automático por cada
  reserva, se puede añadir un envío (por ejemplo con Resend) en
  `src/app/api/bookings/route.ts`.
