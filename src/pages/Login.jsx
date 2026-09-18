import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Seo from "../components/Seo";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }

  return "";
}

async function safeReadJson(response) {
  const text = await response.text();

  const contentType = (
    response.headers.get("content-type") || ""
  ).toLowerCase();

  const isJson = contentType.includes(
    "application/json"
  );

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

export default function Login() {
  const navigate = useNavigate();

  const API = useMemo(() => {
    const fromEnv =
      process.env.REACT_APP_API_URL || "";

    return fromEnv.replace(/\/+$/, "");
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [showPass, setShowPass] =
    useState(false);
  const [loading, setLoading] =
    useState(false);
  const [err, setErr] = useState("");

  async function ensureCsrf() {
    const response = await fetch(
      `${API}/api/auth/csrf/`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const {
      isJson,
      json,
      text,
    } = await safeReadJson(response);

    if (!response.ok) {
      throw new Error(
        json?.message ||
          json?.error ||
          `No se pudo preparar el inicio de sesión. Estado ${response.status}. ${text.slice(
            0,
            120
          )}`
      );
    }

    const csrfToken =
      json?.csrfToken ||
      json?.csrf_token ||
      json?.token ||
      getCookie("csrftoken");

    if (!csrfToken) {
      throw new Error(
        "El backend respondió correctamente, pero no entregó el token CSRF."
      );
    }

    return csrfToken;
  }

  const onSubmit = async (event) => {
    event.preventDefault();

    setErr("");

    const cleanEmail = email
      .trim()
      .toLowerCase();

    if (!cleanEmail) {
      setErr(
        "Ingresa tu correo electrónico."
      );
      return;
    }

    if (!password) {
      setErr("Ingresa tu contraseña.");
      return;
    }

    setLoading(true);

    try {
      const csrfToken =
        await ensureCsrf();

      const response = await fetch(
        `${API}/api/auth/login/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify({
            email: cleanEmail,
            password,
          }),
        }
      );

      const {
        isJson,
        json,
        text,
      } = await safeReadJson(response);

      if (!isJson) {
        throw new Error(
          `El inicio de sesión no devolvió una respuesta válida. Estado ${response.status}. ${text.slice(
            0,
            120
          )}`
        );
      }

      if (
        !response.ok ||
        json?.ok === false
      ) {
        throw new Error(
          json?.message ||
            json?.error ||
            json?.detail ||
            "Usuario o contraseña inválidos."
        );
      }

      navigate("/account", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Error durante el inicio de sesión:",
        error
      );

      setErr(
        error?.message ||
          "Usuario o contraseña inválidos."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Iniciar sesión"
        description="Inicia sesión en Top Education para acceder a tu cuenta, ruta de aprendizaje, CV y membresía."
        canonicalPath="/login"
        robots="noindex, nofollow"
      />

      <main className="min-h-screen bg-[#F4F6F9] px-4 py-8 font-['Montserrat'] text-[#172033] md:px-6 md:py-12">
        <section className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-[560px] items-center justify-center">
          <div className="w-full rounded-[26px] border border-[#E4E8EF] bg-white p-6 shadow-[0_24px_80px_rgba(17,29,49,0.10)] md:p-8">

            {/* ENCABEZADO */}
            <div className="flex items-start gap-4">
              <div className="relative grid h-[45px] w-[45px] shrink-0 place-items-center">
                {/*<span className="absolute h-[68px] w-[68px] animate-[topoWave_2.4s_ease-out_infinite] rounded-full bg-[#41679F]/10" />
                <span className="absolute h-[68px] w-[68px] animate-[topoWave_2.4s_ease-out_infinite_0.8s] rounded-full bg-[#BDEFF5]/20" />

                <div className="relative z-10 grid h-[54px] w-[54px] place-items-center overflow-hidden rounded-full bg-white shadow-[0_10px_24px_rgba(17,29,49,0.14)]">
                  <img
                    src="/assets/logos/topo-contenedor-claro.png"
                    alt="Topo"
                    className="h-full w-full object-cover"
                  />
                </div>*/}
                <span className="grid h-12 w-12 place-items-center rounded-[13px] bg-[#111D31] !font-['Montserrat'] text-[19px] font-bold text-white">
                  T
                </span>
              </div>

              <div className="min-w-0 pt-0.5">
                <span className="text-[9px] font-semibold uppercase text-[#41679F]">
                  Bienvenido de vuelta
                </span>

                <h1 className="text-[1.9rem] font-semibold leading-tight !font-['Montserrat'] text-[#172033] md:text-[2rem]">
                  Inicia sesión
                </h1>

                <p className="max-w-[390px] text-[11px] leading-[1.2] text-[#7D8798] md:text-[12px]">
                  Ingresa con tus credenciales para acceder a tu espacio de aprendizaje.
                </p>
              </div>
            </div>

            {/* FORMULARIO */}
            <form onSubmit={onSubmit} className="mt-4" noValidate>
              <label
                htmlFor="login-email"
                className="block text-[11px] font-semibold text-[#354156]"
              >
                Correo electrónico
              </label>

              <div className="relative mt-1">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A94A6]">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>

                <input
                  id="login-email"
                  type="email"
                  className="h-[50px] w-full rounded-[13px] border border-[#DEE3EB] bg-[#F9FAFC] pl-11 pr-4 text-[13px] text-[#172033] outline-none transition placeholder:text-[#A7AFBC] hover:border-[#CFD6E0] focus:border-[#91A7C5] focus:bg-white focus:ring-4 focus:ring-[#41679F]/[0.06]"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="username"
                  inputMode="email"
                  required
                  disabled={loading}
                />
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <label
                  htmlFor="login-password"
                  className="text-[11px] font-semibold text-[#354156]"
                >
                  Contraseña
                </label>

                <Link
                  to="/forgot-password"
                  className="text-[10px] font-semibold text-[#41679F] transition hover:text-[#284E83]"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <div className="relative mt-1">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A94A6]">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="4" y="10" width="16" height="10" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                </span>

                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  className="h-[50px] w-full rounded-[13px] border border-[#DEE3EB] bg-[#F9FAFC] pl-11 pr-14 text-[13px] text-[#172033] outline-none transition placeholder:text-[#A7AFBC] hover:border-[#CFD6E0] focus:border-[#91A7C5] focus:bg-white focus:ring-4 focus:ring-[#41679F]/[0.06]"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() => setShowPass((previous) => !previous)}
                  className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-[#8791A3] transition hover:bg-[#EEF2F6] hover:text-[#41679F]"
                  aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPass ? (
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m3 3 18 18" />
                      <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
                      <path d="M9.9 4.2A10.5 10.5 0 0 1 12 4c5.5 0 9.5 5 9.5 8a7.2 7.2 0 0 1-1.5 3.5" />
                      <path d="M6.6 6.6C4 8 2.5 10.3 2.5 12c0 3 4 8 9.5 8a10.4 10.4 0 0 0 4.1-.8" />
                    </svg>
                  ) : (
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7S2.5 12 2.5 12Z" />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  )}
                </button>
              </div>

              {err && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="mt-4 flex items-start gap-2 rounded-[12px] border border-[#F0CCCC] bg-[#FFF7F7] px-4 py-3 text-[10.5px] font-medium leading-relaxed text-[#B84D4D]"
                >
                  <span className="mt-[1px] font-bold">!</span>
                  <span>{err}</span>
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

                {loading ? "Ingresando..." : "Ingresar"}

                {!loading && (
                  <span className="text-[15px]" aria-hidden="true">
                    →
                  </span>
                )}
              </button>

              <div className="my-3 flex items-center gap-3">
                <span className="h-px flex-1 bg-[#E8ECF1]" />
                <span className="text-[9px] uppercase tracking-[0.12em] text-[#A1A9B6]">
                  ¿Aún no tienes cuenta?
                </span>
                <span className="h-px flex-1 bg-[#E8ECF1]" />
              </div>

              {/*<Link
                to="/empieza-ahora"
                className="flex h-[46px] w-full items-center justify-center rounded-[12px] border border-[#DDE3EB] bg-white px-5 text-[11px] font-semibold text-[#354156] transition hover:border-[#C6D0DE] hover:bg-[#F8FAFC]"
              >
                Crear una cuenta
              </Link>*/}
            </form>

            <div className="mt-6 flex items-start gap-2 rounded-[12px] bg-[#F8FAFC] px-4 py-3">
              <span className="mt-[1px] text-[#5E7898]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>

              <p className="text-[9.5px] leading-relaxed text-[#8A94A6]">
                Tu sesión se establece de forma segura y tus credenciales son
                procesadas directamente por Top Education.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
