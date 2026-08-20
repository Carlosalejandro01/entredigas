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
- `src/app/api/*` — endpoints: disponibilidad, creación de reservas,
  gestión de administración (reservas, precios, bloqueos manuales) y
  sincronización de calendario iCal con Booking.com.
- `prisma/schema.prisma` — modelos `Booking`, `BlockedRange`,
  `ExternalCalendar` y `Settings`.

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

## Sincronización con Booking.com (iCal)

Desde `/admin` → pestaña **"Booking.com / iCal"**:

1. **Exportar hacia Booking.com**: copia el enlace de exportación que
   te da la web y pégalo en Booking.com Extranet → *Tarifas y
   disponibilidad* → *Sincronizar calendarios* → importar calendario.
   Así Booking.com bloquea automáticamente las fechas reservadas en tu
   web.
2. **Importar desde Booking.com**: en la misma sección de Booking.com,
   copia su enlace de "Exportar calendario" y pégalo en el formulario
   de esa pestaña. La web sincroniza ese calendario cada 30 minutos
   (y también se puede forzar con "Sincronizar ahora"), y las fechas
   reservadas en Booking.com pasan a bloquearse en el calendario
   público y en las nuevas reservas.

El mismo mecanismo funciona con Airbnb o cualquier otra plataforma que
ofrezca un enlace iCal (`.ics`).

**Limitación a tener en cuenta**: la sincronización por iCal (el
estándar que usan también Airbnb y el propio Booking.com entre
plataformas) no es instantánea — Booking.com solo actualiza su feed
cada pocas horas. Reduce muchísimo el riesgo de doble reserva, pero no
lo elimina al 100 % en el margen de esas horas. Para una garantía
total haría falta un *channel manager* certificado con la API de
Booking.com, que requiere una integración y un acuerdo comercial
aparte.

## Fotos

Las fotos del hero y la galería viven en `public/gallery/` y se
referencian desde `src/app/page.tsx`. Para cambiarlas o añadir más,
copia la imagen a `public/gallery/` y añade/edita la entrada
correspondiente en el array `gallery` (o el `<Image src="/gallery/...">`
del hero) de ese archivo.

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
