import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/booking";
import { getSiteUrl } from "@/lib/site-url";
import { IconCheck, IconMapPin, IconStar, IconTag, IconUsers } from "@/components/icons";

// La portada muestra ajustes, fotos y detalles editables desde el panel de
// administración: hay que renderizarla en cada visita, nunca cachearla como
// página estática, o los cambios guardados no se verían hasta el próximo
// despliegue de código.
export const dynamic = "force-dynamic";

const DEFAULT_HERO_TITLE = "Céntrico. Cómodo. Para hasta 6.";
const DEFAULT_HERO_SUBTITLE =
  "Apartamento en el centro de Santillana del Mar, con dos habitaciones, dos baños y todo lo necesario para estar bien. Buena base para recorrer Cantabria sin complicarte.";
const DEFAULT_ABOUT_TEXT =
  "Entre Vigas es un apartamento recién reformado en pleno casco histórico de Santillana del Mar. Vigas de madera originales, luz natural y todos los detalles pensados para que te sientas como en casa desde el primer momento.\n\nUn lugar ideal para desconectar, perderte por las calles empedradas del pueblo y usarlo como punto de partida para descubrir Santander, las playas de Suances o las Cuevas de Altamira.\n\nCapacidad para 6 personas, totalmente equipado, con Wifi y todo lo necesario para una estancia tranquila y sin complicaciones.";
const FALLBACK_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Entre Vigas, Av. Antonio Sandi 1, Santillana del Mar, Cantabria");

const DEFAULT_AMENITY_LABELS = [
  "2 dormitorios",
  "2 camas de 1,05 m, 1 cama de 1,50 m y sofá cama de 1,30 m",
  "2 baños: uno con ducha y otro de aseo (sin ducha)",
  "Balcón con vistas a la carretera general",
  "Wifi de alta velocidad",
  "Cocina totalmente equipada",
  "Lavadora",
  "Calefacción en toda la casa",
  "Parking propio",
];

const DEFAULT_FAQ_ITEMS = [
  {
    question: "¿Cómo se confirma la reserva?",
    answer:
      "Al enviar el formulario, esas fechas quedan bloqueadas provisionalmente en el calendario para que nadie más pueda reservarlas. Te contactamos enseguida por email o teléfono para confirmar los detalles.",
  },
  {
    question: "¿Hace falta pagar con tarjeta en la web?",
    answer:
      "No. La web no pide ningún dato de pago: coordinamos el pago contigo directamente al confirmar tu solicitud.",
  },
  {
    question: "¿Hay parking?",
    answer: "Sí, el apartamento cuenta con parking propio.",
  },
  {
    question: "¿A qué hora es la entrada y la salida?",
    answer:
      "La entrada (check-in) es a partir de las 15:00 y la salida (check-out) hasta las 12:00. Si necesitas otro horario, escríbenos y lo vemos según disponibilidad.",
  },
  {
    question: "¿Se admiten mascotas?",
    answer: "No, el apartamento no admite mascotas.",
  },
  {
    question: "¿Cuál es la política de cancelación?",
    answer:
      "Puedes cancelar sin coste hasta 14 días antes de la fecha de entrada. Pasado ese plazo, se cobrará el importe de la fianza en concepto de cancelación.",
  },
  {
    question: "¿Hay que pagar una fianza?",
    answer:
      "Sí, una fianza de 100€. Se paga por adelantado mediante Bizum una vez confirmada la reserva, y se devuelve íntegra al finalizar la estancia si todo está en orden.",
  },
];

const fallbackGallery = [
  { src: "/gallery/salon-sofa.jpg", alt: "Salón con sofá y vigas de madera a la vista" },
  { src: "/gallery/comedor.jpg", alt: "Mesa de comedor para seis" },
  { src: "/gallery/salon.jpg", alt: "Salón comedor con vigas de madera a la vista" },
  { src: "/gallery/fachada.jpg", alt: "Fachada del edificio en el casco histórico" },
  { src: "/gallery/dormitorio-principal-ventana.jpg", alt: "Dormitorio principal con vistas y baño en suite" },
  { src: "/gallery/dormitorio-principal.jpg", alt: "Dormitorio principal" },
  { src: "/gallery/dormitorio-principal-armario.jpg", alt: "Dormitorio principal, armario empotrado" },
  { src: "/gallery/dormitorio-vigas.jpg", alt: "Segundo dormitorio, bajo las vigas originales" },
  { src: "/gallery/bano.jpg", alt: "Baño con ducha" },
  { src: "/gallery/cocina.jpg", alt: "Cocina con vistas al parque de Santillana" },
  { src: "/gallery/cocina-electrodomesticos.jpg", alt: "Cocina totalmente equipada" },
  { src: "/gallery/balcon.jpg", alt: "Balcón con vistas al jardín" },
  { src: "/gallery/placa.jpg", alt: "Placa oficial de vivienda vacacional" },
];

