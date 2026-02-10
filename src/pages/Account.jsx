// src/pages/Account.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

async function getJSON(url) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();
  const isJson = contentType.includes("application/json");

  if (!isJson) {
    throw Object.assign(
      new Error(
        `No es JSON. Status ${res.status}. Probable redirect/login/404.\nPrimeros caracteres:\n${text.slice(
          0,
          200
        )}`
      ),
      { code: "not_json", status: res.status, body: text }
    );
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw Object.assign(
      new Error(`JSON inválido. Status ${res.status}.\nBody:\n${text.slice(0, 200)}`),
      { code: "bad_json", status: res.status, body: text }
    );
  }

  if (data?.error === "not_authenticated" || res.status === 401) {
    throw Object.assign(new Error("not_authenticated"), {
      code: "not_authenticated",
      status: res.status,
      data,
    });
  }

  if (!res.ok) {
    throw Object.assign(
      new Error(data?.error || data?.detail || `HTTP ${res.status}`),
      { code: "http_error", status: res.status, data }
    );
  }

  return data;
}

function fmtDate(v) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString();
}

const ZERO_DECIMAL = new Set([
  "bif","clp","djf","gnf","jpy","kmf","krw","mga","pyg","rwf","ugx","vnd","vuv","xaf","xof","xpf","cop",
]);

function money(amount, currency) {
  if (amount == null || amount === "") return "—";
  const cur = (currency || "").toLowerCase() || "usd";

  const n = Number(amount);
  if (Number.isNaN(n)) return String(amount);

  const value = ZERO_DECIMAL.has(cur) ? n : n / 100;

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: cur.toUpperCase(),
      maximumFractionDigits: ZERO_DECIMAL.has(cur) ? 0 : 2,
    }).format(value);
  } catch {
    return `${value} ${cur.toUpperCase()}`;
  }
}

function normalizePurchases(raw) {
  const arr = Array.isArray(raw) ? raw : [];
  return arr.map((p) => {
    const session_id = p?.session_id || p?.stripe_checkout_session_id || null;
    const invoice_id = p?.invoice_id || p?.stripe_invoice_id || null;
    const payment_intent = p?.payment_intent || p?.stripe_payment_intent_id || null;

    const amount =
      p?.amount ??
      p?.amount_total ??
      p?.total ??
      p?.amount_paid ??
      p?.amount_due ??
      null;

    return {
      id: p?.id ?? null,
      created_at: p?.created_at || p?.created || p?.date || null,
      type: p?.type || p?.kind || "checkout",
      amount,
      currency: p?.currency || "usd",
      status: p?.status || "—",
      session_id,
      invoice_id,
      payment_intent,
      hosted_invoice_url: p?.hosted_invoice_url || null,
      invoice_pdf: p?.invoice_pdf || null,
      description: p?.description || "",
      reference: session_id || invoice_id || payment_intent || "—",
    };
  });
}

