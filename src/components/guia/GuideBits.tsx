import type { ReactNode } from "react";

type MetaItem = { label: string; value: string };

export function Meta({ items }: { items: MetaItem[] }) {
  if (items.length === 0) return null;
  return (
    <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-stone-600">
      {items.map((m) => (
        <div key={m.label} className="flex gap-1">
          <dt className="font-semibold text-stone-800">{m.label}</dt>
          <dd>{m.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Badge({
  children,
  tone = "terracotta",
}: {
  children: ReactNode;
  tone?: "terracotta" | "moss" | "stone";
}) {
  const tones = {
    terracotta: "bg-terracotta-500/10 text-terracotta-600",
    moss: "bg-moss-600/10 text-moss-700",
    stone: "bg-stone-200 text-stone-600",
  };
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export type Poi = {
  n: number;
  name: string;
  distance: string;
  description: string;
  meta?: MetaItem[];
  highlight?: boolean;
};

export function PoiCard({ poi }: { poi: Poi }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        poi.highlight
          ? "border-terracotta-500/40 bg-terracotta-500/5"
          : "border-stone-200 bg-white/70"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="font-display text-lg text-stone-900">
          <span className="mr-2 text-stone-400">{poi.n}·</span>
          {poi.name}
        </p>
        <Badge tone={poi.highlight ? "terracotta" : "stone"}>{poi.distance}</Badge>
      </div>
      <p className="mt-2 text-sm text-stone-700">{poi.description}</p>
      {poi.meta && <Meta items={poi.meta} />}
    </div>
  );
}

export type Restaurant = {
  name: string;
  place: string;
  km: string;
  time: string;
  tags: string[];
  description: string;
  note?: string;
  top?: boolean;
};

export function RestaurantCard({ r }: { r: Restaurant }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white/70 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg text-stone-900">
            {r.name}
            {r.top && <span className="ml-2 text-xs text-terracotta-600">★ TOP</span>}
          </p>
          <p className="text-xs text-stone-500">{r.place}</p>
        </div>
        <Badge tone="stone">{r.km === "0 km" ? "A pie" : `${r.km} · ${r.time}`}</Badge>
      </div>
      {r.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {r.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <p className="mt-3 text-sm text-stone-700">{r.description}</p>
      {r.note && <p className="mt-2 text-xs italic text-terracotta-600">{r.note}</p>}
    </div>
  );
}

export function SectionKicker({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-[0.2em] text-terracotta-600 uppercase">
      {children}
    </p>
  );
}
