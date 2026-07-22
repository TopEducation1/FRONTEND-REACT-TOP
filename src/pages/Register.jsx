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

  const isJson = contentType.includes("application/json");

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

export default function Register() {
  const navigate = useNavigate();

  const API = useMemo(() => {
    const fromEnv = process.env.REACT_APP_API_URL || "";

    return fromEnv.replace(/\/+$/, "");
  }, []);

  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");

  async function ensureCsrf() {
    const response = await fetch(`${API}/api/auth/csrf/`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("No se pudo preparar el registro.");
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault();

    setErr("");
    setOkMsg("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErr("Ingresa tu correo electrónico.");
      return;
    }

    if (password1.length < 8) {
      setErr("La contraseña debe tener mínimo 8 caracteres.");
      return;
    }

    if (password1 !== password2) {
      setErr("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      await ensureCsrf();

      const csrfToken = getCookie("csrftoken");

      const response = await fetch(`${API}/api/auth/register/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          email: cleanEmail,
          password: password1,
        }),
      });

      const { isJson, json, text } =
        await safeReadJson(response);

      if (!isJson) {
        throw new Error(
          `El registro no devolvió una respuesta válida. Estado ${response.status}. ${text.slice(
            0,
            120
          )}`
        );
      }

      if (!response.ok || json?.ok === false) {
        throw new Error(
          json?.error ||
            json?.detail ||
            `HTTP_${response.status}`
        );
      }

      setOkMsg("Cuenta creada correctamente. Entrando...");

      navigate("/account", {
        replace: true,
      });
    } catch (error) {
      setErr(
        error?.message ||
          "No se pudo crear la cuenta."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Crear cuenta"
        description="Crea tu cuenta en Top Education y comienza a construir tu ruta personalizada de aprendizaje."
        canonicalPath="/register"
        robots="noindex, nofollow"
      />

      <main className="flex min-h-screen items-center justify-center bg-[#F6F4EF] px-4 py-12 text-[#111111] md:py-20">
        <section className="w-full max-w-[520px]">
          <div className="mb-7 text-center">
            <span className="font-['Montserrat'] text-[12px] font-bold uppercase tracking-[0.22em] text-[#2563EB]">
              Únete a Top Education
            </span>

            <h1 className="mt-3 font-['Montserrat'] text-[2rem] font-bold leading-[1.05em] tracking-[-0.04em] text-[#111111] md:text-[2.4rem]">
              Crear cuenta
            </h1>

            <p className="mx-auto mt-3 max-w-[420px] font-['Montserrat'] text-[15px] leading-[1.5em] text-neutral-500">
              Regístrate para acceder a tu espacio personal y continuar con tu ruta de aprendizaje.
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="w-full rounded-[26px] border border-black/5 bg-white px-6 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.08)] md:px-8 md:py-8"
            noValidate
          >
            <label
              htmlFor="register-email"
              className="block font-['Montserrat'] text-[1rem] font-medium text-[#111111]"
            >
              Correo electrónico

              <input
                id="register-email"
                type="email"
                className="mt-3 w-full rounded-[18px] border border-black/10 bg-white px-5 py-4 font-['Montserrat'] text-[1rem] outline-none transition-all duration-300 placeholder:text-neutral-300 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/20"
                placeholder="tu@correo.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                inputMode="email"
                required
                disabled={loading}
              />
            </label>

            <label
              htmlFor="register-password"
              className="mt-6 block font-['Montserrat'] text-[1rem] font-medium text-[#111111]"
            >
              Contraseña

              <div className="relative mt-3">
                <input
                  id="register-password"
                  type={showPassword1 ? "text" : "password"}
                  className="w-full rounded-[18px] border border-black/10 bg-white px-5 py-4 pr-20 font-['Montserrat'] text-[1rem] outline-none transition-all duration-300 placeholder:text-neutral-300 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/20"
                  placeholder="Mínimo 8 caracteres"
                  value={password1}
                  onChange={(event) =>
                    setPassword1(event.target.value)
                  }
                  autoComplete="new-password"
                  minLength={8}
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword1((previous) => !previous)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 font-['Montserrat'] text-sm font-semibold text-neutral-400 transition hover:text-[#2563EB]"
                  aria-label={
                    showPassword1
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showPassword1 ? "Ocultar" : "Ver"}
                </button>
              </div>
            </label>

            <label
              htmlFor="register-password-confirmation"
              className="mt-6 block font-['Montserrat'] text-[1rem] font-medium text-[#111111]"
            >
              Confirmar contraseña

              <div className="relative mt-3">
                <input
                  id="register-password-confirmation"
                  type={showPassword2 ? "text" : "password"}
                  className="w-full rounded-[18px] border border-black/10 bg-white px-5 py-4 pr-20 font-['Montserrat'] text-[1rem] outline-none transition-all duration-300 placeholder:text-neutral-300 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/20"
                  placeholder="Repite tu contraseña"
                  value={password2}
                  onChange={(event) =>
                    setPassword2(event.target.value)
                  }
                  autoComplete="new-password"
                  minLength={8}
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword2((previous) => !previous)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 font-['Montserrat'] text-sm font-semibold text-neutral-400 transition hover:text-[#2563EB]"
                  aria-label={
                    showPassword2
                      ? "Ocultar confirmación de contraseña"
                      : "Mostrar confirmación de contraseña"
                  }
                >
                  {showPassword2 ? "Ocultar" : "Ver"}
                </button>
              </div>
            </label>

            {err && (
              <div
                role="alert"
                aria-live="polite"
                className="mt-5 rounded-[16px] border border-red-100 bg-red-50 px-4 py-3 font-['Montserrat'] text-sm font-semibold text-red-600"
              >
                {err}
              </div>
            )}

            {okMsg && (
              <div
                role="status"
                aria-live="polite"
                className="mt-5 rounded-[16px] border border-green-100 bg-green-50 px-4 py-3 font-['Montserrat'] text-sm font-semibold text-green-700"
              >
                {okMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-[18px] bg-[#2563EB] px-6 py-4 font-['Montserrat'] text-[1rem] font-bold text-white shadow-[0_18px_45px_rgba(25,65,207,0.32)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#3D36DF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creando cuenta..."
                : "Crear cuenta"}

              {!loading && <span aria-hidden="true">→</span>}
            </button>

            <div className="mt-7 flex flex-col items-center justify-between gap-3 font-['Montserrat'] text-[0.95rem] sm:flex-row">
              <Link
                to="/login"
                className="font-medium text-[#2563EB] transition hover:text-[#312BE0]"
              >
                Ya tengo una cuenta
              </Link>

              <Link
                to="/forgot-password"
                className="font-medium text-neutral-500 transition hover:text-[#111111]"
              >
                Recuperar contraseña
              </Link>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}