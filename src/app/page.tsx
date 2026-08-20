import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import {
  IconBed,
  IconFireplace,
  IconKitchen,
  IconMapPin,
  IconUsers,
  IconWasher,
  IconWifi,
} from "@/components/icons";

const amenities = [
  { icon: IconBed, label: "2 dormitorios" },
  { icon: IconUsers, label: "Hasta 4 huéspedes" },
  { icon: IconWifi, label: "Wifi de alta velocidad" },
  { icon: IconKitchen, label: "Cocina totalmente equipada" },
  { icon: IconWasher, label: "Lavadora" },
  { icon: IconFireplace, label: "Calefacción en toda la casa" },
];

const gallery = [
  {
    src: "/gallery/salon.jpg",
    alt: "Salón comedor con vigas de madera a la vista",
    wide: true,
  },
  { src: "/gallery/fachada.jpg", alt: "Fachada de la casona en el casco histórico" },
  { src: "/gallery/dormitorio-vigas.jpg", alt: "Segundo dormitorio, bajo las vigas originales" },
  { src: "/gallery/dormitorio-principal.jpg", alt: "Dormitorio principal" },
  { src: "/gallery/bano.jpg", alt: "Baño con ducha" },
  { src: "/gallery/cocina.jpg", alt: "Cocina con vistas al parque de Santillana" },
  { src: "/gallery/balcon.jpg", alt: "Balcón con vistas al jardín" },
  { src: "/gallery/placa.jpg", alt: "Placa oficial de vivienda vacacional" },
];

export default function Home() {
  return (
    <>
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
                Dormir <span className="italic text-terracotta-600">entre vigas</span>,
                a dos pasos de la Colegiata
              </h1>
              <p className="mt-6 max-w-xl text-lg text-stone-700">
                Apartamento rural íntegramente restaurado en una casona
                montañesa del siglo XVIII, en el corazón del casco histórico
                de &ldquo;el pueblo de las tres mentiras&rdquo;. Piedra, madera
                noble y todas las comodidades para tu escapada a la Costa
                Verde.
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
                src="/gallery/hero.jpg"
                alt="Salón del apartamento Entre Vigas, con la viga de roble original a la vista"
                fill
                priority
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
                Autenticidad montañesa con todas las comodidades
              </h2>
              <p className="mt-5 text-stone-700">
                Entre Vigas ocupa la planta de una antigua casona
                cántabra, con muros de sillería, suelos de madera maciza y
                las vigas originales que le dan nombre. Un espacio de 75 m²
                pensado para dos parejas o una familia, a un minuto a pie de
                la Colegiata de Santa Juliana y de las calles empedradas
                del casco histórico.
              </p>
              <p className="mt-4 text-stone-700">
                Ideal como base para visitar las Cuevas de Altamira, el
                Museo de Altamira, la costa de Comillas y Santander, sin
                renunciar a volver cada noche a un lugar con carácter.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
              {amenities.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white/70 px-4 py-3.5"
                >
                  <Icon className="h-5 w-5 shrink-0 text-terracotta-600" />
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
              {gallery.map((photo) => (
                <div
                  key={photo.src}
                  className={`group relative overflow-hidden rounded-2xl border border-stone-200 ${
                    photo.wide ? "col-span-2 aspect-[16/10] sm:col-span-2" : "aspect-square"
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes={photo.wide ? "(min-width: 640px) 66vw, 100vw" : "(min-width: 640px) 33vw, 50vw"}
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
          <div className="mt-10">
            <BookingWidget />
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
                En el corazón de Santillana del Mar
              </h2>
              <p className="mt-5 text-stone-700">
                Declarado Conjunto Histórico-Artístico, Santillana del Mar es
                uno de los pueblos mejor conservados de España. Sus calles
                empedradas, casonas blasonadas y la Colegiata románica de
                Santa Juliana están a un paseo desde la puerta del
                apartamento.
              </p>
              <p className="mt-5 text-sm font-medium text-stone-500">
                Av. Antonio Sandi, 1 · Santillana del Mar, Cantabria
              </p>
              <ul className="mt-6 space-y-3 text-sm text-stone-700">
                <li>🚗 5 min de las Cuevas de Altamira</li>
                <li>🚗 25 min de Santander y su aeropuerto</li>
                <li>🚗 30 min de Comillas y San Vicente de la Barquera</li>
                <li>🚶 2 min a pie de la Colegiata de Santa Juliana</li>
              </ul>
              <Link
                href="/guia"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-800 transition hover:bg-white"
              >
                Ver la guía completa de la zona →
              </Link>
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
      </main>
      <Footer />
    </>
  );
}
