import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ActividadCard, Badge, PoiCard, RestaurantCard, SectionKicker } from "@/components/guia/GuideBits";
import {
  actividadesDestacadas,
  actividadesOtras,
  actividadesPorDistancia,
  antesDeSalir,
  bloque1,
  bloque2,
  bloque3,
  bloque4,
  comerSinEquivocarse,
  consejoActividades,
  playas,
  restaurantesDestacados,
  restaurantesPorCategoria,
  restaurantesPorDistancia,
  rutas,
} from "@/lib/guia-data";

const guiaTitle = "Guía de Santillana del Mar y Cantabria · Entre Vigas";
const guiaDescription =
  "Qué ver, dónde comer y en qué playas bañarte cerca del apartamento Entre Vigas, en Santillana del Mar. Distancias reales, precios y consejos de quienes lo conocen.";

export const metadata: Metadata = {
  title: guiaTitle,
  description: guiaDescription,
  openGraph: {
    title: guiaTitle,
    description: guiaDescription,
    url: "/guia",
    siteName: "Entre Vigas",
    images: [{ url: "/gallery/fachada.jpg", width: 1200, height: 900 }],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: guiaTitle,
    description: guiaDescription,
    images: ["/gallery/fachada.jpg"],
  },
};

// El pie de página incluido en esta ruta lee ajustes editables desde el
// panel (contacto, enlaces, licencia): hay que renderizar en cada visita.
export const dynamic = "force-dynamic";

const subnav = [
  { href: "#que-ver", label: "Qué ver" },
  { href: "#donde-comer", label: "Dónde comer" },
  { href: "#playas", label: "Playas" },
  { href: "#actividades", label: "Actividades" },
];

