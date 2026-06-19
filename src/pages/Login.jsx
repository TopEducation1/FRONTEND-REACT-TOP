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
    return (fromEnv).replace(/\/+$/, "");
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
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
      setErr(e2?.message || "Usuario o contraseña inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F4EF] px-4 pt-12 pb-12 md:pt-24 md:pb-20  text-[#FFFFFF]">
      <section className="mx-auto flex min-h-[calc(100vh-96px)] max-w-[520px] flex-col items-center justify-center">
        <div className="relative mb-6 grid h-[118px] w-[118px] place-items-center">
          <span className="absolute h-[118px] w-[118px] rounded-full bg-[#2563EB]/10 animate-[topoWave_2.4s_ease-out_infinite]" />
          <span className="absolute h-[118px] w-[118px] rounded-full bg-[#2563EB]/8 animate-[topoWave_2.4s_ease-out_infinite_0.8s]" />

          <div className="relative z-10 grid h-[72px] w-[72px] place-items-center rounded-full bg-[linear-gradient(135deg,#2563EB_0%,#2563EB_45%,#165C5B_100%)] text-4xl text-white shadow-[0_18px_55px_rgba(25,65,207,0.35)]">
            ★
          </div>
        </div>

        <span className="font-['Montserrat'] text-[13px] font-bold uppercase tracking-[0.25em] text-[#2563EB]">
          Bienvenido de vuelta
        </span>

        <h1 className="mt-3 !font-['Montserrat'] text-[2rem] font-bold leading-[1em] tracking-[-0.04em] text-[#111111]">
          Inicia sesión
        </h1>

        <p className="mt-4 max-w-[390px] text-center font-['Montserrat'] text-[1.05rem] leading-[1.35em] text-neutral-600">
          Usa la contraseña temporal que recibiste al completar tu onboarding.
        </p>

        <div className="mt-10 w-full rounded-[22px] border border-[#2563EB]/20 bg-[#F0EEF8] px-5 py-5 shadow-[0_18px_60px_rgba(0,0,0,0.04)]">
          <div className="flex gap-4">
            <span className="text-2xl">📬</span>

            <div>
              <h2 className="!font-['Montserrat'] text-[1.15rem] font-bold text-[#111111]">
                ¿Primer acceso?
              </h2>

              <p className="font-['Montserrat'] text-[0.9rem] leading-[1.2em] text-neutral-600">
                Revisa tu correo — te enviamos una contraseña temporal al
                registrarte. Después podrás crear la tuya propia.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-8 w-full rounded-[26px] bg-white px-7 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)]"
        >
          <label className="block font-['Montserrat'] text-[1rem] font-medium text-[#111111]">
            Correo electrónico
            <input
              className="mt-3 w-full rounded-[18px] border border-black/10 bg-white px-5 py-4 font-['Montserrat'] text-[1rem] outline-none transition-all duration-300 placeholder:text-neutral-300 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/20"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </label>

          <label className="mt-6 block font-['Montserrat'] text-[1rem] font-medium text-[#111111]">
            Contraseña temporal
            <div className="relative mt-3">
              <input
                type={showPass ? "text" : "password"}
                className="w-full rounded-[18px] border border-black/10 bg-white px-5 py-4 pr-16 font-['Montserrat'] text-[1rem] outline-none transition-all duration-300 placeholder:text-neutral-300 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/20"
                placeholder="Ej: TOP-2025"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() => setShowPass((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 font-['Montserrat'] text-sm font-semibold text-neutral-400 transition hover:text-[#2563EB]"
              >
                {showPass ? "Ocultar" : "Ver"}
              </button>
            </div>

            <span className="mt-3 block font-['Montserrat'] text-[0.9rem] text-neutral-400">
              Encuéntrala en el correo de bienvenida de top.education
            </span>
          </label>

          {err && (
            <div className="mt-5 rounded-[16px] border border-red-100 bg-red-50 px-4 py-3 font-['Montserrat'] text-sm font-semibold text-red-600">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-[18px] bg-[#2563EB] px-6 py-4 font-['Montserrat'] text-[1rem] font-bold text-white shadow-[0_18px_45px_rgba(25,65,207,0.32)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#3D36DF] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingresar"}
            <span>→</span>
          </button>

          <div className="mt-7 flex items-center justify-between gap-4 font-['Montserrat'] text-[1rem]">
            <Link
              to="/forgot-password"
              className="font-medium text-[#2563EB] transition hover:text-[#312BE0]"
            >
              ¿Olvidaste tu contraseña?
            </Link>

            <Link
              /*to="/empieza-ahora"*/
              to="/"
              className="font-medium text-neutral-600 transition hover:text-[#111111]"
            >
              Crear cuenta
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}