import React, { useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

function getCookie(name) {
  const v = `; ${document.cookie}`;
  const parts = v.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return "";
}

async function safeReadJson(res) {
  const text = await res.text();
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  const isJson = ct.includes("application/json");
  return { isJson, text, json: isJson ? JSON.parse(text) : null };
}

export default function ResetPassword() {
  const nav = useNavigate();
  const [params] = useSearchParams();

  const API = useMemo(() => {
    const fromEnv = process.env.REACT_APP_API_URL || "";
    return (fromEnv || "http://localhost:8000").replace(/\/+$/, "");
  }, []);

  const uid = params.get("uid") || "";
  const token = params.get("token") || "";

  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");

  async function ensureCsrf() {
    await fetch(`${API}/api/auth/csrf/`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setOkMsg("");

    if (!uid || !token) {
      return setErr("Link inválido: faltan parámetros uid/token.");
    }
    if (password1.length < 8) return setErr("La contraseña debe tener mínimo 8 caracteres.");
    if (password1 !== password2) return setErr("Las contraseñas no coinciden.");

    setLoading(true);
    try {
      await ensureCsrf();
      const csrftoken = getCookie("csrftoken");

      const res = await fetch(`${API}/api/auth/password/reset/confirm/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({
          uid,
          token,
          new_password: password1,
        }),
      });

      const { isJson, json, text } = await safeReadJson(res);

      if (!isJson) throw new Error(`No devolvió JSON. ${res.status} ${text.slice(0, 120)}`);
      if (!res.ok || json?.ok === false) throw new Error(json?.error || `HTTP_${res.status}`);

      setOkMsg("Contraseña actualizada. Ya puedes iniciar sesión.");
      setTimeout(() => nav("/login"), 800);
    } catch (e2) {
      setErr(e2?.message || "No se pudo restablecer la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-slate-100 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md border border-neutral-800 rounded-2xl p-6 bg-neutral-900"
      >
        <h1 className="text-2xl font-semibold mb-2">Restablecer contraseña</h1>

        {!uid || !token ? (
          <div className="text-sm text-red-300 mb-4">
            Link inválido. Vuelve a solicitar recuperación.
          </div>
        ) : (
          <div className="text-xs text-slate-400 mb-4">
            uid/token detectados desde el enlace.
          </div>
        )}

        <label className="block text-sm mb-2">
          Nueva contraseña
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            autoComplete="new-password"
          />
        </label>

        <label className="block text-sm mb-4">
          Confirmar contraseña
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            autoComplete="new-password"
          />
        </label>

        {err && <div className="text-sm text-red-300 mb-3">{err}</div>}
        {okMsg && <div className="text-sm text-green-300 mb-3">{okMsg}</div>}

        <button
          type="submit"
          disabled={loading || !uid || !token}
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-2 font-semibold disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Actualizar contraseña"}
        </button>

        <div className="mt-4 flex items-center justify-between text-sm">
          <Link to="/login" className="text-blue-300 hover:text-blue-200">
            Login
          </Link>
          <Link to="/forgot-password" className="text-slate-200 hover:text-white">
            Reenviar enlace
          </Link>
        </div>
      </form>
    </main>
  );
}
