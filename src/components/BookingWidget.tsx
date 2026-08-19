"use client";

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

type Step = "dates" | "details" | "success";

function toDateOnly(d: Date) {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

function nightsBetween(a: Date, b: Date) {
  return Math.round((toDateOnly(b).getTime() - toDateOnly(a).getTime()) / 86400000);
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

export default function BookingWidget() {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const [step, setStep] = useState<Step>("dates");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    guestName: "",
    email: "",
    phone: "",
    guests: 2,
    message: "",
  });
  const [confirmation, setConfirmation] = useState<{
    checkIn: string;
    checkOut: string;
    total: number;
  } | null>(null);

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

  const disabledMatchers = useMemo(() => {
    const today = toDateOnly(new Date());
    const past = { before: today };
    if (!availability) return [past];
    const occupied = availability.occupiedRanges.map((r) => ({
      from: new Date(r.start),
      to: new Date(new Date(r.end).getTime() - 86400000),
    }));
    return [past, ...occupied];
  }, [availability]);

  const nights =
    range?.from && range?.to ? nightsBetween(range.from, range.to) : 0;
  const minNights = availability?.minNights ?? 2;
  const quote =
    availability && nights > 0
      ? {
          lodging: nights * availability.pricePerNight,
          cleaning: availability.cleaningFee,
          total: nights * availability.pricePerNight + availability.cleaningFee,
        }
      : null;

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
                    numberOfMonths={2}
                    selected={range}
                    onSelect={setRange}
                    disabled={disabledMatchers}
                    excludeDisabled
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

            {step === "details" && (
              <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
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
                      max={12}
                      value={form.guests}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          guests: Number(e.target.value),
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
                  contactaremos para confirmar el pago.
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

            {quote && nights >= minNights && availability && (
              <div className="mt-4 grid gap-1.5 border-t border-stone-200 pt-4 text-sm text-stone-700">
                <div className="flex justify-between">
                  <span>
                    {formatMoney(availability.pricePerNight, availability.currency)}{" "}
                    × {nights} {nights === 1 ? "noche" : "noches"}
                  </span>
                  <span>{formatMoney(quote.lodging, availability.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Limpieza</span>
                  <span>{formatMoney(quote.cleaning, availability.currency)}</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-stone-200 pt-2 font-display text-base text-stone-900">
                  <span>Total</span>
                  <span>{formatMoney(quote.total, availability.currency)}</span>
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
              setForm({ guestName: "", email: "", phone: "", guests: 2, message: "" });
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