export default function GuiaPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-linen border-b border-stone-200 px-5 py-16 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-terracotta-600 uppercase">
            Apartamento Entre Vigas · Santillana del Mar
          </p>
          <h1 className="mx-auto mt-3 max-w-2xl font-display text-5xl font-black tracking-tight text-stone-900 uppercase sm:text-6xl">
            La guía que le damos a nuestros huéspedes
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-stone-700">
            Qué ver desde la puerta del apartamento, dónde comer bien por la
            zona y en qué playas bañarte — una selección personal, no una
            lista genérica de internet.
          </p>
        </section>

        <nav className="sticky top-[65px] z-20 border-b border-stone-200 bg-cream/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-5 py-3 text-sm font-medium text-stone-600">
            {subnav.map((s) => (
              <a key={s.href} href={s.href} className="whitespace-nowrap transition hover:text-terracotta-600">
                {s.label}
              </a>
            ))}
          </div>
        </nav>

        {/* ============================= QUÉ VER ============================= */}
        <section id="que-ver" className="mx-auto max-w-6xl scroll-mt-32 px-5 py-16">
          <SectionKicker>Qué ver desde tu puerta</SectionKicker>
          <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-stone-900 uppercase sm:text-5xl lg:text-6xl">
            Treinta lugares, ordenados por distancia real
          </h2>
          <p className="mt-4 max-w-2xl text-stone-700">
            Del paseo a pie hasta el día completo. Distancias por carretera
            desde el centro de Santillana del Mar; precios y horarios
            verificados en agosto de 2026 — confírmalos antes de salir.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["A pie", "estás en el centro de Santillana"],
              ["4 min", "a las cuevas de Altamira"],
              ["7", "sitios a menos de 20 km"],
              ["4", "rutas de día montadas"],
            ].map(([n, l]) => (
              <div key={l} className="rounded-2xl border border-stone-200 bg-white/70 p-4">
                <p className="font-display text-2xl text-terracotta-600">{n}</p>
                <p className="mt-1 text-xs text-stone-600">{l}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-14 font-display text-2xl text-stone-900">
            Menos de 20 km — media mañana y vuelves a comer
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {bloque1.map((p) => (
              <PoiCard key={p.n} poi={p} />
            ))}
          </div>

          <h3 className="mt-14 font-display text-2xl text-stone-900">
            20 a 50 km — un día entero, sin madrugar
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {bloque2.map((p) => (
              <PoiCard key={p.n} poi={p} />
            ))}
          </div>

          <h3 className="mt-14 font-display text-2xl text-stone-900">
            Más de 50 km — salir pronto y volver de noche
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {bloque3.map((p) => (
              <PoiCard key={p.n} poi={p} />
            ))}
          </div>

          <h3 className="mt-14 font-display text-2xl text-stone-900">
            Fuera de Cantabria — cuando la excursión cruza la frontera
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {bloque4.map((p) => (
              <div key={p.n} className="rounded-2xl border border-stone-200 bg-white/70 p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-display text-base text-stone-900">{p.name}</p>
                </div>
                <p className="mt-1 text-xs font-semibold text-terracotta-600">{p.distance}</p>
                <p className="mt-2 text-sm text-stone-700">{p.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-moss-600/10 p-6">
            <p className="font-display text-lg text-moss-700">Si solo puedes hacer tres cosas</p>
            <p className="mt-2 text-sm text-stone-700">
              Altamira a primera hora, El Soplao con entrada reservada, y un
              día completo en Liébana bajando desde Fuente Dé. Con eso te
              llevas la prehistoria, la geología y la alta montaña de
              Cantabria.
            </p>
          </div>

          <h3 className="mt-14 font-display text-2xl text-stone-900">Cuatro días ya montados</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {rutas.map((r) => (
              <div key={r.letra} className="rounded-2xl border border-stone-200 bg-white/70 p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-lg text-stone-900">
                    Ruta {r.letra} · {r.titulo}
                  </p>
                </div>
                <p className="mt-1 text-xs font-semibold text-terracotta-600">{r.distancia}</p>
                <p className="mt-2 text-sm text-stone-700">{r.pasos}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-14 font-display text-2xl text-stone-900">Antes de salir</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {antesDeSalir.map((t) => (
              <div key={t.titulo} className="rounded-2xl border border-stone-200 bg-white/70 p-5">
                <p className="font-display text-base text-stone-900">{t.titulo}</p>
                <p className="mt-2 text-sm text-stone-700">{t.texto}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-14 font-display text-2xl text-stone-900">Comer sin equivocarse</h3>
          <div className="mt-5 grid gap-4 rounded-2xl bg-stone-900 p-6 text-stone-200 sm:grid-cols-3">
            {comerSinEquivocarse.map((c) => (
              <div key={c.plato}>
                <p className="font-display text-base text-white">{c.plato}</p>
                <p className="mt-1 text-sm text-stone-400">{c.texto}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-moss-600/10 p-5">
              <p className="font-display text-base text-moss-700">Emergencias</p>
              <p className="mt-1 font-display text-2xl text-stone-900">112</p>
              <p className="text-xs text-stone-600">Todo el territorio, gratuito</p>
            </div>
            <div className="rounded-2xl bg-stone-100 p-5">
              <p className="font-display text-base text-stone-800">Info turística de Cantabria</p>
              <p className="mt-1 font-display text-2xl text-stone-900">942 310 708</p>
              <p className="text-xs text-stone-600">turismodecantabria.com</p>
            </div>
          </div>
        </section>

        {/* ============================= DÓNDE COMER ============================= */}
        <section id="donde-comer" className="scroll-mt-32 border-t border-stone-200 bg-stone-50 py-16">
          <div className="mx-auto max-w-6xl px-5">
            <SectionKicker>Dónde comer</SectionKicker>
            <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-stone-900 uppercase sm:text-5xl lg:text-6xl">
              Mis restaurantes favoritos de Cantabria
            </h2>
            <p className="mt-4 max-w-2xl text-stone-700">
              Cantabria tiene una gastronomía extraordinaria y una infinidad
              de sitios donde se come de maravilla. Esta no pretende ser una
              lista definitiva — es una pequeña selección personal de los
              restaurantes que hemos probado y recomendamos sin dudarlo.
            </p>

            <h3 className="mt-12 font-display text-2xl text-stone-900">
              A pie o a pocos minutos del apartamento
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {restaurantesDestacados.map((r) => (
                <RestaurantCard key={r.name} r={r} />
              ))}
            </div>

            <h3 className="mt-12 font-display text-2xl text-stone-900">
              Todos, ordenados por distancia
            </h3>
            <div className="mt-5 overflow-x-auto rounded-2xl border border-stone-200 bg-white/70">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-xs tracking-wide text-stone-500 uppercase">
                    <th className="px-4 py-3 font-semibold">Km</th>
                    <th className="px-4 py-3 font-semibold">Restaurante</th>
                    <th className="px-4 py-3 font-semibold">Localidad</th>
                    <th className="px-4 py-3 font-semibold">Especialidad</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurantesPorDistancia.map((r) => (
                    <tr key={r.name} className="border-b border-stone-100 last:border-0">
                      <td className="px-4 py-2.5 whitespace-nowrap text-stone-500">
                        {r.km === "0 km" ? "a pie" : r.km}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-stone-900">
                        {r.name}
                        {r.top && <span className="ml-1.5 text-xs text-terracotta-600">★</span>}
                      </td>
                      <td className="px-4 py-2.5 text-stone-600">{r.place}</td>
                      <td className="px-4 py-2.5 text-stone-600">{r.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="mt-12 font-display text-2xl text-stone-900">Los mejores por categoría</h3>
            <div className="mt-5 grid gap-6">
              {restaurantesPorCategoria.map((cat) => (
                <div key={cat.categoria} className="overflow-hidden rounded-2xl border border-stone-200">
                  <div className={`${cat.color} px-5 py-3 text-white`}>
                    <p className="font-display text-lg">{cat.categoria}</p>
                    {cat.subtitulo && <p className="text-xs text-white/70">{cat.subtitulo}</p>}
                  </div>
                  <div className="grid gap-4 bg-white/70 p-5 sm:grid-cols-2 lg:grid-cols-3">
                    {cat.items.map((it) => (
                      <div key={it.nombre}>
                        <p className="font-medium text-stone-900">{it.nombre}</p>
                        <p className="text-xs text-terracotta-600">{it.lugar}</p>
                        <p className="mt-1 text-sm text-stone-700">{it.texto}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================= PLAYAS ============================= */}
        <section id="playas" className="mx-auto max-w-6xl scroll-mt-32 px-5 py-16">
          <SectionKicker>Playas y chiringuitos</SectionKicker>
          <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-stone-900 uppercase sm:text-5xl lg:text-6xl">
            Diez arenales con encanto, y dónde tomar algo con los pies en la arena
          </h2>
          <p className="mt-4 max-w-2xl text-stone-700">
            Santillana del Mar, a pesar de su nombre, no está en la costa —
            pero tiene algunas de las mejores playas de Cantabria a apenas
            10–30 minutos en coche.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {playas.map((p) => (
              <div key={p.n} className="rounded-2xl border border-stone-200 bg-white/70 p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-display text-lg text-stone-900">{p.nombre}</p>
                  <Badge tone="stone">{p.tiempo}</Badge>
                </div>
                <p className="text-xs text-stone-500">{p.lugar}</p>
                <p className="mt-2 text-sm text-stone-700">{p.descripcion}</p>
                {p.chiringuito && (
                  <p className="mt-3 rounded-lg bg-terracotta-500/10 p-3 text-xs text-stone-700">
                    <span className="font-semibold text-terracotta-600">Chiringuito </span>
                    {p.chiringuito}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-stone-900 p-6 text-sm text-stone-300">
            <p className="font-display text-base text-white">Consejo</p>
            <p className="mt-2">
              Si vais con niños o buscáis tranquilidad, Santa Justa, Oyambre y
              Cuchía son las más cómodas. Para paisaje espectacular, la Arnía
              y la zona de Liencres son las que más sorprenden. Tagle es
              buena opción si se quiere huir de la masificación de Suances.
              Para el mejor atardecer: el Chiringuito de los Locos / El
              Castillo de los Locos (Suances) y El Rayo Verde en Gerra. El
              oleaje en la costa cántabra puede ser fuerte: prestad atención
              a las banderas de socorrismo.
            </p>
          </div>
        </section>

        {/* ============================= ACTIVIDADES ============================= */}
        <section id="actividades" className="scroll-mt-32 border-t border-stone-200 bg-stone-50 py-16">
          <div className="mx-auto max-w-6xl px-5">
            <SectionKicker>Actividades y planes al aire libre</SectionKicker>
            <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-stone-900 uppercase sm:text-5xl lg:text-6xl">
              Surf, pádel, CrossFit, caballos y motos de agua
            </h2>
            <p className="mt-4 max-w-2xl text-stone-700">
              Cantabria es una tierra estupenda para el ocio activo: desde las
              olas del Cantábrico hasta los ríos de los Picos de Europa,
              pasando por rutas a caballo, pádel, CrossFit o motos de agua en
              la bahía. Esta es nuestra selección personal, con toda la
              información verificada.
            </p>

            <h3 className="mt-12 font-display text-2xl text-stone-900">
              Recomendadas, cerca del apartamento
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {actividadesDestacadas.map((a) => (
                <ActividadCard key={a.nombre} a={a} />
              ))}
            </div>

            <h3 className="mt-12 font-display text-2xl text-stone-900">
              Todas, ordenadas por distancia
            </h3>
            <div className="mt-5 overflow-x-auto rounded-2xl border border-stone-200 bg-white/70">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-xs tracking-wide text-stone-500 uppercase">
                    <th className="px-4 py-3 font-semibold">Km</th>
                    <th className="px-4 py-3 font-semibold">Actividad</th>
                    <th className="px-4 py-3 font-semibold">Localidad</th>
                    <th className="px-4 py-3 font-semibold">Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {actividadesPorDistancia.map((a) => (
                    <tr key={a.nombre} className="border-b border-stone-100 last:border-0">
                      <td className="px-4 py-2.5 whitespace-nowrap text-stone-500">
                        {a.km === "0 km" ? "a pie" : a.km}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-stone-900">
                        {a.nombre}
                        {a.recomendado && <span className="ml-1.5 text-xs text-terracotta-600">★</span>}
                      </td>
                      <td className="px-4 py-2.5 text-stone-600">{a.lugar}</td>
                      <td className="px-4 py-2.5 text-stone-600">{a.tipo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="mt-12 font-display text-2xl text-stone-900">
              Ríos, senderismo y montaña
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {actividadesOtras.map((o) => (
                <div key={o.titulo} className="rounded-2xl border border-stone-200 bg-white/70 p-5">
                  <p className="font-display text-base text-stone-900">{o.titulo}</p>
                  <p className="mt-2 text-sm text-stone-700">{o.texto}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl bg-stone-900 p-6 text-sm text-stone-300">
              <p className="font-display text-base text-white">Cuándo hacer cada cosa</p>
              <p className="mt-2">{consejoActividades}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
