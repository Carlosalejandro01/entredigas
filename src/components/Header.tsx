import Link from "next/link";

const links = [
  { href: "#apartamento", label: "El apartamento" },
  { href: "#galeria", label: "Galería" },
  { href: "#ubicacion", label: "Ubicación" },
  { href: "#reservar", label: "Reservar" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-display text-xl tracking-wide text-stone-900">
          Entre Vigas
          <span className="ml-2 hidden text-xs font-sans font-medium tracking-[0.25em] text-terracotta-600 uppercase sm:inline">
            Santillana del Mar
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-stone-700 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-terracotta-600">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#reservar"
          className="rounded-full bg-stone-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          Reservar
        </a>
      </div>
    </header>
  );
}
