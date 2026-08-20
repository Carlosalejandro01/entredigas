# Publicar Entre Vigas en internet — guía muy detallada

Vas a hacer 4 cosas, en este orden: **(0)** aprobar el código, **(1)**
crear una base de datos gratis, **(2)** publicar la web gratis, **(3)**
conectar Booking.com. Ninguna requiere saber programar. Tiempo total:
10-15 minutos. Todo lo que necesitas crear es gratis.

---

## Paso 0 — Aprobar el código (fusionar el Pull Request)

Todo lo que he programado está guardado en una "rama" separada,
esperando tu aprobación antes de pasar a ser la versión oficial.

1. Abre este enlace: **https://github.com/Carlosalejandro01/entredigas/pull/1**
2. Baja hasta el final de la página. Verás un botón verde que dice
   **"Merge pull request"**. Púlsalo.
3. Aparece un segundo botón, **"Confirm merge"**. Púlsalo también.
4. Ya está — verás un mensaje morado de "Pull request successfully
   merged". No hace falta hacer nada más aquí.

---

## Paso 1 — Crear la base de datos (Neon, gratis)

Es donde se guardarán tus reservas, precios, etc.

1. Abre **https://neon.tech** en una pestaña nueva.
2. Pulsa **"Sign up"** (o "Get started") arriba a la derecha.
3. Elige **"Continue with GitHub"** e inicia sesión con tu cuenta de
   GitHub (la misma con la que tienes el repositorio `entredigas`).
   Te pedirá autorizar el acceso — acepta.
4. Te pedirá crear tu primer proyecto:
   - **Project name**: pon `entrevigas` (o lo que quieras, es solo
     una etiqueta para ti).
   - **Postgres version**: déjalo con el valor que venga por
     defecto.
   - **Region**: si te deja elegir, escoge una de Europa (por
     ejemplo "Europe (Frankfurt)") — así irá más rápido.
   - Pulsa **"Create project"**.
5. En unos segundos verás la pantalla del proyecto con un recuadro
   que pone **"Connection string"**, con un texto que empieza por
   `postgresql://...` y un botón para copiarlo (icono de dos
   cuadraditos).
   - Si ves un interruptor o enlace que dice **"Pooled connection"**,
     **desactívalo** (queremos la versión sin `-pooler` en la
     dirección). Si no lo ves, no pasa nada, sigue con la que te dé.
6. **Pulsa el botón de copiar** y guarda ese texto en algún sitio a
   mano (una nota, un email a ti mismo) — es largo y lo vas a
   necesitar en el Paso 2. Si más adelante lo pierdes, siempre puedes
   volver a Neon → tu proyecto → botón **"Connect"** para verlo de
   nuevo.

---

## Paso 2 — Publicar la web (Vercel, gratis)

1. Abre **https://vercel.com** en una pestaña nueva.
2. Pulsa **"Sign Up"**.
3. Elige **"Continue with GitHub"** e inicia sesión con la misma
   cuenta de GitHub. Autoriza el acceso cuando te lo pida.
4. Es posible que te pregunte qué tipo de cuenta quieres — elige la
   opción personal/gratuita ("Hobby").
5. Una vez dentro, pulsa **"Add New..."** (arriba a la derecha) →
   **"Project"**.
6. Verás una lista de tus repositorios de GitHub. Busca
   **`entredigas`**.
   - **Si no aparece en la lista**: pulsa el enlace
     **"Adjust GitHub App Permissions"** (o "Configure GitHub App"),
     te lleva a GitHub, elige **"Only select repositories"**, marca
     `entredigas` en la lista, y guarda. Vuelve a la pestaña de
     Vercel y ahora sí debería aparecer.
7. Junto a `entredigas`, pulsa **"Import"**.
8. Vercel detecta automáticamente que es un proyecto Next.js — no
   toques nada de "Build and Output Settings", ya está todo
   configurado en el proyecto.
9. Antes de darle a publicar, despliega la sección
   **"Environment Variables"** (pulsa sobre el título para que se
   abra). Vas a añadir dos variables, una por una — escribe el
   nombre, pega/escribe el valor, comprueba que las tres casillas
   **Production / Preview / Development** queden marcadas (suelen
   venir así por defecto), y pulsa **"Add"** antes de pasar a la
   siguiente:

   | Key (Name) | Value |
   |---|---|
   | `DATABASE_URL` | la cadena `postgresql://...` que copiaste de Neon en el Paso 1 |
   | `ADMIN_PASSWORD` | una contraseña que tú elijas para entrar al panel de administración (apúntala, la necesitarás en el Paso 3) |

   Antes de continuar, revisa que en el campo `DATABASE_URL` no se
   haya colado ninguna comilla (`"`) ni un espacio al principio o al
   final — a veces pasa al copiar y pegar.

