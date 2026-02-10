// src/pages/StartNow.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * StartNow.jsx
 * - UI Heygen-style (toggle mensual/anual en una sola card)
 * - ✅ Bloquea checkout si NO hay sesión: redirige a /login
 * - ✅ Guarda intención (from + checkoutPlan) y al volver intenta el checkout automáticamente
 */

async function postJSON(url, body, { withCredentials = true } = {}) {
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body || {}),
      ...(withCredentials ? { credentials: "include" } : {}),
    });
  } catch (e) {
    throw Object.assign(new Error(`Failed to fetch: ${e?.message || e}`), {
      code: "network",
    });
  }

  const ct = (res.headers.get("content-type") || "").toLowerCase();
  const text = await res.text();

  // Si el backend devuelve HTML (login page / 404 / redirect)
  if (!ct.includes("application/json")) {
    const preview = (text || "").slice(0, 200);
    throw Object.assign(
      new Error(
        `No es JSON. Status ${res.status}. Probable HTML/redirect/404.\nPrimeros caracteres:\n${preview}`
      ),
      { code: "not_json", status: res.status, preview: text }
    );
  }

  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw Object.assign(
      new Error(
        `JSON inválido. Status ${res.status}.\nBody:\n${(text || "").slice(
          0,
          200
        )}`
      ),
      { code: "bad_json", status: res.status }
    );
  }

  // backend marca no-auth (a veces con 200)
  if (data?.error === "not_authenticated") {
    throw Object.assign(new Error("not_authenticated"), {
      code: "not_authenticated",
      status: res.status,
      data,
    });
  }
  if (res.status === 401) {
    throw Object.assign(new Error("not_authenticated"), {
      code: "not_authenticated",
      status: 401,
      data,
    });
  }

  if (!res.ok) {
    throw Object.assign(
      new Error(
        data?.detail ||
          data?.error ||
          `HTTP ${res.status} (sin detail). Respuesta: ${JSON.stringify(data).slice(
            0,
            200
          )}`
      ),
      { code: "http_error", status: res.status, data }
    );
  }

  return data;
}

async function getJSON(url) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const ct = (res.headers.get("content-type") || "").toLowerCase();
  const text = await res.text();

  if (!ct.includes("application/json")) {
    throw Object.assign(new Error("not_json"), {
      code: "not_json",
      status: res.status,
      preview: text,
    });
  }

  const data = text ? JSON.parse(text) : null;

  if (data?.error === "not_authenticated" || res.status === 401) {
    throw Object.assign(new Error("not_authenticated"), {
      code: "not_authenticated",
      status: res.status,
      data,
    });
  }

  if (!res.ok) {
    throw Object.assign(new Error(data?.error || data?.detail || `HTTP_${res.status}`), {
      code: "http_error",
      status: res.status,
      data,
    });
  }

  return data;
}

