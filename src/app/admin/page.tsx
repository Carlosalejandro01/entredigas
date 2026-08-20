"use client";

import { useEffect, useState } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((res) => setAuthed(res.ok))
      .catch(() => setAuthed(false));
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión.");
      setAuthed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-900 text-stone-400">
        Cargando…
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-900 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-stone-800 p-8 shadow-xl"
        >
          <p className="font-display text-2xl text-white">Entre Vigas</p>
          <p className="mt-1 text-sm text-stone-400">Panel del propietario</p>
          <label className="mt-6 grid gap-1 text-sm text-stone-300">
            Contraseña
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-white/10 bg-stone-900 px-3 py-2 text-white outline-none focus:border-terracotta-500"
            />
          </label>
          {error && <p className="mt-3 text-sm text-terracotta-500">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-terracotta-600 disabled:opacity-60"
          >
            {submitting ? "Accediendo…" : "Acceder"}
          </button>
        </form>
      </div>
    );
  }

  return <AdminDashboard onLogout={() => setAuthed(false)} />;
}