export default function Account() {
  const navigate = useNavigate();

  const backendBaseUrl = useMemo(() => {
    const fromEnv = process.env.REACT_APP_API_URL || "";
    return (fromEnv || "http://localhost:8000").replace(/\/+$/, "");
  }, []);

  const ME_URL = `${backendBaseUrl}/api/account/me/`;
  const PURCHASES_URL = `${backendBaseUrl}/api/account/purchases/`;

  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  async function load() {
    setErrorMsg("");
    setLoading(true);

    try {
      const [meRes, purchasesRes] = await Promise.all([
        getJSON(ME_URL),
        getJSON(PURCHASES_URL),
      ]);

      // /api/account/me/ => {ok:true, data:{...}}
      const user = meRes?.data || meRes;

      // ✅ /api/account/purchases/ puede venir como:
      // {ok:true, data:[...]} o {ok:true, items:[...]}
      const rawList =
        purchasesRes?.data ??
        purchasesRes?.items ??
        purchasesRes?.results ??
        (Array.isArray(purchasesRes) ? purchasesRes : []);

      const normalized = normalizePurchases(rawList);

      setMe(user);
      setPurchases(normalized);
    } catch (e) {
      console.error(e);

      if (e?.code === "not_authenticated" || e?.message === "not_authenticated") {
        navigate("/login", { replace: true, state: { from: "/account" } });
        return;
      }

      setErrorMsg(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-200">
        Cargando tu cuenta...
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="max-w-5xl mx-auto mt-40 mb-40 p-4 text-slate-200">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <div className="font-semibold mb-2">No se pudo cargar tu cuenta</div>
          <pre className="text-xs whitespace-pre-wrap break-words">{errorMsg}</pre>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={load}
              className="px-4 py-2 rounded-lg border border-slate-500 hover:bg-slate-800"
            >
              Reintentar
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-lg border border-emerald-400/60 text-emerald-200 hover:bg-emerald-900/20"
            >
              Ir a login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-20 text-slate-100">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold">Mi cuenta</h1>
          <p className="text-slate-300 mt-1">
            Administra tu suscripción e historial de pagos.
          </p>
        </div>

        <button
          onClick={load}
          className="px-4 py-2 rounded-lg border bg-blue-600 border-blue-500 hover:bg-blue-800 w-fit"
        >
          Actualizar
        </button>
      </div>

      {/* PERFIL */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-700 bg-neutral-900 p-5">
          <div className="text-sm text-slate-300">Usuario</div>
          <div className="mt-1 text-xl font-semibold">
            {me?.full_name ||
              [me?.first_name, me?.last_name].filter(Boolean).join(" ") ||
              me?.username ||
              "—"}
          </div>
          <div className="mt-2 text-sm text-slate-300">
            <div>
              <span className="text-slate-400">Email:</span> {me?.email || "—"}
            </div>
            <div className="mt-1">
              <span className="text-slate-400">Stripe customer:</span>{" "}
              <span className="font-mono text-xs">
                {me?.stripe_customer_id || "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-neutral-900 p-5">
          <div className="text-sm text-slate-300">Suscripción</div>
          <div className="mt-2 text-sm text-slate-200">
            <div>
              <span className="text-slate-400">Estado:</span>{" "}
              <span className="font-semibold">{me?.subscription_status || "—"}</span>
            </div>
            <div className="mt-1">
              <span className="text-slate-400">Plan:</span> {me?.plan || "—"}
            </div>
            <div className="mt-1">
              <span className="text-slate-400">Renueva:</span>{" "}
              {fmtDate(me?.current_period_end)}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-neutral-900 p-5">
          <div className="text-sm text-slate-300">Acciones</div>
          <div className="mt-3 flex flex-col gap-2">
            <a
              href="/empieza-ahora"
              className="px-4 py-2 rounded-lg border bg-blue-600 border-slate-600 hover:bg-slate-800 text-center"
            >
              Ver planes
            </a>
            <a
              href="/support"
              className="px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-800 text-center"
            >
              Soporte
            </a>
          </div>
        </div>
      </div>

      {/* HISTORIAL */}
      <div className="mt-8 rounded-xl border border-slate-700 bg-neutral-900 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Historial de compras</h2>
          <span className="text-sm text-slate-400">{purchases.length} registro(s)</span>
        </div>

        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-slate-300">
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 pr-3">Fecha</th>
                <th className="text-left py-2 pr-3">Tipo</th>
                <th className="text-left py-2 pr-3">Monto</th>
                <th className="text-left py-2 pr-3">Estado</th>
                <th className="text-left py-2 pr-3">Referencia</th>
              </tr>
            </thead>

            <tbody>
              {purchases.map((p, idx) => (
                <tr key={p.id || p.reference || idx} className="border-b border-slate-800">
                  <td className="py-2 pr-3 text-slate-200">{fmtDate(p.created_at)}</td>
                  <td className="py-2 pr-3 text-slate-200">{p.type}</td>
                  <td className="py-2 pr-3 text-slate-200">{money(p.amount, p.currency)}</td>
                  <td className="py-2 pr-3 text-slate-200">{p.status}</td>
                  <td className="py-2 pr-3 text-slate-400 font-mono text-xs">
                    <div className="break-all">{p.reference}</div>
                    {(p.hosted_invoice_url || p.invoice_pdf) && (
                      <div className="mt-1 flex gap-3 font-sans">
                        {p.hosted_invoice_url && (
                          <a
                            href={p.hosted_invoice_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-300 hover:text-emerald-200 underline"
                          >
                            Ver factura
                          </a>
                        )}
                        {p.invoice_pdf && (
                          <a
                            href={p.invoice_pdf}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-300 hover:text-sky-200 underline"
                          >
                            PDF
                          </a>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {purchases.length === 0 ? (
                <tr>
                  <td className="py-4 text-slate-400" colSpan={5}>
                    Aún no hay compras registradas.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
