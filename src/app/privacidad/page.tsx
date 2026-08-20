import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Política de privacidad · Entre Vigas",
  description: "Cómo tratamos los datos personales en el sitio web de Entre Vigas.",
  robots: { index: false, follow: true },
};

export default async function PrivacidadPage() {
  const settings = await getSettings();

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-5 py-16">
          <p className="text-xs font-semibold tracking-[0.2em] text-terracotta-600 uppercase">
            Información legal
          </p>
          <h1 className="mt-3 font-display text-3xl text-stone-900 sm:text-4xl">
            Política de privacidad
          </h1>
          <p className="mt-4 text-sm text-stone-500">
            Última actualización: agosto de 2026.
          </p>

          <div className="mt-8 grid gap-6 text-sm leading-relaxed text-stone-700">
            <div>
              <h2 className="font-display text-lg text-stone-900">1. Responsable del tratamiento</h2>
              <ul className="mt-2 list-disc pl-5">
                <li>Responsable: Carlos Alejandro Arechavaleta León</li>
                <li>Domicilio: Av. Antonio Sandi, 1 · 39330 Santillana del Mar, Cantabria (España)</li>
                <li>
                  Correo electrónico:{" "}
                  <a href={`mailto:${settings.contactEmail}`} className="text-terracotta-600 hover:underline">
                    {settings.contactEmail}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-lg text-stone-900">2. Qué datos recogemos</h2>
              <p className="mt-2">
                Cuando envías una solicitud de reserva a través del formulario de esta web,
                recogemos: nombre y apellidos, correo electrónico, teléfono, número de huéspedes,
                fechas de entrada y salida, y el mensaje opcional que escribas. No recogemos datos
                de pago: el pago se gestiona directamente contigo, fuera de esta web.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-stone-900">3. Para qué los usamos</h2>
              <p className="mt-2">
                Usamos estos datos únicamente para gestionar tu solicitud de reserva: comprobar
                disponibilidad, contactarte para confirmarla, y organizar tu estancia (por ejemplo,
                coordinar la llegada). No se usan para enviarte publicidad ni se ceden a terceros
                con fines comerciales.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-stone-900">4. Base legal</h2>
              <p className="mt-2">
                El tratamiento se basa en la ejecución de medidas precontractuales solicitadas por
                ti (la propia solicitud de reserva) y, en su caso, en la ejecución del contrato de
                alojamiento (art. 6.1.b del RGPD).
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-stone-900">5. Cuánto tiempo los conservamos</h2>
              <p className="mt-2">
                Conservamos los datos de las solicitudes y reservas mientras sea necesario para
                gestionar tu estancia y, después, durante los plazos legalmente exigidos (por
                ejemplo, obligaciones fiscales y de registro de viajeros). Si tu solicitud no llega
                a confirmarse, puedes pedirnos que eliminemos tus datos antes de ese plazo.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-stone-900">6. Con quién compartimos los datos</h2>
              <p className="mt-2">
                No vendemos ni cedemos tus datos a terceros con fines comerciales. Los datos se
                almacenan en los servidores de nuestros proveedores de alojamiento web y base de
                datos (Vercel Inc. y Neon, Inc.), que actúan como encargados del tratamiento, y solo
                se comparten con terceros cuando existe obligación legal (por ejemplo, el registro
                de viajeros ante las autoridades competentes).
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-stone-900">7. Tus derechos</h2>
              <p className="mt-2">
                Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición,
                limitación del tratamiento y portabilidad escribiendo a{" "}
                <a href={`mailto:${settings.contactEmail}`} className="text-terracotta-600 hover:underline">
                  {settings.contactEmail}
                </a>
                . Si consideras que no hemos atendido tu solicitud correctamente, puedes reclamar
                ante la Agencia Española de Protección de Datos (
                <a
                  href="https://www.aepd.es"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terracotta-600 hover:underline"
                >
                  www.aepd.es
                </a>
                ).
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-stone-900">8. Cookies</h2>
              <p className="mt-2">
                Esta web no utiliza cookies de analítica ni de publicidad. Solo se utiliza una
                cookie técnica, estrictamente necesaria, para mantener la sesión iniciada en el
                panel privado del propietario — no afecta a los visitantes ni huéspedes que
                consultan la web o hacen una reserva.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
