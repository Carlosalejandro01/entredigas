import Link from "next/link";
import { IconInstagram, IconMail, IconMapPin, IconPhone } from "@/components/icons";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-900 text-stone-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-xl text-white">Entre Vigas</p>
          <p className="mt-3 max-w-xs text-sm text-stone-400">
            Apartamento rural en el centro histórico de Santillana del Mar,
            Cantabria. Reserva directa, sin intermediarios.
          </p>
        </div>
        <div className="text-sm text-stone-300">
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">
            Contacto
          </p>
          <p className="flex items-center gap-2">
            <IconMapPin className="h-4 w-4 shrink-0 text-terracotta-500" />
            Av. Antonio Sandi, 1 · Santillana del Mar
          </p>
          <p className="mt-2 flex items-center gap-2">
            <IconPhone className="h-4 w-4 shrink-0 text-terracotta-500" />
            <a href="tel:+34634218140" className="hover:text-white">
              +34 634 218 140
            </a>
          </p>
          <p className="mt-2 flex items-center gap-2">
            <IconMail className="h-4 w-4 shrink-0 text-terracotta-500" />
            <a
              href="mailto:entrevigasapartamentosdm@gmail.com"
              className="hover:text-white"
            >
              entrevigasapartamentosdm@gmail.com
            </a>
          </p>
          <p className="mt-2 flex items-center gap-2">
            <IconInstagram className="h-4 w-4 shrink-0 text-terracotta-500" />
            <a
              href="https://instagram.com/entrevigasapartamento"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              @entrevigasapartamento
            </a>
          </p>
        </div>
        <div className="text-sm text-stone-300">
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">
            Enlaces
          </p>
          <Link href="/#reservar" className="block hover:text-white">
            Reservar
          </Link>
          <Link href="/#ubicacion" className="mt-2 block hover:text-white">
            Cómo llegar
          </Link>
          <Link href="/guia" className="mt-2 block hover:text-white">
            Guía de la zona
          </Link>
          <Link href="/admin" className="mt-2 block text-stone-500 hover:text-stone-300">
            Acceso propietario
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} Entre Vigas · Santillana del Mar
      </div>
    </footer>
  );
}
