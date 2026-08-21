"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { es } from "react-day-picker/locale";
import "react-day-picker/style.css";

type Booking = {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  message: string | null;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
};

type Settings = {
  pricePerNight: number;
  cleaningFee: number;
  minNights: number;
  currency: string;
  contactEmail: string;
  contactPhone: string;
  baseGuests: number;
  maxGuests: number;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  googleMapsUrl: string;
  googleReviewUrl: string;
  licenseNumber: string;
};

type Photo = {
  id: string;
  alt: string;
  section: string;
  order: number;
  createdAt: string;
};

type SeasonalRate = { month: number; pricePerNight: number | null; minNights: number | null };
type GuestRate = { guests: number; percent: number };
type DateRate = { date: string; pricePerNight: number | null; minNights: number | null };
type Amenity = { id: string; label: string; order: number };
type FaqItem = { id: string; question: string; answer: string; order: number };

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

type BlockedRange = {
  id: string;
  start: string;
  end: string;
  reason: string | null;
  source: string;
};

type ExternalCalendar = {
  id: string;
  name: string;
  icalUrl: string;
  lastSyncedAt: string | null;
  lastSyncError: string | null;
  lastSyncCount: number | null;
};

type Tab = "reservas" | "bloqueos" | "sync" | "fotos" | "precios" | "detalles" | "faq" | "ajustes";

function fmtDate(s: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(s));
}

function fmtMoney(n: number, currency: string) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency }).format(n);
}

const statusLabel: Record<Booking["status"], string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
};