export default async function Home() {
  const [settings, heroPhoto, galleryPhotos, dbAmenities, dbFaqItems] = await Promise.all([
    getSettings(),
    prisma.photo.findFirst({
      where: { section: "hero" },
      orderBy: { order: "asc" },
      select: { id: true, alt: true },
    }),
    prisma.photo.findMany({
      where: { section: "galeria" },
      orderBy: { order: "asc" },
      select: { id: true, alt: true },
    }),
    prisma.amenity.findMany({ orderBy: { order: "asc" }, select: { id: true, label: true } }),
    prisma.faqItem.findMany({
      orderBy: { order: "asc" },
      select: { id: true, question: true, answer: true },
    }),
  ]);

  const mapsUrl = settings.googleMapsUrl || FALLBACK_MAPS_URL;
  const heroTitle = settings.heroTitle || DEFAULT_HERO_TITLE;
  const heroSubtitle = settings.heroSubtitle || DEFAULT_HERO_SUBTITLE;
  const aboutText = settings.aboutText || DEFAULT_ABOUT_TEXT;
  const heroImageSrc = heroPhoto ? `/api/photos/${heroPhoto.id}` : "/gallery/hero.jpg";
  const heroImageAlt =
    heroPhoto?.alt ||
    "Salón del apartamento Entre Vigas, con la viga de roble original a la vista";

  // Las fotos y los detalles subidos desde el panel se añaden a los que ya
  // hay por defecto, no los sustituyen — así subir una foto nunca hace
  // desaparecer el resto de la galería.
  const gallery = [
    ...fallbackGallery,
    ...galleryPhotos.map((p) => ({ src: `/api/photos/${p.id}`, alt: p.alt || "Entre Vigas" })),
  ];

  const amenityLabels = [...DEFAULT_AMENITY_LABELS, ...dbAmenities.map((a) => a.label)];

  // El propio propietario puede añadir más preguntas desde el panel, que se
  // suman a estas de partida.
  const faqItems = [...DEFAULT_FAQ_ITEMS, ...dbFaqItems];

  const siteUrl = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Entre Vigas",
    description: heroSubtitle,
    image: `${siteUrl}${heroImageSrc}`,
    url: siteUrl,
    telephone: settings.contactPhone,
    email: settings.contactEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Antonio Sandi, 1",
      addressLocality: "Santillana del Mar",
      addressRegion: "Cantabria",
      postalCode: "39330",
      addressCountry: "ES",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 43.3897,
      longitude: -4.1113,
    },
    amenityFeature: amenityLabels.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <main className="flex-1">
        {/* HERO */}
        <section className="bg-linen relative overflow-hidden border-b border-stone-200">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-terracotta-500/30 bg-terracotta-500/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-terracotta-600 uppercase">
                <IconMapPin className="h-3.5 w-3.5" />
                Santillana del Mar, Cantabria
              </p>
              <h1 className="mt-6 font-display text-4xl leading-[1.1] text-stone-900 sm:text-5xl lg:text-6xl">
                {heroTitle}
              </h1>
              <p className="mt-6 max-w-xl text-lg whitespace-pre-line text-stone-700">
                {heroSubtitle}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#reservar"
                  className="rounded-full bg-terracotta-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-terracotta-500/20 transition hover:bg-terracotta-600"
                >
                  Comprobar disponibilidad
                </a>
                <a
                  href="#apartamento"
                  className="rounded-full border border-stone-300 px-7 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-100"
                >
                  Ver el apartamento
                </a>
              </div>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-stone-200 shadow-2xl">
              <Image
                src={heroImageSrc}
                alt={heroImageAlt}
                fill
                priority
                unoptimized={heroImageSrc.startsWith("/api/")}
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* ABOUT + AMENITIES */}
        <section id="apartamento" className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-terracotta-600 uppercase">
                El apartamento
              </p>
              <h2 className="mt-3 font-display text-3xl text-stone-900 sm:text-4xl">
                Cómodo, práctico y bien equipado
              </h2>
              {aboutText.split("\n\n").map((paragraph, i) => (
                <p key={i} className="mt-4 whitespace-pre-line text-stone-700 first:mt-5">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white/70 px-4 py-3.5">
                <IconUsers className="h-5 w-5 shrink-0 text-terracotta-600" />
                <span className="text-sm text-stone-800">Hasta {settings.maxGuests} huéspedes</span>
              </div>
              {amenityLabels.map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white/70 px-4 py-3.5"
                >
                  <IconCheck className="h-5 w-5 shrink-0 text-terracotta-600" />
                  <span className="text-sm text-stone-800">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section id="galeria" className="border-y border-stone-200 bg-stone-50 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-terracotta-600 uppercase">
              Galería
            </p>
            <h2 className="mt-3 font-display text-3xl text-stone-900 sm:text-4xl">
              Cada rincón cuenta una historia
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {gallery.map((photo, i) => (
                <div
                  key={photo.src}
                  className={`group relative overflow-hidden rounded-2xl border border-stone-200 ${
                    i === 0 ? "col-span-2 aspect-[16/10] sm:col-span-2" : "aspect-square"
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    unoptimized={photo.src.startsWith("/api/")}
                    sizes={i === 0 ? "(min-width: 640px) 66vw, 100vw" : "(min-width: 640px) 33vw, 50vw"}
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-xs font-medium text-white">{photo.alt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOOKING */}
        <section id="reservar" className="mx-auto max-w-6xl px-5 py-20">
          <p className="text-xs font-semibold tracking-[0.2em] text-terracotta-600 uppercase">
            Reserva directa
          </p>
          <h2 className="mt-3 font-display text-3xl text-stone-900 sm:text-4xl">
            Precios y disponibilidad
          </h2>
          <p className="mt-4 max-w-2xl text-stone-700">
            Consulta el calendario en tiempo real: las fechas ya reservadas
            se bloquean automáticamente en cuanto se confirman, para que
            nunca coincidan dos huéspedes.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white/70 p-4">
              <IconTag className="h-5 w-5 shrink-0 text-terracotta-600" />
              <div>
                <p className="text-sm font-semibold text-stone-900">Sin comisiones</p>
                <p className="mt-0.5 text-xs text-stone-600">
                  Reservando aquí, no pagas de más por intermediarios.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white/70 p-4">
              <IconCheck className="h-5 w-5 shrink-0 text-terracotta-600" />
              <div>
                <p className="text-sm font-semibold text-stone-900">Fechas siempre reales</p>
                <p className="mt-0.5 text-xs text-stone-600">
                  El calendario se bloquea al instante, también si reservas por Booking.com.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white/70 p-4">
              <IconStar className="h-5 w-5 shrink-0 text-terracotta-600" />
              <div>
                <p className="text-sm font-semibold text-stone-900">Trato directo</p>
                <p className="mt-0.5 text-xs text-stone-600">
                  Hablas con nosotros, sin centralitas ni bots.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <BookingWidget maxGuests={settings.maxGuests} />
          </div>
        </section>

        {/* LOCATION */}
        <section id="ubicacion" className="border-t border-stone-200 bg-stone-50 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-terracotta-600 uppercase">
                Ubicación
              </p>
              <h2 className="mt-3 font-display text-3xl text-stone-900 sm:text-4xl">
                Fácil de encontrar, fácil de recorrer
              </h2>
              <p className="mt-5 text-stone-700">
                Santillana del Mar se recorre a pie en pocos minutos. Deja el
                coche aparcado y muévete caminando durante toda la estancia.
              </p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-terracotta-600"
              >
                <IconMapPin className="h-4 w-4 shrink-0" />
                Av. Antonio Sandi, 1 · Santillana del Mar, Cantabria
              </a>
              {settings.licenseNumber && (
                <p className="mt-2 text-sm font-medium text-stone-500">
                  Vivienda de uso turístico · nº {settings.licenseNumber}
                </p>
              )}
              <ul className="mt-6 space-y-3 text-sm text-stone-700">
                <li>🚗 5 min de las Cuevas de Altamira</li>
                <li>🚗 25 min de Santander y su aeropuerto</li>
                <li>🚗 30 min de Comillas y San Vicente de la Barquera</li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  Ver en Google Maps →
                </a>
                <Link
                  href="/guia"
                  className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-800 transition hover:bg-white"
                >
                  Ver la guía completa de la zona →
                </Link>
              </div>
              {settings.googleReviewUrl && (
                <a
                  href={settings.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-terracotta-600 hover:text-terracotta-700"
                >
                  <IconStar className="h-4 w-4" />
                  ¿Ya te has alojado con nosotros? Déjanos tu opinión en Google →
                </a>
              )}
            </div>
            <div className="overflow-hidden rounded-2xl border border-stone-200 shadow-lg">
              <iframe
                title="Mapa de Santillana del Mar"
                className="h-[380px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-4.1230%2C43.3840%2C-4.0990%2C43.3960&layer=mapnik&marker=43.3897%2C-4.1113"
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-6xl px-5 py-20">
          <p className="text-xs font-semibold tracking-[0.2em] text-terracotta-600 uppercase">
            Antes de reservar
          </p>
          <h2 className="mt-3 font-display text-3xl text-stone-900 sm:text-4xl">
            Preguntas frecuentes
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {faqItems.map((item) => (
              <div
                key={item.question}
                className="rounded-2xl border border-stone-200 bg-white/70 p-5"
              >
                <p className="font-display text-base text-stone-900">{item.question}</p>
                <p className="mt-2 text-sm text-stone-700">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
