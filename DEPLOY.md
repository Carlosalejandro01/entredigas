# Publicar Entre Vigas en internet

Guía paso a paso para tener la web funcionando con una URL real,
gratis, en unos 10-15 minutos. Vas a necesitar: una base de datos
Postgres gratuita (Neon) y un hosting gratuito para la web (Vercel).

## Paso 0 — Fusiona el Pull Request

Todo el código está en una rama separada esperando revisión. Fusiónala
a `main` para que sea la versión "oficial" que se publique:

1. Abre **https://github.com/Carlosalejandro01/entredigas/pull/1**
2. Pulsa **"Merge pull request"** → **"Confirm merge"**

## Paso 1 — Crea la base de datos (Neon, gratis)

1. Ve a **https://neon.tech** y crea una cuenta (puedes entrar
   directamente con tu cuenta de GitHub).
2. Crea un proyecto nuevo. Cualquier nombre y región te sirve (elige
   una región de Europa si te la ofrece, para que vaya más rápido).
3. Cuando se cree, Neon te muestra una **cadena de conexión** que
   empieza por `postgresql://...`. Cópiala entera — la necesitas en
   el paso 3. (Si la pierdes, está siempre disponible en el panel del
   proyecto, botón "Connect".)

## Paso 2 — Crea la web en Vercel (gratis)

1. Ve a **https://vercel.com** y crea una cuenta entrando con tu
   cuenta de GitHub (así Vercel ve tus repositorios automáticamente).
2. Pulsa **"Add New..."** → **"Project"**.
3. Busca y selecciona el repositorio **`entredigas`** → **"Import"**.
4. Antes de pulsar el botón final de desplegar, despliega la sección
   **"Environment Variables"** y añade estas dos:

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | la cadena de conexión de Neon del paso 1 |
   | `ADMIN_PASSWORD` | una contraseña segura para tu panel de administración (apúntala, la necesitarás en `/admin`) |

5. Pulsa **"Deploy"** y espera 1-2 minutos. Vercel instala todo,
   crea las tablas de la base de datos automáticamente y publica la
   web.
6. Cuando termine, Vercel te da una URL del tipo
   `https://entredigas.vercel.app` (o similar) — esa es tu web, ya
   visible para cualquiera. Puedes entrar ahora mismo y probarla.

## Paso 3 — Conecta Booking.com

Ya tienes tu web en `https://tu-web.vercel.app`. Ahora:

1. Entra en `https://tu-web.vercel.app/admin` con la contraseña que
   pusiste en `ADMIN_PASSWORD`.
2. Ve a la pestaña **"Booking.com / iCal"**.
3. Copia el enlace de exportación que te muestra la web y pégalo en
   Booking.com Extranet → *Tarifas y disponibilidad* → *Sincronizar
   calendarios* → sección de importar/exportar de tu propiedad.
4. En esa misma sección de Booking.com, copia el enlace de
   "Exportar calendario" de Booking.com y pégalo en el formulario de
   la pestaña "Booking.com / iCal" de tu web, con el nombre
   "Booking.com" → **"Conectar"**.

Con eso, las reservas de Booking.com bloquean tu web y las reservas de
tu web bloquean Booking.com.

## Después de publicar

- **Precio, limpieza, estancia mínima**: pestaña "Precios y ajustes"
  en `/admin`.
- **Cerrar fechas a mano** (mantenimiento, uso propio...): pestaña
  "Bloqueos manuales" en `/admin`.
- **Fotos**: si quieres cambiarlas, mándamelas por el chat y las
  subo, o edítalas tú directamente en `public/gallery/`.
- **Dominio propio** (por ejemplo `entrevigas.es` en vez de
  `...vercel.app`): en Vercel, el proyecto → *Settings* →
  *Domains* → añade el dominio que compres en cualquier registrador
  (Namecheap, la propia Vercel, etc.) y sigue las instrucciones de
  DNS que te da.
- **Cada vez que quieras un cambio en la web**: dímelo en este chat,
  yo hago el cambio, lo subo a GitHub, y Vercel vuelve a publicar la
  web sola en 1-2 minutos — no hay que repetir estos pasos.