function StartNow() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ✅ Backend base URL:
  const backendBaseUrl = useMemo(() => {
    const fromEnv = process.env.REACT_APP_API_URL;
    return (fromEnv || "http://127.0.0.1:8000").replace(/\/+$/, "");
  }, []);

  const CREATE_SESSION_URL = useMemo(() => {
    return `${backendBaseUrl}/api/stripe/create-checkout-session/`;
  }, [backendBaseUrl]);

  const ME_URL = useMemo(() => {
    return `${backendBaseUrl}/api/account/me/`;
  }, [backendBaseUrl]);

  const [loadingPlan, setLoadingPlan] = useState(null); // "monthly" | "yearly" | null
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ Toggle: false => mensual, true => anual
  const [isYearly, setIsYearly] = useState(true);

  // ✅ Precios
  const PRICING = useMemo(() => {
    const monthly = { label: "Plan mensual", plan: "monthly", price: 59, unit: "/Mes" };
    const yearly = { label: "Plan anual", plan: "yearly", price: 599, unit: "/Año" };

    const yearlyFromMonthly = monthly.price * 12; // 708
    const savingsUsd = Math.max(0, Math.round(yearlyFromMonthly - yearly.price)); // 109
    const discountPct = Math.max(0, Math.round((savingsUsd / yearlyFromMonthly) * 100)); // 15%

    return { monthly, yearly, savingsUsd, discountPct };
  }, []);

  const selected = isYearly ? PRICING.yearly : PRICING.monthly;

  const FEATURES = useMemo(
    () => [
      "Acceso a todas las certificaciones",
      "Obtén un certificado respaldado por tecnología blockchain",
      "Accede a contenido de Coursera, edX y MasterClass",
      "Contenido actualizado",
      "Cancela tu membresía cuando quieras",
      "Acceso a más de 15,000 certificaciones",
    ],
    []
  );

  async function goCheckout(plan) {
    setErrorMsg("");
    setLoadingPlan(plan);

    try {
      // 1) ✅ Validar sesión
      try {
        await getJSON(ME_URL);
      } catch (e) {
        if (e?.code === "not_authenticated" || e?.message === "not_authenticated") {
          // 👉 Redirige a login guardando intención
          navigate("/login", {
            replace: true,
            state: {
              from: "/start-now",
              checkoutPlan: plan,
            },
          });
          return;
        }
        throw e;
      }

      // 2) ✅ Crear sesión de checkout (ya autenticado)
      const data = await postJSON(
        CREATE_SESSION_URL,
        { plan }, // "monthly" | "yearly"
        { withCredentials: true }
      );

      if (!data?.url) {
        throw new Error("Respuesta inválida: falta `url` de Stripe Checkout.");
      }

      window.location.href = data.url;
    } catch (e) {
      console.error("Error iniciando pago:", e);
      setErrorMsg(e?.message || String(e));
    } finally {
      setLoadingPlan(null);
    }
  }

  // ✅ Al volver del login, intenta checkout automático una sola vez
  useEffect(() => {
    const intendedPlan = location.state?.checkoutPlan;
    if (!intendedPlan) return;

    // Limpia el state para evitar loops
    navigate(location.pathname, { replace: true, state: {} });

    // Sincroniza toggle visual con lo que venía
    setIsYearly(intendedPlan === "yearly");

    // Intenta checkout
    goCheckout(intendedPlan);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>Empieza Ahora | Top Education</title>
        <meta
          name="description"
          content="Potencia tu perfil profesional con una suscripción a Top Education. Accede a +13,000 certificaciones y recursos exclusivos para transformar tu futuro."
        />
        <meta property="og:title" content="Empieza Ahora" />
        <meta name="author" content="Top Education" />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:description"
          content="Potencia tu perfil profesional con una suscripción a Top Education. Accede a +13,000 certificaciones y recursos exclusivos para transformar tu futuro."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ===================== HERO ===================== */}
      <section className="wrapper ">
        <div className="container m-auto h-screen mx-auto px-4 flex justify-center items-center gap-2 sect-h-pequ">
          <span className="w-5/15 lg:w-5/15 aspect-square bg-gradient-to-tr from-green-500 to-green-900 absolute top-30 lg:left-50 rounded-full skew-y-0 blur-2xl opacity-40 skew-x-12 rotate-90"></span>
          <div className="m-auto max-w-[100vw] lg:max-w-[50vw]">
            <h1 className="text-[#F6F4EF] text-[3.3rem] font-normal font-[Lora] text-center leading-[1.5em] z-10 relative sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl">
              Desarrolla todo tu <br />
              <span className="text-[5rem] top-italic sm:text-[120px]">potencial</span>
            </h1>
            <p className="mt-5 text-[1.125rem] text-[#a8a8a8] text-center z-10 relative">
              En un mundo laboral altamente competitivo, <span id="top">top</span>
              <span id="education">.education</span> te ofrece acceso a contenido de alto nivel para que desarrolles nuevas
              habilidades y avances en tu trayectoria profesional. Aprende con expertos de talla mundial y obtén
              certificaciones reconocidas internacionalmente.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== MENSAJE DE ERROR ===================== */}
      {errorMsg ? (
        <div className="container m-auto px-4 -mt-16 mb-8">
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            <div className="font-semibold mb-1">Error iniciando pago</div>
            <pre className="text-xs whitespace-pre-wrap break-words">{errorMsg}</pre>
          </div>
        </div>
      ) : null}

      {/* ===================== SECCIONES INTERMEDIAS (TU MISMO CONTENIDO) ===================== */}
      <section className="wrapper ">
        <div className="container m-auto py-[1rem] xl:!py-10 lg:!py-6 md:!py-3">
          <div className="flex flex-wrap mx-[-15px] xl:mx-[-35px] lg:mx-[-20px] !mt-[-30px] !mb-[4.5rem] items-center">
            <div className="xl:w-7/12 lg:w-7/12 w-full flex-[0_0_auto] xl:!px-[35px] lg:!px-[20px] !px-[15px] !mt-[25px] max-w-full">
              <h2 className="text-[#F6F4EF] text-[2.5rem] leading-[1.2em] font-normal font-[Lora] w-full">
                ¿Por que <span id="top">top</span>
                <span id="education">.education</span> es la mejor opción de educación en linea?
              </h2>
              <p className="text-[1.125rem] text-[#a8a8a8] mt-5 mb-5 text-left z-10 relative">
                Top Education te ofrece uno de los catálogos de formación online mas grandes en el mercado: más de 14,500
                certificaciones en diversas disciplinas, junto con acceso exclusivo a los contenidos de Masterclass,
                Coursera y edX, todo por un precio que supera significativamente el valor de cada plataforma por separado.
              </p>
            </div>

            {/* Card comparativa */}
            <div className="xl:w-5/12 lg:w-5/12 w-full flex-[0_0_auto] xl:!px-[35px] lg:!px-[20px] !px-[15px]  max-w-full !relative">
              <div className="pricing-wrapper !relative">
                <div className="flex flex-wrap justify-center mx-[-15px] !mt-3 xl:!mt-5 lg:!mt-5 md:!mt-5">
                  <div className="sm:w-10/12 lg:w-10/12 xl:w-10/12 w-full p-[15px] flex-[0_0_auto] !px-[15px] max-w-full">
                    <div className="pricing card !text-left rounded-lg bg-neutral-900 p-[15px] !shadow-[0_0.25rem_1.75rem_rgba(30,34,40,0.07)]">
                      <div className="card-body flex-[1_1_auto]  xl:!p-[1rem_1.5rem_1.5rem] lg:!p-[1rem_1.5rem_1.5rem] md:!p-[1rem_1.5rem_1.25rem]">
                        <h3 className="card-title text-[#F6F4EF] text-5xl md:text-5xl lg:text-4xl">
                          Plataformas
                        </h3>
                        <h3 className="card-title text-[#F6F4EF] text-4xl md:text-3xl lg:text-2xl">
                          por separado
                        </h3>
                        <ul className="pl-0 list-none bullet-bg bullet-soft-primary mt-4 text-left text-[#F6F4EF]">
                          <li className="relative flex justify-between text-justify">
                            <span className="text-justify flex items-center gap-2 w-full">
                              <span>MasterClass</span>
                              <span className=" flex w-full border-b-2 border-dashed"></span>
                              <span className="block w-[135px] text-right">USD 180</span>
                            </span>
                          </li>
                          <li className="relative flex justify-between text-justify">
                            <span className="text-justify flex items-center gap-2 w-full">
                              <span className="w-[245px]">Coursera Plus</span>
                              <span className=" flex w-full border-b-2 border-dashed"></span>
                              <span className="block text-right !w-[150px]">USD 399</span>
                            </span>
                          </li>
                          <li className="relative flex justify-between text-justify">
                            <span className="text-justify flex items-center gap-2 w-full">
                              <span>EdX</span>
                              <span className=" flex w-full border-b-2 border-dashed"></span>
                              <span className="block !w-[100px] text-right">USD 394</span>
                            </span>
                          </li>
                        </ul>
                        <div className="prices !text-[#D33B3E] flex w-full justify-center">
                          <div className="price price-hide price-hidden flex items-stretch mt-1">
                            <span className="price-currency self-start text-[1.5rem]">PAGO TOTAL $</span>
                            <span className="price-value text-4xl self-end">928</span>
                            <span className="price-duration self-end ml-1 text-[1rem]"> USD /Anual</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="wrapper">
        <div className="container m-auto pt-[1rem] pb-80 xl:pt-10 lg:pt-10 md:pt-28 xl:pb-100 lg:pb-100 md:pb-100 !text-center">
          <div className="flex flex-wrap mx-[-15px]">
            <div className="lg:w-10/12 xl:w-9/12 xxl:w-8/12 w-full flex-[0_0_auto] !px-[15px] max-w-full !mx-auto">
              <h3 className="!text-[calc(2rem_+_0.66vw)] text-[#F6F4EF] font-bold xl:!text-[2.8rem] !leading-[1.3] !mb-[1rem] xl:!mb-6 lg:!mb-6 md:!mb-6 lg:!px-10 xl:!px-10">
                ¿Por que Top Education es la mejor opción de educación en linea?
              </h3>
              <p className="text-[#F6F4EF]">
                Top Education te ofrece uno de los catálogos de formación online mas grandes en el mercado: más de 14,500
                certificaciones en diversas disciplinas, junto con acceso exclusivo a los contenidos de Masterclass,
                Coursera y edX, todo por un precio que supera significativamente el valor de cada plataforma por separado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PRICING (HEYGEN STYLE) ===================== */}
      <section className="wrapper bg-gradient-to-t from-transparent to-neutral-800">
        <div className="container m-auto py-[4.5rem] xl:!py-24 lg:!py-24 md:!py-24">
          <div className="pricing-wrapper !relative !mt-[-15rem] xl:!mt-[-30rem] lg:!mt-[-30rem] md:!mt-[-30rem]">
            <div className="flex flex-col items-center justify-center mx-auto max-w-[980px] px-4">

              {/* Header pricing */}
              <div className="w-full text-center">
                <h2 className="text-[#F6F4EF] text-[2.2rem] md:text-[2.6rem] font-[Lora]">
                  Elige tu plan
                </h2>
                <p className="text-[#a8a8a8] mt-2">
                  Un solo plan con todo incluido. Cambia entre mensual o anual para ahorrar.
                </p>
              </div>

              {/* Toggle mensual/anual */}
              <div className="mt-6 flex items-center gap-3 bg-neutral-900/70 border border-neutral-700 rounded-full px-4 py-3">
                <span className={`text-sm ${!isYearly ? "text-[#F6F4EF]" : "text-[#a8a8a8]"}`}>
                  Mensual
                </span>

                <button
                  type="button"
                  onClick={() => setIsYearly((v) => !v)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition ${
                    isYearly ? "bg-blue-600" : "bg-neutral-700"
                  }`}
                  aria-label="Cambiar a plan anual"
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                      isYearly ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>

                <span className={`text-sm ${isYearly ? "text-[#F6F4EF]" : "text-[#a8a8a8]"}`}>
                  Anual
                </span>

                {PRICING.discountPct > 0 && (
                  <span className="ml-2 text-xs font-semibold text-blue-200 bg-blue-600/20 border border-blue-500/30 px-2 py-1 rounded-full">
                    Ahorras {PRICING.discountPct}%
                  </span>
                )}
              </div>

              {/* Card única */}
              <div className="mt-8 w-full rounded-2xl border border-neutral-700 bg-[#F6F4EF] shadow-[0_0.25rem_1.75rem_rgba(30,34,40,0.07)] overflow-hidden">
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Left: price */}
                  <div className="text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-3xl md:text-4xl text-[#1c1c1c] font-semibold">
                          {selected.label}
                        </h3>
                        <p className="mt-1 text-[#4A4949]">
                          Acceso total a Top Education.
                        </p>
                      </div>

                      {isYearly && (
                        <div className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-600 text-white">
                          Recomendado
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex items-end gap-2">
                      <span className="text-2xl text-[#1c1c1c]">USD</span>
                      <span className="text-6xl md:text-7xl text-[#1c1c1c] font-bold leading-none">
                        {selected.price}
                      </span>
                      <span className="text-lg text-[#4A4949] mb-2">{selected.unit}</span>
                    </div>

                    {isYearly && PRICING.savingsUsd > 0 && (
                      <div className="mt-3 text-sm text-blue-700 font-semibold">
                        Ahorras ${PRICING.savingsUsd} USD vs pagar mensual
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => goCheckout(selected.plan)}
                      disabled={loadingPlan !== null}
                      className="mt-6 w-full md:w-auto px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loadingPlan === selected.plan ? "Redirigiendo..." : "Empieza ahora"}
                    </button>

                    <div className="mt-4 text-xs text-[#666]">
                      {isYearly ? "Facturado anualmente. Cancela cuando quieras." : "Facturado mensualmente. Cancela cuando quieras."}
                    </div>
                  </div>

                  {/* Right: features */}
                  <div className="rounded-xl bg-neutral-100 px-6 py-6">
                    <div className="text-[#000000] font-semibold text-lg mb-4">
                      Incluye:
                    </div>

                    <ul className="space-y-3 text-[#000000]">
                      {FEATURES.map((t) => (
                        <li key={t} className="flex items-start gap-3">
                          <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600/85 border border-blue-500/30 text-blue-200 text-xs">
                            ✓
                          </span>
                          <span className="text-sm leading-relaxed">{t}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      disabled
                      onClick={() => setIsYearly(true)}
                      className="mt-6 w-full px-4 py-2 rounded-full border border-neutral-700 bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
                    >
                      {isYearly ? "Plan anual seleccionado" : "Cambiate a anual y ahorra"}
                    </button>
                  </div>
                </div>
              </div>

              {/* mini nota */}
              <div className="mt-6 text-center text-xs text-slate-400 max-w-[760px]">
                Al continuar aceptas los términos. Los pagos se procesan de forma segura con Stripe.
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default StartNow;
