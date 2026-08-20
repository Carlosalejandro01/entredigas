import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Aviso legal · Entre Vigas",
  description: "Aviso legal del sitio web de Entre Vigas, apartamento en Santillana del Mar.",
  robots: { index: false, follow: true },
};

export default async function AvisoLegalPage() {
  const settings = await getSettings();

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-5 py-16">
          <p className="text-xs font-semibold tracking-[0.2em] text-terracotta-600 uppercase">
            Información legal
          </p>
          <h1 className="mt-3 font-display text-3xl text-stone-900 sm:text-4xl">Aviso legal</h1>

          <div className="mt-8 grid gap-6 text-sm leading-relaxed text-stone-700">
            <div>
              <h2 className="font-display text-lg text-stone-900">1. Titular del sitio web</h2>
              <p className="mt-2">
                En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de
                la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de
                los siguientes datos:
              </p>
              <ul className="mt-2 list-disc pl-5">
                <li>Titular: Carlos Alejandro Arechavaleta León</li>
                <li>Domicilio: Av. Antonio Sandi, 1 · 39330 Santillana del Mar, Cantabria (España)</li>
                <li>
                  Correo electrónico:{" "}
                  <a href={`mailto:${settings.contactEmail}`} className="text-terracotta-600 hover:underline">
                    {settings.contactEmail}
                  </a>
                </li>
                <li>Teléfono: {settings.contactPhone}</li>
                {settings.licenseNumber && (
                  <li>Número de licencia de vivienda de uso turístico: {settings.licenseNumber}</li>
                )}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-lg text-stone-900">2. Objeto</h2>
              <p className="mt-2">
                Este sitio web («Entre Vigas») tiene como finalidad informar sobre el apartamento
                turístico Entre Vigas, situado en Santillana del Mar (Cantabria), y permitir a los
                usuarios consultar su disponibilidad y enviar solicitudes de reserva directamente,
                sin intermediarios.
              </p>
              <p className="mt-2">
                Las solicitudes enviadas a través del formulario de reserva son provisionales: el
                titular se pondrá en contacto con el usuario para confirmar la disponibilidad, el
                precio y el pago antes de considerar la reserva definitiva.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-stone-900">3. Condiciones de uso</h2>
              <p className="mt-2">
                El acceso y uso de este sitio web atribuye la condición de usuario e implica la
                aceptación de las condiciones incluidas en este aviso legal. El usuario se
                compromete a hacer un uso adecuado y lícito del sitio web, de acuerdo con la
                legislación aplicable, la buena fe y el orden público, absteniéndose de utilizarlo
                de forma que pueda impedir o dañar su normal funcionamiento.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-stone-900">4. Propiedad intelectual</h2>
              <p className="mt-2">
                Los textos, fotografías y demás contenidos de este sitio web son propiedad del
                titular o se utilizan con la autorización correspondiente, y están protegidos por
                la normativa de propiedad intelectual. Queda prohibida su reproducción,
                distribución o comunicación pública sin autorización previa, salvo en los casos
                permitidos por la ley.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-stone-900">5. Enlaces a terceros</h2>
              <p className="mt-2">
                El sitio web incluye enlaces y contenidos incrustados de terceros (por ejemplo,
                Google Maps, OpenStreetMap o el enlace a la ficha de reseñas de Google) sobre los
                que el titular no tiene control ni asume responsabilidad. El uso de esos servicios
                queda sujeto a las condiciones y políticas de privacidad propias de cada uno.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-stone-900">6. Protección de datos</h2>
              <p className="mt-2">
                El tratamiento de los datos personales facilitados a través del formulario de
                reserva se describe en la{" "}
                <a href="/privacidad" className="text-terracotta-600 hover:underline">
                  Política de Privacidad
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-stone-900">7. Legislación aplicable</h2>
              <p className="mt-2">
                Las presentes condiciones se rigen por la legislación española. Para cualquier
                controversia derivada del uso de este sitio web, las partes se someterán a los
                juzgados y tribunales que correspondan conforme a la normativa vigente en materia
                de protección de consumidores y usuarios.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
