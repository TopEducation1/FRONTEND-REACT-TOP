// src/pages/Success.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

async function getJSON(url) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const text = await res.text();
  const isJson = (res.headers.get("content-type") || "").includes("application/json");

  if (!isJson) {
    throw new Error(`No es JSON. Status ${res.status}. Primeros chars: ${text.slice(0, 160)}`);
  }

  const data = JSON.parse(text || "{}");
  if (!res.ok) {
    throw new Error(data?.error || data?.detail || `HTTP_${res.status}`);
  }
  return data;
}

export default function Success() {
  const q = useQuery();
  const sessionId = q.get("session_id");

  const backendBaseUrl = useMemo(() => {
    return (process.env.REACT_APP_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");
  }, []);

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("Procesando tu pago…");
  const [err, setErr] = useState("");

  // Datos opcionales de confirmación
  const [me, setMe] = useState(null);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setErr("");
        setLoading(true);

        if (!sessionId) {
          setMsg("Pago completado, pero no llegó session_id en la URL.");
          return;
        }

        // 1) Sync session -> guarda StripePurchase + StripeSubscription en tu DB
        setMsg("Confirmando pago con Stripe…");
        const sync = await getJSON(
          `${backendBaseUrl}/api/stripe/sync-session/?session_id=${encodeURIComponent(sessionId)}`
        );

        if (!alive) return;

        if (!sync?.ok) {
          throw new Error(sync?.error || "sync_failed");
        }

        // 2) Confirmar estado de la cuenta (opcional)
        setMsg("Activando tu suscripción…");
        const meRes = await getJSON(`${backendBaseUrl}/api/account/me/`);
        const purchasesRes = await getJSON(`${backendBaseUrl}/api/account/purchases/`);

        if (!alive) return;

        setMe(meRes?.data || null);
        setPurchases(purchasesRes?.data || []);
        setMsg("¡Pago completado! Tu suscripción ya debería estar activa ✅");
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || String(e));
        setMsg("No pudimos confirmar el pago automáticamente.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [backendBaseUrl, sessionId]);

  const lastPurchase = purchases?.[0];

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-slate-100 px-4">
      <div className="w-full max-w-xl border border-neutral-800 rounded-2xl p-6 bg-neutral-900">
        <h1 className="text-2xl font-semibold">Pago exitoso ✅</h1>

        <p className="mt-2 text-slate-300">{msg}</p>

        {loading && (
          <div className="mt-4 text-sm text-slate-400">
            Estamos validando tu transacción… (esto puede tardar unos segundos)
          </div>
        )}

        {err && (
          <pre className="mt-4 text-xs text-red-300 whitespace-pre-wrap border border-red-900/40 bg-red-950/20 p-3 rounded-xl">
            {err}
          </pre>
        )}

        {/* Resumen (si ya cargó) */}
        {!loading && !err && (
          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-neutral-800 p-4 bg-neutral-950/30">
              <div className="text-sm text-slate-400">Cuenta</div>
              <div className="mt-1 text-sm">
                <div>
                  <span className="text-slate-400">Email: </span>
                  <span className="font-medium">{me?.email || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-400">Suscripción: </span>
                  <span className="font-medium">{me?.subscription_status || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-400">Plan: </span>
                  <span className="font-medium">{me?.plan || "—"}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 p-4 bg-neutral-950/30">
              <div className="text-sm text-slate-400">Última compra</div>
              <div className="mt-1 text-sm">
                <div>
                  <span className="text-slate-400">Estado: </span>
                  <span className="font-medium">{lastPurchase?.status || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-400">Tipo: </span>
                  <span className="font-medium">{lastPurchase?.type || "—"}</span>
                </div>
                <div className="break-all">
                  <span className="text-slate-400">session_id: </span>
                  <span className="font-mono text-xs">{sessionId}</span>
                </div>
              </div>

              {lastPurchase?.hosted_invoice_url && (
                <a
                  href={lastPurchase.hosted_invoice_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 text-sm underline text-emerald-300 hover:text-emerald-200"
                >
                  Ver factura (Stripe)
                </a>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            to="/account"
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-semibold"
          >
            Ir a mi cuenta
          </Link>
          <Link
            to="/"
            className="px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-800"
          >
            Volver al inicio
          </Link>
        </div>

        <div className="mt-4 text-xs text-slate-500">
          Tip: si ves error, revisa que <span className="font-mono">REACT_APP_API_URL</span> apunte al backend correcto.
        </div>
      </div>
    </main>
  );
}
