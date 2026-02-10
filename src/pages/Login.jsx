import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";

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

export default function Login() {
  const nav = useNavigate();

  const API = useMemo(() => {
    const fromEnv = process.env.REACT_APP_API_URL || "";
    return (fromEnv || "http://localhost:8000").replace(/\/+$/, "");
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

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
    setLoading(true);

    try {
      await ensureCsrf();
      const csrftoken = getCookie("csrftoken");

      const res = await fetch(`${API}/api/auth/login/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({ email, password }),
      });

      const { isJson, json, text } = await safeReadJson(res);

      if (!isJson) {
        throw new Error(
          `Login no devolvió JSON. Status ${res.status}.\n${text.slice(0, 120)}`
        );
      }
      if (!res.ok || json?.ok === false) {
        throw new Error(json?.error || `HTTP_${res.status}`);
      }

      nav("/account");
    } catch (e2) {
      setErr(e2?.message || "Usuario o contraseña inválidos, o error de conexión.");
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
        <h1 className="text-2xl font-semibold mb-4">Iniciar sesión</h1>

        <label className="block text-sm mb-2">
          Email o usuario
          <input
            className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </label>

        <label className="block text-sm mb-4">
          Contraseña
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        {err && <div className="text-sm text-red-300 mb-3">{err}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-2 font-semibold disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {/* ✅ Acciones */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="text-blue-300 hover:text-blue-200">
            ¿Olvidaste tu contraseña?
          </Link>

          {/*<Link to="/register" className="text-slate-200 hover:text-white">
            Crear cuenta
          </Link>*/}
        </div>
      </form>
    </main>
  );
}
