import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

function getCookie(name) {
  const v = `; ${document.cookie}`;
  const parts = v.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }

  return "";
}

async function safeReadJson(res) {
  const text = await res.text();
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  const isJson = ct.includes("application/json");

  let json = null;

  if (isJson && text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
  }

  return {
    isJson,
    text,
    json,
  };
}

export default function ForgotPassword() {
  const API = useMemo(() => {
    const fromEnv = process.env.REACT_APP_API_URL || "";
    return fromEnv.replace(/\/+$/, "");
  }, []);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");

  async function ensureCsrf() {
    await fetch(`${API}/api/auth/csrf/`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    setErr("");
    setOkMsg("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErr("Ingresa tu correo electrónico.");
      return;
    }

    setLoading(true);

    try {
      await ensureCsrf();

      const csrftoken = getCookie("csrftoken");

      const res = await fetch(
        `${API}/api/auth/password/reset/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify({
            email: cleanEmail,
          }),
        }
      );

      const { isJson, json, text } =
        await safeReadJson(res);

      if (isJson && (json?.ok === false || !res.ok)) {
        throw new Error(
          json?.error ||
            json?.message ||
            json?.detail ||
            `HTTP_${res.status}`
        );
      }

      if (!isJson && !res.ok) {
        throw new Error(
          `Error HTTP_${res.status}: ${text.slice(0, 120)}`
        );
      }

      setOkMsg(
        "Si el correo existe, te enviaremos un enlace para restablecer tu contraseña."
      );

      setEmail("");
    } catch (e2) {
      setErr(
        e2?.message ||
          "No se pudo enviar el correo de recuperación."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F6F9] px-4 py-8 font-['Montserrat'] text-[#172033] md:px-6 md:py-12">
      <section className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-[560px] items-center justify-center">
        <div className="w-full rounded-[26px] border border-[#E4E8EF] bg-white p-6 shadow-[0_24px_80px_rgba(17,29,49,0.10)] md:p-8">

          {/* ENCABEZADO */}
          <div className="flex items-start gap-4">
            <div className="relative grid h-[45px] w-[45px] shrink-0 place-items-center">
              <span className="grid h-12 w-12 place-items-center rounded-[13px] bg-[#111D31] !font-['Montserrat'] text-[19px] font-bold text-white">
                T
              </span>
            </div>

            <div className="min-w-0 pt-0.5">
              <span className="text-[9px] font-semibold uppercase text-[#41679F]">
                Recupera tu acceso
              </span>

              <h1 className="text-[1.9rem] font-semibold leading-tight !font-['Montserrat'] text-[#172033] md:text-[2rem]">
                Restablece tu contraseña
              </h1>

              <p className="max-w-[390px] text-[11px] leading-[1.2] text-[#7D8798] md:text-[12px]">
                Ingresa tu correo electrónico y te enviaremos las instrucciones para crear una nueva contraseña.
              </p>
            </div>
          </div>

          {/* FORMULARIO */}
          <form
            onSubmit={onSubmit}
            className="mt-4"
            noValidate
          >
            <label
              htmlFor="forgot-email"
              className="block text-[11px] font-semibold text-[#354156]"
            >
              Correo electrónico
            </label>

            <div className="relative mt-1">
              <Mail
                size={17}
                strokeWidth={1.7}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A94A6]"
              />

              <input
                id="forgot-email"
                type="email"
                className="h-[50px] w-full rounded-[13px] border border-[#DEE3EB] bg-[#F9FAFC] pl-11 pr-4 text-[13px] text-[#172033] outline-none transition placeholder:text-[#A7AFBC] hover:border-[#CFD6E0] focus:border-[#91A7C5] focus:bg-white focus:ring-4 focus:ring-[#41679F]/[0.06]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
                placeholder="tu@correo.com"
                disabled={loading}
                required
              />
            </div>

            {err && (
              <div
                role="alert"
                aria-live="polite"
                className="mt-4 flex items-start gap-2 rounded-[12px] border border-[#F0CCCC] bg-[#FFF7F7] px-4 py-3 text-[10.5px] font-medium leading-relaxed text-[#B84D4D]"
              >
                <AlertCircle
                  size={16}
                  className="mt-[1px] shrink-0"
                />

                <span>{err}</span>
              </div>
            )}

            {okMsg && (
              <div
                role="status"
                aria-live="polite"
                className="mt-4 flex items-start gap-2 rounded-[12px] border border-[#CFE5D5] bg-[#F3FAF5] px-4 py-3 text-[10.5px] font-medium leading-relaxed text-[#43845A]"
              >
                <CheckCircle
                  size={16}
                  className="mt-[1px] shrink-0"
                />

                <span>{okMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex h-[48px] w-full items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,#111D31_0%,#41679F_100%)] px-5 text-[12px] font-semibold text-white shadow-[0_10px_28px_rgba(29,53,87,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(29,53,87,0.27)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}

              {loading
                ? "Enviando..."
                : "Enviar enlace"}

              {!loading && (
                <ArrowRight
                  size={15}
                  strokeWidth={1.8}
                />
              )}
            </button>

            <div className="my-3 flex items-center gap-3">
              <span className="h-px flex-1 bg-[#E8ECF1]" />
              <span className="text-[9px] uppercase tracking-[0.12em] text-[#A1A9B6]">
                Acceso
              </span>
              <span className="h-px flex-1 bg-[#E8ECF1]" />
            </div>

            <Link
              to="/login"
              className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[12px] border border-[#DDE3EB] bg-white px-5 text-[11px] font-semibold text-[#354156] transition hover:border-[#C6D0DE] hover:bg-[#F8FAFC]"
            >
              <ArrowLeft
                size={15}
                strokeWidth={1.8}
              />
              Volver a iniciar sesión
            </Link>
          </form>

          <p className="mt-5 text-center text-[9.5px] leading-relaxed text-[#8A94A6]">
            Por seguridad, no confirmaremos si el correo existe o no en nuestra plataforma.
          </p>
        </div>
      </section>
    </main>
  );
}