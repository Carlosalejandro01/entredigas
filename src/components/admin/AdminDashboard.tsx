"use client";

import { useEffect, useState } from "react";

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
};

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

type Tab = "reservas" | "bloqueos" | "sync" | "ajustes";

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
  const [notice, setNotice] = useState<string | null>(null);

  async function loadAll() {
    const [b, s, bl, ic] = await Promise.all([
      fetch("/api/admin/bookings").then((r) => r.json()),
      fetch("/api/admin/settings").then((r) => r.json()),
      fetch("/api/admin/blocked").then((r) => r.json()),
      fetch("/api/admin/ical").then((r) => r.json()),
    ]);
    setBookings(b.bookings ?? []);
    setSettings(s.settings ?? null);
    setBlocked(bl.blocked ?? []);
    setCalendars(ic.calendars ?? []);
    setExportUrl(ic.exportUrl ?? "");
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
        <div className="mx-auto flex max-w-5xl gap-1 px-5">
          {(
            [
              ["reservas", "Reservas"],
              ["bloqueos", "Bloqueos manuales"],
              ["sync", "Booking.com / iCal"],
              ["ajustes", "Precios y ajustes"],
            ] as [Tab, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`border-b-2 px-3 py-2.5 text-sm font-medium transition ${
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
      className="grid max-w-lg gap-4 rounded-xl border border-stone-200 bg-white p-6"
    >
      <p className="font-display text-lg text-stone-900">Precios y ajustes</p>
      <div className="grid grid-cols-2 gap-4">
        <label className="grid gap-1 text-sm text-stone-700">
          Precio / noche (€)
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.pricePerNight}
            onChange={(e) =>
              setForm({ ...form, pricePerNight: Number(e.target.value) })
            }
            className="rounded-lg border border-stone-200 px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm text-stone-700">
          Tasa de limpieza (€)
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.cleaningFee}
            onChange={(e) =>
              setForm({ ...form, cleaningFee: Number(e.target.value) })
            }
            className="rounded-lg border border-stone-200 px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm text-stone-700">
          Estancia mínima (noches)
          <input
            type="number"
            min={1}
            value={form.minNights}
            onChange={(e) =>
              setForm({ ...form, minNights: Number(e.target.value) })
            }
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
      </div>
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