const statusColor: Record<Booking["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-moss-600/15 text-moss-700",
  cancelled: "bg-stone-200 text-stone-500",
};

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("reservas");
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [blocked, setBlocked] = useState<BlockedRange[] | null>(null);
  const [calendars, setCalendars] = useState<ExternalCalendar[] | null>(null);
  const [exportUrl, setExportUrl] = useState<string>("");
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [seasonalRates, setSeasonalRates] = useState<SeasonalRate[] | null>(null);
  const [guestRates, setGuestRates] = useState<GuestRate[] | null>(null);
  const [dateRates, setDateRates] = useState<DateRate[] | null>(null);
  const [amenities, setAmenities] = useState<Amenity[] | null>(null);
  const [faqItems, setFaqItems] = useState<FaqItem[] | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function loadAll() {
    const [b, s, bl, ic, ph, pr, am, fq] = await Promise.all([
      fetch("/api/admin/bookings").then((r) => r.json()),
      fetch("/api/admin/settings").then((r) => r.json()),
      fetch("/api/admin/blocked").then((r) => r.json()),
      fetch("/api/admin/ical").then((r) => r.json()),
      fetch("/api/admin/photos").then((r) => r.json()),
      fetch("/api/admin/pricing").then((r) => r.json()),
      fetch("/api/admin/amenities").then((r) => r.json()),
      fetch("/api/admin/faq").then((r) => r.json()),
    ]);
    setBookings(b.bookings ?? []);
    setSettings(s.settings ?? null);
    setBlocked(bl.blocked ?? []);
    setCalendars(ic.calendars ?? []);
    setExportUrl(ic.exportUrl ?? "");
    setPhotos(ph.photos ?? []);
    setSeasonalRates(pr.seasonalRates ?? []);
    setGuestRates(pr.guestRates ?? []);
    setDateRates(pr.dateRates ?? []);
    setAmenities(am.amenities ?? []);
    setFaqItems(fq.faqItems ?? []);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    loadAll();
  }, []);

  function flash(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  }

  async function updateStatus(id: string, status: Booking["status"]) {
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      flash("Reserva actualizada.");
      loadAll();
    }
  }

  async function deleteBooking(id: string) {
    if (!confirm("¿Eliminar esta reserva definitivamente?")) return;
    const res = await fetch("/api/admin/bookings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      flash("Reserva eliminada.");
      loadAll();
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    onLogout();
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <p className="font-display text-xl text-stone-900">
            Entre Vigas <span className="text-sm text-stone-400">· Panel</span>
          </p>
          <button
            onClick={handleLogout}
            className="rounded-full border border-stone-300 px-4 py-1.5 text-sm text-stone-600 hover:bg-stone-100"
          >
            Cerrar sesión
          </button>
        </div>
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-5">
          {(
            [
              ["reservas", "Reservas"],
              ["bloqueos", "Bloqueos manuales"],
              ["sync", "Booking.com / iCal"],
              ["fotos", "Fotos"],
              ["precios", "Precios"],
              ["detalles", "Detalles del apartamento"],
              ["faq", "Preguntas frecuentes"],
              ["ajustes", "Contenido y ajustes"],
            ] as [Tab, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition ${
                tab === id
                  ? "border-terracotta-500 text-terracotta-600"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        {notice && (
          <div className="mb-5 rounded-lg bg-moss-600/10 px-4 py-2.5 text-sm text-moss-700">
            {notice}
          </div>
        )}

        {tab === "reservas" && (
          <BookingsTab
            bookings={bookings}
            onUpdateStatus={updateStatus}
            onDelete={deleteBooking}
          />
        )}
        {tab === "bloqueos" && (
          <BlockedTab blocked={blocked} onChanged={loadAll} onNotice={flash} />
        )}
        {tab === "sync" && (
          <SyncTab
            calendars={calendars}
            exportUrl={exportUrl}
            onChanged={loadAll}
            onNotice={flash}
          />
        )}
        {tab === "fotos" && (
          <PhotosTab photos={photos} onChanged={loadAll} onNotice={flash} />
        )}
        {tab === "precios" && (
          <PricingTab
            settings={settings}
            seasonalRates={seasonalRates}
            guestRates={guestRates}
            dateRates={dateRates}
            onChanged={loadAll}
            onNotice={flash}
          />
        )}
        {tab === "detalles" && (
          <DetallesTab amenities={amenities} onChanged={loadAll} onNotice={flash} />
        )}
        {tab === "faq" && (
          <FaqTab faqItems={faqItems} onChanged={loadAll} onNotice={flash} />
        )}
        {tab === "ajustes" && (
          <SettingsTab settings={settings} onChanged={loadAll} onNotice={flash} />
        )}
      </main>
    </div>
  );
}

function BookingsTab({
  bookings,
  onUpdateStatus,
  onDelete,
}: {
  bookings: Booking[] | null;
  onUpdateStatus: (id: string, status: Booking["status"]) => void;
  onDelete: (id: string) => void;
}) {
  if (!bookings) return <p className="text-stone-500">Cargando reservas…</p>;
  if (bookings.length === 0)
    return (
      <p className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-stone-500">
        Todavía no hay reservas.
      </p>
    );

  return (
    <div className="grid gap-4">
      {bookings.map((b) => (
        <div
          key={b.id}
          className="rounded-xl border border-stone-200 bg-white p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display text-lg text-stone-900">{b.guestName}</p>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor[b.status]}`}
                >
                  {statusLabel[b.status]}
                </span>
              </div>
              <p className="mt-1 text-sm text-stone-500">
                {fmtDate(b.checkIn)} — {fmtDate(b.checkOut)} · {b.nights} noches ·{" "}
                {b.guests} huéspedes
              </p>
              <p className="mt-1 text-sm text-stone-500">
                {b.email} · {b.phone}
              </p>
              {b.message && (
                <p className="mt-2 rounded-lg bg-stone-50 p-3 text-sm text-stone-600">
                  {b.message}
                </p>
              )}
            </div>
            <p className="font-display text-lg text-stone-900">
              {fmtMoney(b.totalPrice, "EUR")}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {b.status !== "confirmed" && (
              <button
                onClick={() => onUpdateStatus(b.id, "confirmed")}
                className="rounded-full bg-moss-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-moss-700"
              >
                Confirmar
              </button>
            )}
            {b.status !== "cancelled" && (
              <button
                onClick={() => onUpdateStatus(b.id, "cancelled")}
                className="rounded-full bg-stone-200 px-4 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-300"
              >
                Cancelar
              </button>
            )}
            {b.status !== "pending" && (
              <button
                onClick={() => onUpdateStatus(b.id, "pending")}
                className="rounded-full border border-stone-300 px-4 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Marcar pendiente
              </button>
            )}
            <button
              onClick={() => onDelete(b.id)}
              className="ml-auto rounded-full px-4 py-1.5 text-xs font-semibold text-terracotta-600 hover:bg-terracotta-500/10"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function BlockedTab({
  blocked,
  onChanged,
  onNotice,
}: {
  blocked: BlockedRange[] | null;
  onChanged: () => void;
  onNotice: (msg: string) => void;
}) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/blocked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start, end, reason: reason || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al bloquear fechas.");
      setStart("");
      setEnd("");
      setReason("");
      onNotice("Fechas bloqueadas.");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch("/api/admin/blocked", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      onNotice("Bloqueo eliminado.");
      onChanged();
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <form
        onSubmit={handleAdd}
        className="grid h-fit gap-4 rounded-xl border border-stone-200 bg-white p-5"
      >
        <p className="font-display text-lg text-stone-900">Bloquear fechas</p>
        <p className="text-xs text-stone-500">
          Útil para mantenimiento, uso propio o reservas gestionadas fuera de
          la web.
        </p>
        <label className="grid gap-1 text-sm text-stone-700">
          Desde
          <input
            type="date"
            required
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="rounded-lg border border-stone-200 px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm text-stone-700">
          Hasta
          <input
            type="date"
            required
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="rounded-lg border border-stone-200 px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm text-stone-700">
          Motivo (opcional)
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="rounded-lg border border-stone-200 px-3 py-2"
            placeholder="Mantenimiento"
          />
        </label>
        {error && <p className="text-sm text-terracotta-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-60"
        >
          {submitting ? "Guardando…" : "Bloquear"}
        </button>
      </form>

      <div className="grid gap-3">
        {!blocked ? (
          <p className="text-stone-500">Cargando…</p>
        ) : blocked.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-stone-500">
            No hay bloqueos manuales.
          </p>
        ) : (
          blocked.map((b) => {
            const isSynced = b.source.startsWith("ical:");
            return (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-stone-900">
                      {fmtDate(b.start)} — {fmtDate(b.end)}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        isSynced ? "bg-sky-100 text-sky-700" : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {isSynced ? "Sincronizado" : "Manual"}
                    </span>
                  </div>
                  {b.reason && <p className="text-xs text-stone-500">{b.reason}</p>}
                </div>
                {isSynced ? (
                  <span className="text-xs text-stone-400">
                    Gestionado en la pestaña Booking.com / iCal
                  </span>
                ) : (
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="rounded-full px-3 py-1.5 text-xs font-semibold text-terracotta-600 hover:bg-terracotta-500/10"
                  >
                    Quitar
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function SyncTab({
  calendars,
  exportUrl,
  onChanged,
  onNotice,
}: {
  calendars: ExternalCalendar[] | null;
  exportUrl: string;
  onChanged: () => void;
  onNotice: (msg: string) => void;
}) {
  const [name, setName] = useState("Booking.com");
  const [icalUrl, setIcalUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(exportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable; the URL is still selectable as text
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/ical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, icalUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al añadir el calendario.");
      setIcalUrl("");
      onNotice(
        data.calendar?.lastSyncError
          ? `Calendario añadido, pero falló la primera sincronización: ${data.calendar.lastSyncError}`
          : "Calendario conectado y sincronizado."
      );
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Desconectar este calendario? Sus fechas bloqueadas se liberarán.")) return;
    const res = await fetch("/api/admin/ical", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      onNotice("Calendario desconectado.");
      onChanged();
    }
  }

  async function handleSyncNow() {
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/ical/sync", { method: "POST" });
      if (res.ok) {
        onNotice("Sincronización completada.");
        onChanged();
      }
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="grid gap-8">
      <div className="rounded-xl border border-stone-200 bg-white p-5">
        <p className="font-display text-lg text-stone-900">
          1. Exporta tu calendario a Booking.com
        </p>
        <p className="mt-2 text-sm text-stone-600">
          Copia este enlace y pégalo en Booking.com Extranet → Tarifas y
          disponibilidad → Sincronizar calendarios → &ldquo;Exportar
          calendario&rdquo; (import URL). Así Booking.com verá las reservas
          hechas en tu web.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            readOnly
            value={exportUrl}
            onFocus={(e) => e.target.select()}
            className="min-w-0 flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-600"
          />
          <button
            onClick={handleCopy}
            className="shrink-0 rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800"
          >
            {copied ? "¡Copiado!" : "Copiar"}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-lg text-stone-900">
            2. Importa el calendario de Booking.com
          </p>
          <button
            onClick={handleSyncNow}
            disabled={syncing}
            className="rounded-full border border-stone-300 px-4 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-60"
          >
            {syncing ? "Sincronizando…" : "Sincronizar ahora"}
          </button>
        </div>
        <p className="mt-2 text-sm text-stone-600">
          En Booking.com Extranet, en la misma sección, copia el enlace de
          &ldquo;Exportar calendario&rdquo; de Booking.com y pégalo aquí. Se
          sincroniza automáticamente cada 30 minutos, y también puedes
          forzarlo con el botón de arriba.
        </p>
        <p className="mt-2 text-xs text-terracotta-600">
          Ojo: Booking.com solo actualiza su feed cada pocas horas, así que
          existe un pequeño margen en el que una reserva muy reciente en
          Booking.com podría no reflejarse aún aquí.
        </p>

        <form onSubmit={handleAdd} className="mt-4 grid gap-3 sm:grid-cols-[160px_1fr_auto]">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre (Booking.com)"
            className="rounded-lg border border-stone-200 px-3 py-2 text-sm"
          />
          <input
            required
            type="url"
            value={icalUrl}
            onChange={(e) => setIcalUrl(e.target.value)}
            placeholder="https://admin.booking.com/hotel/hoteladmin/ical.html?..."
            className="rounded-lg border border-stone-200 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-terracotta-500 px-4 py-2 text-sm font-semibold text-white hover:bg-terracotta-600 disabled:opacity-60"
          >
            {submitting ? "Añadiendo…" : "Conectar"}
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-terracotta-600">{error}</p>}

        <div className="mt-5 grid gap-3">
          {!calendars ? (
            <p className="text-sm text-stone-500">Cargando…</p>
          ) : calendars.length === 0 ? (
            <p className="rounded-lg border border-dashed border-stone-300 p-4 text-center text-sm text-stone-500">
              Todavía no has conectado ningún calendario externo.
            </p>
          ) : (
            calendars.map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-stone-200 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-stone-900">{c.name}</p>
                  <p className="text-xs text-stone-500">
                    {c.lastSyncedAt
                      ? `Última sincronización: ${new Date(c.lastSyncedAt).toLocaleString("es-ES")} · ${c.lastSyncCount ?? 0} eventos`
                      : "Todavía sin sincronizar"}
                  </p>
                  {c.lastSyncError && (
                    <p className="text-xs text-terracotta-600">Error: {c.lastSyncError}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-terracotta-600 hover:bg-terracotta-500/10"
                >
                  Desconectar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsTab({
  settings,
  onChanged,
  onNotice,
}: {
  settings: Settings | null;
  onChanged: () => void;
  onNotice: (msg: string) => void;
}) {
  const [form, setForm] = useState<Settings | null>(settings);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync freshly-loaded settings into the editable form
    if (settings) setForm(settings);
  }, [settings]);

  if (!form) return <p className="text-stone-500">Cargando ajustes…</p>;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar.");
      onNotice("Ajustes guardados.");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid max-w-2xl gap-6 rounded-xl border border-stone-200 bg-white p-6"
    >
      <div>
        <p className="font-display text-lg text-stone-900">Ajustes generales</p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <label className="grid gap-1 text-sm text-stone-700">
            Estancia mínima (noches)
            <input
              type="number"
              min={1}
              value={form.minNights}
              onChange={(e) => setForm({ ...form, minNights: Number(e.target.value) })}
              className="rounded-lg border border-stone-200 px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm text-stone-700">
            Moneda
            <input
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="rounded-lg border border-stone-200 px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm text-stone-700">
            Huéspedes incluidos en el precio base
            <input
              type="number"
              min={1}
              value={form.baseGuests}
              onChange={(e) => setForm({ ...form, baseGuests: Number(e.target.value) })}
              className="rounded-lg border border-stone-200 px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm text-stone-700">
            Huéspedes máximos
            <input
              type="number"
              min={1}
              value={form.maxGuests}
              onChange={(e) => setForm({ ...form, maxGuests: Number(e.target.value) })}
              className="rounded-lg border border-stone-200 px-3 py-2"
            />
          </label>
        </div>
        <p className="mt-2 text-xs text-stone-500">
          Por ejemplo, si el precio base es para 2 huéspedes y el máximo son 6,
          en la pestaña «Precios» puedes añadir un recargo en % para 3, 4, 5 y
          6 huéspedes.
        </p>
      </div>

      <div className="grid gap-4 border-t border-stone-200 pt-6">
        <p className="font-display text-lg text-stone-900">Contacto</p>
        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1 text-sm text-stone-700">
            Email de contacto
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              className="rounded-lg border border-stone-200 px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm text-stone-700">
            Teléfono de contacto
            <input
              value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              className="rounded-lg border border-stone-200 px-3 py-2"
            />
          </label>
        </div>
        <label className="grid gap-1 text-sm text-stone-700">
          Enlace a la ficha de Google Maps
          <input
            type="url"
            value={form.googleMapsUrl}
            onChange={(e) => setForm({ ...form, googleMapsUrl: e.target.value })}
            placeholder="https://maps.app.goo.gl/..."
            className="rounded-lg border border-stone-200 px-3 py-2"
          />
          <span className="text-xs text-stone-500">
            Se usa en el botón «Ver en Google Maps». Si lo dejas en blanco, se
            genera una búsqueda automática con la dirección.
          </span>
        </label>
        <label className="grid gap-1 text-sm text-stone-700">
          Enlace para dejar una reseña en Google
          <input
            type="url"
            value={form.googleReviewUrl}
            onChange={(e) => setForm({ ...form, googleReviewUrl: e.target.value })}
            placeholder="https://maps.app.goo.gl/... o el enlace de «Pedir reseñas»"
            className="rounded-lg border border-stone-200 px-3 py-2"
          />
          <span className="text-xs text-stone-500">
            Si lo dejas en blanco, no se muestra el botón de «Déjanos tu
            opinión» en la web.
          </span>
        </label>
        <label className="grid gap-1 text-sm text-stone-700">
          Número de licencia de vivienda de uso turístico
          <input
            value={form.licenseNumber}
            onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
            placeholder="G-110937"
            className="rounded-lg border border-stone-200 px-3 py-2"
          />
          <span className="text-xs text-stone-500">
            Se muestra en el pie de página. Solo el número de licencia; no
            pongas aquí DNI ni otros datos del registro.
          </span>
        </label>
      </div>

      <div className="grid gap-4 border-t border-stone-200 pt-6">
        <p className="font-display text-lg text-stone-900">Contenido de la página principal</p>
        <p className="text-xs text-stone-500">
          Déjalos en blanco para usar el texto por defecto de la web.
        </p>
        <label className="grid gap-1 text-sm text-stone-700">
          Título principal
          <input
            value={form.heroTitle}
            onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
            placeholder="Céntrico. Cómodo. Para hasta 6."
            className="rounded-lg border border-stone-200 px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm text-stone-700">
          Subtítulo
          <textarea
            value={form.heroSubtitle}
            onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
            rows={3}
            className="resize-none rounded-lg border border-stone-200 px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm text-stone-700">
          Texto «El apartamento» (usa una línea en blanco entre párrafos)
          <textarea
            value={form.aboutText}
            onChange={(e) => setForm({ ...form, aboutText: e.target.value })}
            rows={6}
            className="resize-none rounded-lg border border-stone-200 px-3 py-2"
          />
        </label>
      </div>

      {error && <p className="text-sm text-terracotta-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-fit rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-600 disabled:opacity-60"
      >
        {submitting ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}

// Las fotos de móvil suelen pesar 4-8 MB, muy por encima de lo que admite
// el servidor. Las reducimos en el propio navegador antes de subirlas.
async function compressImageFile(file: File, maxDim = 2200, quality = 0.85): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    bitmap = await createImageBitmap(file);
  }
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se ha podido procesar la imagen.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("No se ha podido comprimir la imagen."))),
      "image/jpeg",
      quality
    );
  });
}

function PhotosTab({
  photos,
  onChanged,
  onNotice,
}: {
  photos: Photo[] | null;
  onChanged: () => void;
  onNotice: (msg: string) => void;
}) {
  const [section, setSection] = useState<"hero" | "galeria">("galeria");
  const [alt, setAlt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setSubmitting(true);
    setError(null);
    try {
      let uploadBlob: Blob = file;
      let uploadName = file.name;
      try {
        uploadBlob = await compressImageFile(file);
        uploadName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
      } catch {
        // El navegador no ha podido procesarla (p. ej. HEIC en Chrome/Firefox):
        // se sube el archivo original y que el servidor dé el mensaje de error.
      }
      const formData = new FormData();
      formData.append("file", uploadBlob, uploadName);
      formData.append("section", section);
      formData.append("alt", alt);
      const res = await fetch("/api/admin/photos", { method: "POST", body: formData });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          data?.error ||
            (res.status === 413
              ? "La foto pesa demasiado para subirla así, prueba con una más ligera (máximo 4 MB)."
              : `Error al subir la foto (código ${res.status}).`)
        );
      }
      setFile(null);
      setAlt("");
      onNotice("Foto subida.");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta foto?")) return;
    const res = await fetch("/api/admin/photos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      onNotice("Foto eliminada.");
      onChanged();
    }
  }

  const heroPhotos = photos?.filter((p) => p.section === "hero") ?? [];
  const galeriaPhotos = photos?.filter((p) => p.section === "galeria") ?? [];

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <form
        onSubmit={handleUpload}
        className="grid h-fit gap-4 rounded-xl border border-stone-200 bg-white p-5"
      >
        <p className="font-display text-lg text-stone-900">Añadir foto</p>
        <label className="grid gap-1 text-sm text-stone-700">
          Dónde aparece
          <select
            value={section}
            onChange={(e) => setSection(e.target.value as "hero" | "galeria")}
            className="rounded-lg border border-stone-200 px-3 py-2"
          >
            <option value="galeria">Galería</option>
            <option value="hero">Foto principal (portada)</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm text-stone-700">
          Archivo (foto del móvil o del ordenador)
          <input
            type="file"
            required
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="rounded-lg border border-stone-200 px-3 py-2 text-sm"
          />
          <span className="text-xs text-stone-500">
            Se reduce automáticamente antes de subirla, así que no importa si
            pesa mucho. Si aun así da error, puede que esté en formato HEIC
            (típico de iPhone): conviértela a JPG primero.
          </span>
        </label>
        <label className="grid gap-1 text-sm text-stone-700">
          Descripción (opcional)
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Salón con vigas de madera"
            className="rounded-lg border border-stone-200 px-3 py-2"
          />
        </label>
        {error && <p className="text-sm text-terracotta-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !file}
          className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-60"
        >
          {submitting ? "Subiendo…" : "Subir foto"}
        </button>
      </form>

      <div className="grid gap-8">
        <div>
          <p className="font-display text-lg text-stone-900">Foto principal (portada)</p>
          <p className="text-xs text-stone-500">
            Si no subes ninguna, se usa la foto por defecto de la web.
          </p>
          {heroPhotos.length === 0 ? (
            <p className="mt-3 rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">
              Sin foto de portada personalizada todavía.
            </p>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {heroPhotos.map((p) => (
                <PhotoThumb key={p.id} photo={p} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="font-display text-lg text-stone-900">Galería</p>
          <p className="text-xs text-stone-500">
            Lo que subas aquí se añade a las fotos que ya tiene la web, no las
            sustituye.
          </p>
          {galeriaPhotos.length === 0 ? (
            <p className="mt-3 rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">
              Todavía no has subido fotos a la galería.
            </p>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {galeriaPhotos.map((p) => (
                <PhotoThumb key={p.id} photo={p} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PhotoThumb({
  photo,
  onDelete,
}: {
  photo: Photo;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
      {/* Fotos dinámicas servidas desde la base de datos vía /api/photos/[id]; next/image no aporta aquí. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/api/photos/${photo.id}`}
        alt={photo.alt || "Foto"}
        className="aspect-square w-full object-cover"
      />
      <button
        onClick={() => onDelete(photo.id)}
        className="absolute top-1.5 right-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-terracotta-600 opacity-0 shadow transition group-hover:opacity-100"
      >
        Eliminar
      </button>
    </div>
  );
}

function PricingTab({
  settings,
  seasonalRates,
  guestRates,
  dateRates,
  onChanged,
  onNotice,
}: {
  settings: Settings | null;
  seasonalRates: SeasonalRate[] | null;
  guestRates: GuestRate[] | null;
  dateRates: DateRate[] | null;
  onChanged: () => void;
  onNotice: (msg: string) => void;
}) {
  const [pricePerNight, setPricePerNight] = useState(0);
  const [cleaningFee, setCleaningFee] = useState(0);
  const [months, setMonths] = useState<(number | "")[]>(Array(12).fill(""));
  const [monthsMinNights, setMonthsMinNights] = useState<(number | "")[]>(Array(12).fill(""));
  const [guestPercents, setGuestPercents] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (settings) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync freshly-loaded settings into the editable form
      setPricePerNight(settings.pricePerNight);
      setCleaningFee(settings.cleaningFee);
    }
  }, [settings]);

  useEffect(() => {
    if (seasonalRates) {
      const priceByMonth = new Map(seasonalRates.map((r) => [r.month, r.pricePerNight]));
      const minNightsByMonth = new Map(seasonalRates.map((r) => [r.month, r.minNights]));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync freshly-loaded rates into the editable form
      setMonths(Array.from({ length: 12 }, (_, i) => priceByMonth.get(i + 1) ?? ""));
      setMonthsMinNights(Array.from({ length: 12 }, (_, i) => minNightsByMonth.get(i + 1) ?? ""));
    }
  }, [seasonalRates]);

  useEffect(() => {
    if (guestRates && settings) {
      const byGuests = new Map(guestRates.map((r) => [r.guests, r.percent]));
      const next: Record<number, number> = {};
      for (let g = settings.baseGuests + 1; g <= settings.maxGuests; g++) {
        next[g] = byGuests.get(g) ?? 0;
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync freshly-loaded rates into the editable form
      setGuestPercents(next);
    }
  }, [guestRates, settings]);

  if (!settings || !seasonalRates || !guestRates || !dateRates) {
    return <p className="text-stone-500">Cargando precios…</p>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const settingsRes = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, pricePerNight, cleaningFee }),
      });
      const pricingRes = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seasonalRates: months.map((price, i) => ({
            month: i + 1,
            pricePerNight: price === "" ? null : Number(price),
            minNights: monthsMinNights[i] === "" ? null : Number(monthsMinNights[i]),
          })),
          guestRates: Object.entries(guestPercents).map(([guests, percent]) => ({
            guests: Number(guests),
            percent: Number(percent),
          })),
        }),
      });
      if (!settingsRes.ok || !pricingRes.ok) {
        const data = !settingsRes.ok ? await settingsRes.json() : await pricingRes.json();
        throw new Error(data.error || "Error al guardar los precios.");
      }
      onNotice("Precios guardados.");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  const surchargeGuests = Array.from(
    { length: Math.max(0, settings.maxGuests - settings.baseGuests) },
    (_, i) => settings.baseGuests + 1 + i
  );

  return (
    <div className="grid max-w-3xl gap-8">
    <form onSubmit={handleSubmit} className="grid gap-8">
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <p className="font-display text-lg text-stone-900">Precio base</p>
        <p className="mt-1 text-xs text-stone-500">
          Se usa en los meses en los que no fijes un precio de temporada abajo.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <label className="grid gap-1 text-sm text-stone-700">
            Precio / noche (€)
            <input
              type="number"
              min={0}
              step="0.01"
              value={pricePerNight}
              onChange={(e) => setPricePerNight(Number(e.target.value))}
              className="rounded-lg border border-stone-200 px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm text-stone-700">
            Tasa de limpieza (€)
            <input
              type="number"
              min={0}
              step="0.01"
              value={cleaningFee}
              onChange={(e) => setCleaningFee(Number(e.target.value))}
              className="rounded-lg border border-stone-200 px-3 py-2"
            />
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <p className="font-display text-lg text-stone-900">Precios y estancia mínima por temporada</p>
        <p className="mt-1 text-xs text-stone-500">
          Fija un precio y/o una estancia mínima distinta por mes (por
          ejemplo, más caro y con más noches mínimas en julio y agosto). Deja
          los campos vacíos para usar el precio y la estancia mínima base.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {MONTH_NAMES.map((name, i) => (
            <div key={name} className="grid gap-1.5 rounded-lg border border-stone-200 p-2.5">
              <p className="text-sm font-medium text-stone-800">{name}</p>
              <label className="grid gap-0.5 text-xs text-stone-600">
                Precio (€)
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder={`${pricePerNight}`}
                  value={months[i]}
                  onChange={(e) => {
                    const value = e.target.value === "" ? "" : Number(e.target.value);
                    setMonths((m) => m.map((v, idx) => (idx === i ? value : v)));
                  }}
                  className="rounded-lg border border-stone-200 px-2.5 py-1.5"
                />
              </label>
              <label className="grid gap-0.5 text-xs text-stone-600">
                Estancia mínima
                <input
                  type="number"
                  min={1}
                  placeholder={`${settings.minNights}`}
                  value={monthsMinNights[i]}
                  onChange={(e) => {
                    const value = e.target.value === "" ? "" : Number(e.target.value);
                    setMonthsMinNights((m) => m.map((v, idx) => (idx === i ? value : v)));
                  }}
                  className="rounded-lg border border-stone-200 px-2.5 py-1.5"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <p className="font-display text-lg text-stone-900">Recargo por número de huéspedes</p>
        <p className="mt-1 text-xs text-stone-500">
          El precio base es para {settings.baseGuests} huéspedes. Añade un
          recargo en % sobre el precio de las noches para reservas con más
          gente. Se aplica solo al alojamiento, no a la limpieza.
        </p>
        {surchargeGuests.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">
            Sube «Huéspedes máximos» por encima de «Huéspedes incluidos en el
            precio base» en la pestaña Contenido y ajustes para poder añadir
            recargos.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {surchargeGuests.map((g) => (
              <label key={g} className="grid gap-1 text-sm text-stone-700">
                {g} huéspedes
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.1"
                    value={guestPercents[g] ?? 0}
                    onChange={(e) =>
                      setGuestPercents((p) => ({ ...p, [g]: Number(e.target.value) }))
                    }
                    className="w-full rounded-lg border border-stone-200 px-3 py-2"
                  />
                  <span className="text-stone-500">%</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-terracotta-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-fit rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-600 disabled:opacity-60"
      >
        {submitting ? "Guardando…" : "Guardar precios"}
      </button>
    </form>

      <DateRatesEditor
        dateRates={dateRates}
        fallbackPrice={pricePerNight}
        onChanged={onChanged}
        onNotice={onNotice}
      />
    </div>
  );
}

function DateRatesEditor({
  dateRates,
  fallbackPrice,
  onChanged,
  onNotice,
}: {
  dateRates: DateRate[];
  fallbackPrice: number;
  onChanged: () => void;
  onNotice: (msg: string) => void;
}) {
  const [selected, setSelected] = useState<Date | undefined>();
  const [price, setPrice] = useState("");
  const [minNights, setMinNights] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [rangeMinNights, setRangeMinNights] = useState("");
  const [rangePrice, setRangePrice] = useState("");
  const [rangeSubmitting, setRangeSubmitting] = useState(false);
  const [rangeError, setRangeError] = useState<string | null>(null);

  const rateByIso = new Map(dateRates.map((r) => [r.date, r]));

  function isoOf(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  }

  function handleSelectDay(day: Date | undefined) {
    setSelected(day);
    setError(null);
    const existing = day ? rateByIso.get(isoOf(day)) : undefined;
    setPrice(existing?.pricePerNight != null ? String(existing.pricePerNight) : "");
    setMinNights(existing?.minNights != null ? String(existing.minNights) : "");
  }

  async function handleSave() {
    if (!selected || (price === "" && minNights === "")) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: isoOf(selected),
          pricePerNight: price === "" ? null : Number(price),
          minNights: minNights === "" ? null : Number(minNights),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar.");
      onNotice("Día guardado.");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(dateIso: string) {
    const res = await fetch("/api/admin/pricing", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: dateIso }),
    });
    if (res.ok) {
      onNotice("Regla del día eliminada.");
      if (selected && isoOf(selected) === dateIso) {
        setSelected(undefined);
        setPrice("");
        setMinNights("");
      }
      onChanged();
    }
  }

  async function handleApplyRange(e: React.FormEvent) {
    e.preventDefault();
    if (!rangeStart || !rangeEnd || (rangeMinNights === "" && rangePrice === "")) return;
    setRangeSubmitting(true);
    setRangeError(null);
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: rangeStart,
          endDate: rangeEnd,
          pricePerNight: rangePrice === "" ? undefined : Number(rangePrice),
          minNights: rangeMinNights === "" ? undefined : Number(rangeMinNights),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al aplicar el rango.");
      onNotice("Rango de fechas aplicado.");
      setRangeStart("");
      setRangeEnd("");
      setRangeMinNights("");
      setRangePrice("");
      onChanged();
    } catch (err) {
      setRangeError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setRangeSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <p className="font-display text-lg text-stone-900">Precio y estancia mínima por día concreto</p>
        <p className="mt-1 text-xs text-stone-500">
          Para fechas puntuales (un puente, una feria, Nochevieja, o una
          noche suelta que se ha quedado libre entre dos reservas) que
          quieras tratar distinto al resto del mes. Esta regla manda sobre la
          de temporada y la base. Puedes rellenar solo el precio, solo la
          estancia mínima, o los dos.
        </p>
        <div className="mt-4 grid gap-6 sm:grid-cols-[auto_1fr]">
          <div className="overflow-x-auto">
            <DayPicker
              mode="single"
              locale={es}
              selected={selected}
              onSelect={handleSelectDay}
              modifiers={{ priced: (date) => rateByIso.has(isoOf(date)) }}
              modifiersClassNames={{ priced: "!bg-terracotta-500/15 !font-semibold" }}
              className="!m-0"
            />
          </div>
          <div>
            {selected ? (
              <div className="grid gap-3">
                <p className="text-sm font-medium text-stone-800">
                  {selected.toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-1 text-sm text-stone-700">
                    Precio esa noche (€)
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder={`${fallbackPrice}`}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full rounded-lg border border-stone-200 px-3 py-2"
                    />
                  </label>
                  <label className="grid gap-1 text-sm text-stone-700">
                    Estancia mínima
                    <input
                      type="number"
                      min={1}
                      placeholder="p. ej. 1"
                      value={minNights}
                      onChange={(e) => setMinNights(e.target.value)}
                      className="w-full rounded-lg border border-stone-200 px-3 py-2"
                    />
                  </label>
                </div>
                {error && <p className="text-sm text-terracotta-600">{error}</p>}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={submitting || (price === "" && minNights === "")}
                    className="rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800 disabled:opacity-60"
                  >
                    {submitting ? "Guardando…" : "Guardar día"}
                  </button>
                  {rateByIso.has(isoOf(selected)) && (
                    <button
                      type="button"
                      onClick={() => handleRemove(isoOf(selected))}
                      className="rounded-full px-4 py-2 text-xs font-semibold text-terracotta-600 hover:bg-terracotta-500/10"
                    >
                      Quitar regla del día
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-stone-500">
                Elige un día en el calendario para ponerle un precio o una
                estancia mínima especial.
              </p>
            )}

            {dateRates.length > 0 && (
              <div className="mt-6 grid gap-1.5 border-t border-stone-200 pt-4 text-sm">
                <p className="text-xs font-semibold tracking-wide text-stone-500 uppercase">
                  Días con regla especial
                </p>
                {dateRates
                  .slice()
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((r) => (
                    <div key={r.date} className="flex items-center justify-between">
                      <span className="text-stone-700">
                        {new Date(`${r.date}T00:00:00`).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="font-medium text-stone-900">
                          {r.pricePerNight != null && `${r.pricePerNight} €`}
                          {r.pricePerNight != null && r.minNights != null && " · "}
                          {r.minNights != null && `mín. ${r.minNights} noche${r.minNights === 1 ? "" : "s"}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemove(r.date)}
                          className="text-xs text-terracotta-600 hover:underline"
                        >
                          Quitar
                        </button>
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleApplyRange}
        className="rounded-xl border border-stone-200 bg-white p-6"
      >
        <p className="font-display text-lg text-stone-900">Aplicar a una semana o rango de fechas</p>
        <p className="mt-1 text-xs text-stone-500">
          Útil para fijar la estancia mínima de una semana o un puente
          concreto de una sola vez, en lugar de día a día.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <label className="grid gap-1 text-sm text-stone-700">
            Desde
            <input
              type="date"
              required
              value={rangeStart}
              onChange={(e) => setRangeStart(e.target.value)}
              className="rounded-lg border border-stone-200 px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm text-stone-700">
            Hasta
            <input
              type="date"
              required
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
              className="rounded-lg border border-stone-200 px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm text-stone-700">
            Estancia mínima
            <input
              type="number"
              min={1}
              placeholder="opcional"
              value={rangeMinNights}
              onChange={(e) => setRangeMinNights(e.target.value)}
              className="rounded-lg border border-stone-200 px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm text-stone-700">
            Precio / noche (€)
            <input
              type="number"
              min={0}
              step="0.01"
              placeholder="opcional"
              value={rangePrice}
              onChange={(e) => setRangePrice(e.target.value)}
              className="rounded-lg border border-stone-200 px-3 py-2"
            />
          </label>
        </div>
        {rangeError && <p className="mt-2 text-sm text-terracotta-600">{rangeError}</p>}
        <button
          type="submit"
          disabled={rangeSubmitting || (rangeMinNights === "" && rangePrice === "")}
          className="mt-4 rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800 disabled:opacity-60"
        >
          {rangeSubmitting ? "Aplicando…" : "Aplicar al rango"}
        </button>
      </form>
    </div>
  );
}

function DetallesTab({
  amenities,
  onChanged,
  onNotice,
}: {
  amenities: Amenity[] | null;
  onChanged: () => void;
  onNotice: (msg: string) => void;
}) {
  const [newLabel, setNewLabel] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!amenities) return <p className="text-stone-500">Cargando detalles…</p>;

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newLabel.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/amenities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al añadir.");
      setNewLabel("");
      onNotice("Detalle añadido.");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveEdit(id: string) {
    const label = drafts[id]?.trim();
    if (!label) return;
    const res = await fetch("/api/admin/amenities", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, label }),
    });
    if (res.ok) {
      onNotice("Detalle actualizado.");
      onChanged();
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch("/api/admin/amenities", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      onNotice("Detalle eliminado.");
      onChanged();
    }
  }

  async function handleMove(id: string, direction: -1 | 1) {
    const index = amenities!.findIndex((a) => a.id === id);
    const target = amenities![index + direction];
    if (!target) return;
    const current = amenities![index];
    await Promise.all([
      fetch("/api/admin/amenities", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: current.id, order: target.order }),
      }),
      fetch("/api/admin/amenities", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: target.id, order: current.order }),
      }),
    ]);
    onChanged();
  }

  return (
    <div className="grid max-w-2xl gap-6">
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <p className="font-display text-lg text-stone-900">
          Qué tiene el apartamento
        </p>
        <p className="mt-1 text-xs text-stone-500">
          Estas líneas aparecen en la portada, junto a la descripción del
          apartamento (camas, baños, balcón, comodidades…). Lo que añadas
          aquí se suma a la lista por defecto que ya tiene la web.
        </p>

        <form onSubmit={handleAdd} className="mt-4 flex gap-2">
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Ej: Balcón con vistas a la carretera general"
            className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={submitting || !newLabel.trim()}
            className="shrink-0 rounded-full bg-terracotta-500 px-4 py-2 text-sm font-semibold text-white hover:bg-terracotta-600 disabled:opacity-60"
          >
            Añadir
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-terracotta-600">{error}</p>}

        <div className="mt-5 grid gap-2">
          {amenities.length === 0 ? (
            <p className="rounded-lg border border-dashed border-stone-300 p-4 text-center text-sm text-stone-500">
              Todavía no has añadido ningún detalle propio; la web muestra la
              lista por defecto.
            </p>
          ) : (
            amenities.map((a, i) => (
              <div
                key={a.id}
                className="flex items-center gap-2 rounded-lg border border-stone-200 p-2.5"
              >
                <div className="flex flex-col">
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() => handleMove(a.id, -1)}
                    className="px-1 text-xs text-stone-400 hover:text-stone-700 disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={i === amenities.length - 1}
                    onClick={() => handleMove(a.id, 1)}
                    className="px-1 text-xs text-stone-400 hover:text-stone-700 disabled:opacity-30"
                  >
                    ▼
                  </button>
                </div>
                <input
                  value={drafts[a.id] ?? a.label}
                  onChange={(e) => setDrafts((d) => ({ ...d, [a.id]: e.target.value }))}
                  onBlur={() => drafts[a.id] !== undefined && handleSaveEdit(a.id)}
                  className="flex-1 rounded-lg border border-stone-200 px-3 py-1.5 text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(a.id)}
                  className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-terracotta-600 hover:bg-terracotta-500/10"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function FaqTab({
  faqItems,
  onChanged,
  onNotice,
}: {
  faqItems: FaqItem[] | null;
  onChanged: () => void;
  onNotice: (msg: string) => void;
}) {
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [drafts, setDrafts] = useState<Record<string, { question: string; answer: string }>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!faqItems) return <p className="text-stone-500">Cargando preguntas frecuentes…</p>;

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newQuestion.trim(), answer: newAnswer.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al añadir.");
      setNewQuestion("");
      setNewAnswer("");
      onNotice("Pregunta añadida.");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveEdit(id: string) {
    const draft = drafts[id];
    if (!draft) return;
    const res = await fetch("/api/admin/faq", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, question: draft.question.trim(), answer: draft.answer.trim() }),
    });
    if (res.ok) {
      onNotice("Pregunta actualizada.");
      onChanged();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta pregunta?")) return;
    const res = await fetch("/api/admin/faq", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      onNotice("Pregunta eliminada.");
      onChanged();
    }
  }

  async function handleMove(id: string, direction: -1 | 1) {
    const index = faqItems!.findIndex((f) => f.id === id);
    const target = faqItems![index + direction];
    if (!target) return;
    const current = faqItems![index];
    await Promise.all([
      fetch("/api/admin/faq", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: current.id, order: target.order }),
      }),
      fetch("/api/admin/faq", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: target.id, order: current.order }),
      }),
    ]);
    onChanged();
  }

  return (
    <div className="grid max-w-2xl gap-6">
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <p className="font-display text-lg text-stone-900">Preguntas frecuentes</p>
        <p className="mt-1 text-xs text-stone-500">
          Se muestran en la portada, antes del formulario de reserva. Útil
          para horarios de entrada y salida, mascotas, aparcamiento,
          cancelaciones… todo lo que te suelan preguntar antes de reservar.
        </p>

        <form onSubmit={handleAdd} className="mt-4 grid gap-2">
          <input
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Pregunta, ej: ¿A qué hora es el check-in?"
            className="rounded-lg border border-stone-200 px-3 py-2 text-sm"
          />
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Respuesta"
            rows={2}
            className="resize-none rounded-lg border border-stone-200 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={submitting || !newQuestion.trim() || !newAnswer.trim()}
            className="w-fit rounded-full bg-terracotta-500 px-4 py-2 text-sm font-semibold text-white hover:bg-terracotta-600 disabled:opacity-60"
          >
            Añadir pregunta
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-terracotta-600">{error}</p>}

        <div className="mt-5 grid gap-2">
          {faqItems.length === 0 ? (
            <p className="rounded-lg border border-dashed border-stone-300 p-4 text-center text-sm text-stone-500">
              Todavía no has añadido ninguna pregunta frecuente.
            </p>
          ) : (
            faqItems.map((f, i) => (
              <div key={f.id} className="flex items-start gap-2 rounded-lg border border-stone-200 p-2.5">
                <div className="mt-1 flex flex-col">
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() => handleMove(f.id, -1)}
                    className="px-1 text-xs text-stone-400 hover:text-stone-700 disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={i === faqItems.length - 1}
                    onClick={() => handleMove(f.id, 1)}
                    className="px-1 text-xs text-stone-400 hover:text-stone-700 disabled:opacity-30"
                  >
                    ▼
                  </button>
                </div>
                <div className="grid flex-1 gap-1.5">
                  <input
                    value={drafts[f.id]?.question ?? f.question}
                    onChange={(e) =>
                      setDrafts((d) => ({
                        ...d,
                        [f.id]: { question: e.target.value, answer: d[f.id]?.answer ?? f.answer },
                      }))
                    }
                    onBlur={() => drafts[f.id] !== undefined && handleSaveEdit(f.id)}
                    className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium"
                  />
                  <textarea
                    value={drafts[f.id]?.answer ?? f.answer}
                    onChange={(e) =>
                      setDrafts((d) => ({
                        ...d,
                        [f.id]: { question: d[f.id]?.question ?? f.question, answer: e.target.value },
                      }))
                    }
                    onBlur={() => drafts[f.id] !== undefined && handleSaveEdit(f.id)}
                    rows={2}
                    className="resize-none rounded-lg border border-stone-200 px-3 py-1.5 text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(f.id)}
                  className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-terracotta-600 hover:bg-terracotta-500/10"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
