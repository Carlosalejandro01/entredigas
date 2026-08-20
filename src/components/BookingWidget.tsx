"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { es } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { IconCheck } from "@/components/icons";

type Availability = {
  occupiedRanges: { start: string; end: string }[];
  pricePerNight: number;
  cleaningFee: number;
  minNights: number;
  currency: string;
};

type Quote = {
  nights: number;
  averagePricePerNight: number;
  lodging: number;
  surchargePercent: number;
  cleaningFee: number;
  currency: string;
  minNights: number;
  baseGuests: number;
  maxGuests: number;
  total: number;
};

type Step = "dates" | "details" | "success";

function toDateOnly(d: Date) {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

function nightsBetween(a: Date, b: Date) {
  return Math.round((toDateOnly(b).getTime() - toDateOnly(a).getTime()) / 86400000);
}

function isoKey(d: Date) {
  return toDateOnly(d).toISOString().slice(0, 10);
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency || "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
  }).format(d);
}

function useIsNarrowScreen() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the initial viewport size on mount
    setNarrow(query.matches);
    const onChange = (e: MediaQueryListEvent) => setNarrow(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return narrow;
}

export default function BookingWidget({ maxGuests }: { maxGuests: number }) {
  const isNarrowScreen = useIsNarrowScreen();
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const [step, setStep] = useState<Step>("dates");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [form, setForm] = useState({
    guestName: "",
    email: "",
    phone: "",
    guests: 2,
    message: "",
    website: "", // campo trampa para bots, no se muestra a personas
  });
  const [confirmation, setConfirmation] = useState<{
    checkIn: string;
    checkOut: string;
    total: number;
  } | null>(null);
  const [selectionNotice, setSelectionNotice] = useState<string | null>(null);

  async function loadAvailability() {
    try {
      const res = await fetch("/api/availability", { cache: "no-store" });
      if (!res.ok) throw new Error();
      setAvailability(await res.json());
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    loadAvailability();
  }, []);

  // Noches realmente ocupadas (no el propio día de salida de una reserva,
  // que sí se puede usar como entrada de la siguiente).
  const occupiedNightKeys = useMemo(() => {
    const set = new Set<string>();
    if (!availability) return set;
    for (const r of availability.occupiedRanges) {
      let cursor = toDateOnly(new Date(r.start));
      const end = toDateOnly(new Date(r.end));
      while (cursor.getTime() < end.getTime()) {
        set.add(isoKey(cursor));
        cursor = new Date(cursor.getTime() + 86400000);
      }
    }
    return set;
  }, [availability]);

  const today = toDateOnly(new Date());

  function isSpanFree(from: Date, to: Date) {
    let cursor = toDateOnly(from);
    const end = toDateOnly(to);
    while (cursor.getTime() < end.getTime()) {
      if (occupiedNightKeys.has(isoKey(cursor))) return false;
      cursor = new Date(cursor.getTime() + 86400000);
    }
    return true;
  }

  function handleRangeSelect(newRange: DateRange | undefined) {
    setSelectionNotice(null);
    if (!newRange?.from) {
      setRange(undefined);
      return;
    }
    if (!newRange.to) {
      if (occupiedNightKeys.has(isoKey(newRange.from))) {
        setSelectionNotice("Esa noche ya está reservada.");
        return;
      }
      setRange({ from: newRange.from, to: undefined });
      return;
    }
    // El día de salida no consume esa noche: solo hace falta que las
    // noches entre la entrada y la salida (sin incluir la salida) estén
    // libres, aunque la salida coincida con la entrada de otra reserva.
    if (!isSpanFree(newRange.from, newRange.to)) {
      setSelectionNotice("Hay una reserva entre esas fechas; elige otra salida.");
      setRange({ from: newRange.from, to: undefined });
      return;
    }
    setRange(newRange);
  }

  const nights =
    range?.from && range?.to ? nightsBetween(range.from, range.to) : 0;
  const minNights = quote?.minNights ?? availability?.minNights ?? 2;

  useEffect(() => {
    if (!range?.from || !range?.to || nights <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clear stale quote when dates are incomplete
      setQuote(null);
      return;
    }
    let cancelled = false;
    setQuoteLoading(true);
    fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checkIn: toDateOnly(range.from).toISOString(),
        checkOut: toDateOnly(range.to).toISOString(),
        guests: form.guests,
      }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled) setQuote(data);
      })
      .catch(() => {
        if (!cancelled) setQuote(null);
      })
      .finally(() => {
        if (!cancelled) setQuoteLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [range?.from, range?.to, form.guests, nights]);

  const canContinue = Boolean(range?.from && range?.to && nights >= minNights);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!range?.from || !range?.to) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: form.guestName,
          email: form.email,
          phone: form.phone,
          guests: form.guests,
          checkIn: toDateOnly(range.from).toISOString(),
          checkOut: toDateOnly(range.to).toISOString(),
          message: form.message || undefined,
          website: form.website || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          await loadAvailability();
          setRange(undefined);
          setStep("dates");
        }
        throw new Error(data.error || "No se ha podido enviar la reserva.");
      }
      setConfirmation({
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        total: data.totalPrice,
      });
      setStep("success");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white/70 p-8 text-center text-stone-700">
        No se ha podido cargar el calendario de disponibilidad. Prueba a
        recargar la página o escríbenos directamente.
      </div>
    );
  }

  return (
    <div className="grid gap-8 rounded-3xl border border-stone-200 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(60,54,45,0.4)] sm:p-8 lg:grid-cols-[1fr_320px]">
      {step !== "success" && (
        <>
          <div>
            <p className="text-xs tracking-[0.2em] text-terracotta-600 uppercase font-semibold">
              Paso {step === "dates" ? "1" : "2"} de 2
            </p>
            <h3 className="mt-1 font-display text-2xl text-stone-900">
              {step === "dates" ? "Elige tus fechas" : "Tus datos"}
            </h3>

            {step === "dates" && (
              <div className="mt-4 overflow-x-auto">
                {availability ? (
                  <DayPicker
                    mode="range"
                    locale={es}
                    numberOfMonths={isNarrowScreen ? 1 : 2}
                    selected={range}
                    onSelect={handleRangeSelect}
                    disabled={{ before: today }}
                    modifiers={{ occupied: (date) => occupiedNightKeys.has(isoKey(date)) }}
                    modifiersClassNames={{ occupied: "!bg-stone-100 !text-stone-400" }}
                    startMonth={new Date()}
                    className="!m-0"
                  />
                ) : (
                  <div className="flex h-72 items-center justify-center text-stone-500">
                    Cargando calendario…
                  </div>
                )}
              </div>
            )}
            {selectionNotice && (
              <p className="mt-2 text-sm text-terracotta-600">{selectionNotice}</p>
            )}

            {step === "details" && (
              <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1 text-sm text-stone-700">
                    Nombre y apellidos
                    <input
                      required
                      value={form.guestName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, guestName: e.target.value }))
                      }
                      className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-stone-900 outline-none focus:border-terracotta-500"
                      placeholder="María García"
                    />
                  </label>
                  <label className="grid gap-1 text-sm text-stone-700">
                    Nº de huéspedes
                    <input
                      required
                      type="number"
                      min={1}
                      max={maxGuests}
                      value={form.guests}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          guests: Math.min(maxGuests, Math.max(1, Number(e.target.value) || 1)),
                        }))
                      }
                      className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-stone-900 outline-none focus:border-terracotta-500"
                    />
                  </label>
                  <label className="grid gap-1 text-sm text-stone-700">
                    Email
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-stone-900 outline-none focus:border-terracotta-500"
                      placeholder="tucorreo@ejemplo.com"
                    />
                  </label>
                  <label className="grid gap-1 text-sm text-stone-700">
                    Teléfono
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-stone-900 outline-none focus:border-terracotta-500"
                      placeholder="600 000 000"
                    />
                  </label>
                </div>
                <label className="grid gap-1 text-sm text-stone-700">
                  Mensaje (opcional)
                  <textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    rows={3}
                    className="resize-none rounded-lg border border-stone-200 bg-white px-3 py-2 text-stone-900 outline-none focus:border-terracotta-500"
                    placeholder="Hora aproximada de llegada, peticiones especiales…"
                  />
                </label>

                {formError && (
                  <p className="rounded-lg bg-terracotta-500/10 px-3 py-2 text-sm text-terracotta-600">
                    {formError}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("dates")}
                    className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full bg-terracotta-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-terracotta-600 disabled:opacity-60"
                  >
                    {submitting ? "Enviando…" : "Confirmar solicitud de reserva"}
                  </button>
                </div>
                <p className="text-xs text-stone-500">
                  Al enviar, las fechas quedan reservadas provisionalmente y te
                  contactaremos para confirmar el pago. Tus datos se tratan
                  según nuestra{" "}
                  <Link href="/privacidad" className="underline hover:text-terracotta-600">
                    Política de Privacidad
                  </Link>
                  .
                </p>
              </form>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-stone-200 bg-stone-50 p-5">
            <p className="text-xs tracking-[0.2em] text-stone-500 uppercase font-semibold">
              Resumen
            </p>
            {range?.from ? (
              <p className="mt-2 font-display text-lg text-stone-900">
                {formatDate(range.from)}
                {range.to ? ` — ${formatDate(range.to)}` : ""}
              </p>
            ) : (
              <p className="mt-2 text-sm text-stone-500">
                Selecciona la entrada y la salida en el calendario.
              </p>
            )}

            {nights > 0 && nights < minNights && (
              <p className="mt-2 text-sm text-terracotta-600">
                Estancia mínima: {minNights} noches.
              </p>
            )}

            {nights > 0 && (
              <label className="mt-4 grid gap-1 border-t border-stone-200 pt-4 text-sm text-stone-700">
                Nº de huéspedes
                <input
                  type="number"
                  min={1}
                  max={maxGuests}
                  value={form.guests}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      guests: Math.min(
                        maxGuests,
                        Math.max(1, Number(e.target.value) || 1)
                      ),
                    }))
                  }
                  className="w-24 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-stone-900 outline-none focus:border-terracotta-500"
                />
                <span className="text-xs text-stone-500">Máximo {maxGuests} huéspedes.</span>
              </label>
            )}

            {quoteLoading && nights >= minNights && (
              <p className="mt-4 text-sm text-stone-500">Calculando precio…</p>
            )}

            {quote && !quoteLoading && nights >= minNights && (
              <div className="mt-4 grid gap-1.5 border-t border-stone-200 pt-4 text-sm text-stone-700">
                <div className="flex justify-between">
                  <span>
                    {formatMoney(quote.averagePricePerNight, quote.currency)}{" "}
                    × {nights} {nights === 1 ? "noche" : "noches"}
                    {quote.surchargePercent > 0 && ` (+${quote.surchargePercent}% por ${form.guests} huéspedes)`}
                  </span>
                  <span>{formatMoney(quote.lodging, quote.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Limpieza</span>
                  <span>{formatMoney(quote.cleaningFee, quote.currency)}</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-stone-200 pt-2 font-display text-base text-stone-900">
                  <span>Total</span>
                  <span>{formatMoney(quote.total, quote.currency)}</span>
                </div>
              </div>
            )}

            {step === "dates" && (
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => setStep("details")}
                className="mt-5 w-full rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continuar
              </button>
            )}
          </aside>
        </>
      )}

      {step === "success" && confirmation && (
        <div className="col-span-full flex flex-col items-center gap-4 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-moss-600 text-white">
            <IconCheck className="h-7 w-7" />
          </div>
          <h3 className="font-display text-2xl text-stone-900">
            ¡Solicitud recibida!
          </h3>
          <p className="max-w-md text-stone-600">
            Hemos reservado provisionalmente del{" "}
            <strong>{formatDate(new Date(confirmation.checkIn))}</strong> al{" "}
            <strong>{formatDate(new Date(confirmation.checkOut))}</strong> por{" "}
            <strong>
              {formatMoney(confirmation.total, availability?.currency ?? "EUR")}
            </strong>
            . Te escribiremos en breve para confirmar el pago y los detalles
            de la llegada.
          </p>
          <button
            type="button"
            onClick={() => {
              setStep("dates");
              setRange(undefined);
              setForm({ guestName: "", email: "", phone: "", guests: 2, message: "", website: "" });
              setConfirmation(null);
              loadAvailability();
            }}
            className="mt-2 rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
          >
            Hacer otra reserva
          </button>
        </div>
      )}
    </div>
  );
}