10. Pulsa el botón azul **"Deploy"**.
11. Vercel se pone a trabajar: instala el proyecto, prepara la base
    de datos y publica la web. Verás una pantalla con el progreso —
    tarda entre 1 y 3 minutos. No cierres la pestaña.
12. Cuando termine, verás confeti en pantalla y un botón
    **"Continue to Dashboard"** o una vista previa de tu web. Arriba
    verás la URL de tu proyecto, algo como
    `https://entredigas.vercel.app` (Vercel a veces le añade
    números si el nombre ya existe, tipo `entredigas-abc123.vercel.app`
    — no pasa nada, esa es tu URL igualmente).

**Esa URL ya es tu web, publicada y visible para cualquiera.** Ábrela
en una pestaña nueva y échale un vistazo.

### Si el despliegue te dio "Build Failed"

Si ya tienes un proyecto en Vercel con el error "Build Failed",
arréglalo así sin tener que volver a crear nada:

1. En tu proyecto de Vercel, ve a **Settings** → **Environment
   Variables**.
2. Si ves una variable llamada `DIRECT_URL`, puedes borrarla — ya no
   hace falta (papelera al lado de la fila).
3. Comprueba que están estas dos: `DATABASE_URL` y `ADMIN_PASSWORD`,
   y que `DATABASE_URL` no tiene comillas ni espacios de más al
   copiarla.
4. Ve a la pestaña **Deployments**, abre el desplegado más reciente
   (el que falló), pulsa el menú **"..."** de arriba a la derecha →
   **"Redeploy"** → confirma.
5. Espera 1-2 minutos y comprueba que esta vez pone **"Ready"** en
   verde en vez de "Error". Si vuelve a fallar, copia el texto de
   las líneas rojas de "Build Logs" y mándamelo tal cual.

---

## Paso 3 — Conectar Booking.com

1. En tu web publicada, ve a `/admin` (por ejemplo
   `https://entredigas.vercel.app/admin`).
2. Escribe la contraseña que pusiste como `ADMIN_PASSWORD` en el
   Paso 2 → **"Acceder"**.
3. Arriba, pulsa la pestaña **"Booking.com / iCal"**.
4. En el primer recuadro ("1. Exporta tu calendario a Booking.com")
   verás un enlace largo con un botón **"Copiar"**. Púlsalo.
5. Ve a Booking.com Extranet (donde gestionas tu propiedad) →
   *Tarifas y disponibilidad* → *Sincronizar calendarios* → busca la
   opción para **importar** un calendario externo, y pega ahí el
   enlace que acabas de copiar.
6. En esa misma sección de Booking.com verás una opción para
   **exportar** su calendario — copia ese enlace (empieza por
   `https://ical.booking.com/...`).
7. Vuelve a la pestaña "Booking.com / iCal" de tu web, en el segundo
   recuadro ("2. Importa el calendario de Booking.com"):
   - En el primer campo escribe `Booking.com`.
   - En el segundo campo pega el enlace que acabas de copiar de
     Booking.com.
   - Pulsa **"Conectar"**.
8. En un momento verás el calendario listado con la fecha de la
   última sincronización.

A partir de aquí: una reserva en tu web bloquea esas fechas en
Booking.com, y una reserva en Booking.com bloquea esas fechas en tu
web (se revisa sola cada 30 minutos, o pulsa "Sincronizar ahora"
cuando quieras forzarlo).

---

## Ya está publicada. ¿Y ahora qué?

- **Cambiar precios, tasa de limpieza o estancia mínima**: `/admin` →
  pestaña "Precios y ajustes".
- **Cerrar fechas a mano** (mantenimiento, uso propio...): `/admin` →
  pestaña "Bloqueos manuales".
- **Ver y confirmar reservas**: `/admin` → pestaña "Reservas".
- **Cambiar fotos**: mándamelas por este chat y las subo yo.
- **Poner un dominio propio** (por ejemplo `entrevigas.es` en vez de
  `...vercel.app`): compra el dominio donde quieras (Namecheap, la
  propia Vercel, etc.), luego en Vercel → tu proyecto → *Settings* →
  *Domains* → escribe el dominio y sigue las instrucciones de DNS
  que te da Vercel.
- **Cualquier cambio futuro en la web**: pídemelo en este chat. Yo
  hago el cambio y lo subo a GitHub — Vercel detecta el cambio y
  vuelve a publicar la web solo, en 1-2 minutos, sin que tengas que
  repetir nada de esta guía.

Si algo no te aparece exactamente igual que aquí (Vercel y Neon
cambian el diseño de vez en cuando) o te atascas en cualquier paso,
dime en qué pantalla estás y seguimos desde ahí.
