import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail, CheckCircle, AlertCircle } from "lucide-react";

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

function BrandPulseIcon() {
  return (
    <div className="relative mx-auto grid h-[92px] w-[92px] place-items-center">
      <span className="absolute h-full w-full animate-[topPulse_2.5s_ease-out_infinite] rounded-full bg-[#3046E8]/10" />
      <span className="absolute h-full w-full animate-[topPulse_2.5s_ease-out_infinite_0.8s] rounded-full bg-[#3046E8]/10" />

      <div className="relative z-10 grid h-[74px] w-[74px] place-items-center rounded-full bg-[linear-gradient(135deg,#4B3BFF_0%,#3046E8_48%,#165C5B_100%)] text-white shadow-[0_18px_55px_rgba(48,70,232,0.32)]">
        <Mail size={32} strokeWidth={2.4} />
      </div>
    </div>
  );
}

export default function ForgotPassword() {
  const API = useMemo(() => {
    const fromEnv = process.env.REACT_APP_API_URL || "";
    return (fromEnv || "http://localhost:8000").replace(/\/+$/, "");
  }, []);

  const [email, setEmail] = useState("");
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

    if (!email.trim()) {
      setErr("Ingresa tu correo electrónico.");
      return;
    }

    setLoading(true);

    try {
      await ensureCsrf();
      const csrftoken = getCookie("csrftoken");

      const res = await fetch(`${API}/api/auth/password/reset/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const { isJson, json, text } = await safeReadJson(res);

      if (isJson && (json?.ok === false || !res.ok)) {
        throw new Error(json?.error || `HTTP_${res.status}`);
      }

      if (!isJson && !res.ok) {
        throw new Error(`Error HTTP_${res.status}: ${text.slice(0, 120)}`);
      }

      setOkMsg(
        "Si el correo existe, te enviaremos un enlace para restablecer tu contraseña."
      );
      setEmail("");
    } catch (e2) {
      setErr(e2?.message || "No se pudo enviar el correo de recuperación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F6F4EF] px-5 py-20 md:py-24 text-[#111111]">
      <style>
        {`
          @keyframes topPulse {
            0% { transform: scale(.65); opacity: .32; }
            70% { opacity: .10; }
            100% { transform: scale(1.75); opacity: 0; }
          }

          .forgot-dot-grid {
            background-image: radial-gradient(rgba(48,70,232,.22) 1px, transparent 1px);
            background-size: 22px 22px;
          }
        `}
      </style>

      <div className="forgot-dot-grid absolute inset-0 opacity-[0.22]" />
      <div className="pointer-events-none absolute left-1/2 top-[15%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#3046E8]/10 blur-[120px]" />

      <section className="relative z-10 w-full max-w-[560px]">
        <div className="text-center">
          <BrandPulseIcon />

          <p className="mt-5 !font-['Montserrat'] text-[13px] font-semibold uppercase tracking-[0.18em] text-[#3046E8]">
            Recupera tu acceso
          </p>

          <h1 className="mt-2 !font-['Montserrat'] text-[2.35rem] font-semibold leading-tight tracking-[-0.04em] text-[#080808]">
            Restablece tu contraseña
          </h1>

          <p className="mx-auto mt-4 max-w-[580px] !font-['Montserrat'] text-[1.05rem] leading-[1.5em] text-neutral-600">
            Ingresa tu correo electrónico y te enviaremos las instrucciones para crear una nueva contraseña.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-9 rounded-[28px] bg-white p-7 shadow-[0_28px_80px_rgba(0,0,0,0.08)] md:p-9"
        >
          <label className="block !font-['Montserrat'] text-[16px] font-semibold text-[#111111]">
            Correo electrónico

            <div className="relative mt-3">
              <Mail
                size={20}
                className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                type="email"
                className="
                  w-full rounded-[22px] border border-black/10 bg-white
                  px-14 py-4 !font-['Montserrat'] text-[17px] text-[#111111]
                  outline-none transition-all duration-300
                  placeholder:text-neutral-300
                  focus:border-[#3046E8]
                  focus:ring-4 focus:ring-[#3046E8]/15
                "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="tu@correo.com"
              />
            </div>
          </label>

          {err && (
            <div className="mt-5 flex items-start gap-3 rounded-[18px] border border-red-100 bg-red-50 px-5 py-4 !font-['Montserrat'] text-sm font-semibold text-red-600">
              <AlertCircle size={18} className="mt-[1px] shrink-0" />
              <span>{err}</span>
            </div>
          )}

          {okMsg && (
            <div className="mt-5 flex items-start gap-3 rounded-[18px] border border-[#5CC781]/25 bg-[#5CC781]/10 px-5 py-4 !font-['Montserrat'] text-sm font-semibold text-[#2E9F58]">
              <CheckCircle size={18} className="mt-[1px] shrink-0" />
              <span>{okMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              mt-7 flex w-full items-center justify-center gap-3
              rounded-[18px] bg-[#3046E8] px-8 py-5
              !font-['Montserrat'] text-[17px] font-semibold text-white
              shadow-[0_22px_50px_rgba(48,70,232,0.28)]
              transition-all duration-300
              hover:-translate-y-1 hover:bg-[#253ACF]
              disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            {loading ? "Enviando..." : "Enviar enlace"}
            {!loading && <ArrowRight size={19} />}
          </button>

          <div className="mt-7 flex justify-center">
            <Link
              to="/login"
              className="
                inline-flex items-center gap-2 rounded-full px-4 py-2
                !font-['Montserrat'] text-sm font-semibold text-neutral-500
                transition hover:bg-black/5 hover:text-[#111111]
              "
            >
              <ArrowLeft size={17} />
              Volver a iniciar sesión
            </Link>
          </div>
        </form>

        <p className="mt-6 text-center !font-['Montserrat'] text-[13px] leading-[1.5em] text-neutral-400">
          Por seguridad, no confirmaremos si el correo existe o no en nuestra plataforma.
        </p>
      </section>
    </main>
  );
}