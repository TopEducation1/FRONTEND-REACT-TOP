// src/pages/Account.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  LogOut,
  User,
  FileText,
  Star,
  TrendingUp,
  X,
  Menu,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";

const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

function hasActiveMxAccess(me, learningRoute) {
  const accessStatus = String(
    me?.mx_access_status ||
    me?.access_status ||
    me?.plan?.accessStatus ||
    learningRoute?.access_status ||
    "ALLOWED"
  ).toUpperCase();

  const lifecycle = String(
    me?.lifecycle_status ||
    me?.plan?.lifecycleStatus ||
    me?.subscription_status ||
    learningRoute?.lifecycle_status ||
    ""
  ).toUpperCase();

  return (
    accessStatus === "ALLOWED" &&
    !["CANCELLED", "EXPIRED", "PAST_DUE", "UNPAID", "CANCELED"].includes(lifecycle)
  );
}

function getMxMagicLink(me, learningRoute) {
  return (
    me?.mx_magic_link ||
    me?.magic_link ||
    me?.mx?.magicLink ||
    learningRoute?.mx_magic_link ||
    learningRoute?.magicLink ||
    ""
  );
}

async function getJSON(url) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (!contentType.includes("application/json")) {
    throw Object.assign(
      new Error(`No es JSON. Status ${res.status}.\n${text.slice(0, 200)}`),
      { code: "not_json", status: res.status }
    );
  }

  const data = text ? JSON.parse(text) : {};

  if (data?.error === "not_authenticated" || res.status === 401) {
    throw Object.assign(new Error("not_authenticated"), {
      code: "not_authenticated",
      status: res.status,
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

async function postJSON(url, body = {}) {
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok || data?.ok === false) {
    throw new Error(data?.error || data?.detail || `HTTP ${res.status}`);
  }

  return data;
}

async function postFormData(url, formData) {
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok || data?.ok === false) {
    throw new Error(
      data?.message ||
        data?.error ||
        data?.detail ||
        data?.errorCode ||
        `HTTP ${res.status}`
    );
  }

  return data;
}

const ZERO_DECIMAL = new Set([
  "bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga", "pyg", "rwf",
  "ugx", "vnd", "vuv", "xaf", "xof", "xpf", "cop",
]);

function fmtMoney(amount, currency = "usd") {
  if (amount == null || amount === "") return "—";
  const cur = String(currency || "usd").toLowerCase();
  const n = Number(amount);
  if (Number.isNaN(n)) return String(amount);
  const value = ZERO_DECIMAL.has(cur) ? n : n / 100;

  try {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: cur.toUpperCase(),
      maximumFractionDigits: ZERO_DECIMAL.has(cur) ? 0 : 2,
    }).format(value);
  } catch {
    return `${value} ${cur.toUpperCase()}`;
  }
}

function fmtDate(value, short = false) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: short ? "short" : "long",
    year: "numeric",
  });
}

function daysUntil(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return Math.max(0, Math.ceil((date.getTime() - Date.now()) / 86400000));
}

function trialPercentLeft(trialEnd, trialStart) {
  if (!trialEnd) return 100;

  const end = new Date(trialEnd).getTime();
  const start = trialStart ? new Date(trialStart).getTime() : end - 7 * 86400000;
  const now = Date.now();

  if (!Number.isFinite(end) || !Number.isFinite(start) || end <= start) return 100;

  const total = end - start;
  const left = Math.max(0, end - now);

  return Math.max(0, Math.min(100, (left / total) * 100));
}

function normalizePurchases(raw) {
  const arr = raw?.data ?? raw?.items ?? raw?.results ?? (Array.isArray(raw) ? raw : []);

  return (Array.isArray(arr) ? arr : []).map((p) => {
    const sessionId = p?.session_id || p?.stripe_checkout_session_id || null;
    const invoiceId = p?.invoice_id || p?.stripe_invoice_id || null;
    const paymentIntent = p?.payment_intent || p?.stripe_payment_intent_id || null;
    const amount = p?.amount ?? p?.amount_total ?? p?.total ?? p?.amount_paid ?? p?.amount_due ?? null;

    return {
      id: p?.id ?? null,
      created_at: p?.created_at || p?.created || p?.date || null,
      type: p?.type || p?.kind || "checkout",
      amount,
      currency: p?.currency || "usd",
      status: p?.status || "—",
      description: p?.description || "Plan Top Education",
      hosted_invoice_url: p?.hosted_invoice_url || null,
      invoice_pdf: p?.invoice_pdf || null,
      reference: sessionId || invoiceId || paymentIntent || "—",
    };
  });
}

function normalizePaymentMethods(raw) {
  const arr = raw?.data ?? raw?.items ?? raw?.results ?? (Array.isArray(raw) ? raw : []);
  return Array.isArray(arr) ? arr : [];
}

const cardElementOptions = {
  hidePostalCode: true,
  style: {
    base: {
      fontSize: "16px",
      color: "#111111",
      fontFamily: "Montserrat, Arial, sans-serif",
      "::placeholder": { color: "#A3A3A3" },
    },
    invalid: { color: "#D33B3E" },
  },
};

const PLAN_CATALOG = {
  free: {
    key: "free",
    badge: "FREE",
    title: "Top Education Free",
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    priceNumber: 0,
    monthlyValue: 0,
    yearlyValue: 0,
    monthlyPlanValue: "free",
    yearlyPlanValue: "free",
    planLine: "Explora la plataforma y descubre tu potencial.",
    tags: ["Ruta personalizada", "3 cursos", "Análisis CV", "Dashboard"],
    includes: [
      "Creación y entrega de tu ruta de aprendizaje personalizada.",
      "3 cursos seleccionados por nuestros proveedores.",
      "Análisis de tu CV cotejado con tu ruta de aprendizaje.",
      "Dashboard de aprendizaje.",
      "Recomendaciones básicas sobre tu ruta.",
    ],
    excludes: [
      "Certificaciones.",
      "Acceso completo a tu ruta con todos los proveedores.",
      "Seguimiento avanzado de tu plan de carrera.",
      "IA personalizada (Topo).",
    ],
  },
  basic: {
    key: "basic",
    badge: "TOP",
    title: "Top Education",
    monthlyPrice: "$19",
    yearlyPrice: "$16",
    monthlyValue: 19,
    yearlyValue: 16,
    yearlyTotal: "$199 USD al año",
    yearlySaving: "Ahorras $29",
    monthlyPlanValue: "monthly_basic",
    yearlyPlanValue: "yearly_basic",
    planLine: "Acceso inicial con un proveedor educativo.",
    tags: ["1 proveedor", "Ruta básica", "Certificaciones"],
    features: [
      "Ruta personalizada",
      "1 proveedor educativo",
      "Certificaciones disponibles",
      "Dashboard de aprendizaje",
    ],
  },
  x: {
    key: "x",
    badge: "TOP X",
    title: "Top Education X",
    monthlyPrice: "$29",
    yearlyPrice: "$25",
    monthlyValue: 29,
    yearlyValue: 25,
    yearlyTotal: "$299 USD al año",
    yearlySaving: "Ahorras $49",
    monthlyPlanValue: "monthly_x",
    yearlyPlanValue: "yearly_x",
    planLine: "La mejor combinación para acelerar tu crecimiento profesional.",
    tags: ["Coursera", "MasterClass", "Ruta completa", "7 días gratis"],
    includes: [
      "Todo lo del plan Free.",
      "2 proveedores para tu ruta: Coursera y MasterClass.",
      "Certificaciones disponibles en tus 3 cursos.",
      "Acceso a toda tu ruta personalizada.",
      "Seguimiento de progreso.",
      "IA Topo: recomendaciones inteligentes sobre tu ruta.",
      "Nuevas rutas según las tendencias globales de tu sector.",
      "Actualización continua de habilidades.",
      "Prueba gratuita de 7 días.",
    ],
    excludes: [
      "EdX como tercer proveedor.",
      "Todas las certificaciones de tu ruta completa.",
      "Seguimiento avanzado de tu plan de carrera.",
      "IA Topo avanzada y recomendaciones premium.",
      "Acceso prioritario a nuevas experiencias.",
    ],
  },
  plus: {
    key: "plus",
    badge: "PLUS",
    title: "Top Education Plus",
    monthlyPrice: "$49",
    yearlyPrice: "$42",
    monthlyValue: 49,
    yearlyValue: 42,
    yearlyTotal: "$499 USD al año",
    yearlySaving: "Ahorras $89",
    monthlyPlanValue: "monthly_plus",
    yearlyPlanValue: "yearly_plus",
    planLine: "La experiencia completa para quienes buscan maximizar su aprendizaje.",
    tags: ["Coursera", "edX", "MasterClass", "IA Topo avanzada"],
    includes: [
      "Todo lo del plan X.",
      "Acceso a los 3 proveedores: Coursera, edX y MasterClass.",
      "Todas las certificaciones disponibles en tu ruta.",
      "Ruta siempre actualizada según tus intereses y el mercado laboral.",
      "Seguimiento avanzado de tu plan de carrera.",
      "IA Topo avanzada.",
      "Recomendaciones premium.",
      "Acceso prioritario a nuevas experiencias.",
      "Prueba gratuita de 7 días.",
    ],
    excludes: [
      "Es el plan más completo: incluye todo lo que ofrece la plataforma.",
    ],
  },
};

function getPlanDetails(me, learningRoute) {
  const planRaw = String(
    me?.selected_plan ||
      me?.subscription_plan ||
      me?.plan ||
      me?.subscription?.selected_plan ||
      learningRoute?.selected_plan ||
      "free"
  ).toLowerCase();

  const paidPlanRaw = String(
    me?.selected_paid_plan ||
      me?.billing_variant ||
      me?.subscription_interval ||
      me?.interval ||
      me?.subscription?.interval ||
      me?.subscription?.selected_paid_plan ||
      learningRoute?.selected_paid_plan ||
      ""
  ).toLowerCase();

  const priceId = String(
    me?.price_id ||
      me?.subscription_price_id ||
      me?.subscription?.price_id ||
      ""
  );

  const isYearly =
    paidPlanRaw.includes("yearly") ||
    paidPlanRaw.includes("annual") ||
    me?.billing_period === "yearly" ||
    me?.billing_period === "annual" ||
    me?.subscription?.billing_period === "yearly";
  const isBasic =
  planRaw.includes("basic") ||
  paidPlanRaw.includes("basic");
  const isPlus =
    planRaw.includes("plus") ||
    paidPlanRaw.includes("plus");

  const isX =
    planRaw.includes("x") ||
    planRaw.includes("pro") ||
    paidPlanRaw.includes("monthly_x") ||
    paidPlanRaw.includes("yearly_x") ||
    Boolean(me?.subscription_status);

  let plan = PLAN_CATALOG.free;

  if (isPlus) plan = PLAN_CATALOG.plus;
  else if (isX) plan = PLAN_CATALOG.x;
  else if (isBasic) plan = PLAN_CATALOG.basic;

  return {
    ...plan,
    billingCycle: isYearly ? "yearly" : "monthly",
    activePrice: isYearly ? plan.yearlyPrice : plan.monthlyPrice,
    activePlanValue: isYearly ? plan.yearlyPlanValue : plan.monthlyPlanValue,
  };
}

const TABS = [
  { key: "career", label: "Plan de Carrera", icon: <TrendingUp size={18} /> },
  { key: "cv", label: "Mi CV", icon: <FileText size={18} /> },
  { key: "profile", label: "Perfil", icon: <User size={18} /> },
  { key: "license", label: "Licencia", icon: <Star size={18} /> },
];

function StarMark({ small = false }) {
  return (
    <div
      className={`grid place-items-center rounded-full bg-[linear-gradient(135deg,#2563EB,#145C5B)] text-white shadow-[0_14px_38px_rgba(25,65,207,0.35)] ${
        small ? "!h-9 !w-9 text-sm" : "!h-12 !w-12 text-lg"
      }`}
    >
      ★
    </div>
  );
}

function TopBar({ email, initial, onOpenMobileMenu }) {
  const navigate = useNavigate();

  const navigateWithTransition = (url) => {
    if (document.startViewTransition) document.startViewTransition(() => navigate(url));
    else navigate(url);
  };

  return (
    <header className="fixed left-0 top-0 z-40 flex h-[66px] w-full items-center !justify-between bg-[#100A0D] px-4 md:px-6 text-white !z-[998]">
      <div className="flex items-center gap-4">
        <button onClick={() => navigateWithTransition("/inicio")}>
          <img
            src="/assets/logos/TOPEDUCATIONLOGONAV.png"
            alt="Logo Top.education"
            className="h-auto w-[140px] object-contain md:w-[210px] lg:w-[230px]"
          />
        </button>

        <span className="hidden h-7 w-px bg-white/20 md:block" />
        <span className="hidden !font-['Montserrat'] text-sm text-white/55 md:block">
          Mi espacio
        </span>
      </div>

      <div className="flex items-center gap-3">
        <StarMark small />

        <div className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-[#2563EB] !font-['Montserrat'] font-bold shadow-[0_10px_30px_rgba(25,65,207,0.45)]">
          {initial}
        </div>

        <span className="hidden max-w-[260px] truncate !font-['Montserrat'] text-sm text-white/75 lg:block">
          {email || "—"}
        </span>

        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>
      </div>
    </header>
  );
}

function Sidebar({ activeTab, onTabChange, me, planLabel, backendBaseUrl, learningRoute }) {
  const navigate = useNavigate();
  const initial = (me?.email || me?.username || "U").charAt(0).toUpperCase();
  const mxAccessActive = hasActiveMxAccess(me, learningRoute);
  const [openingMxApp, setOpeningMxApp] = useState(false);

  const goToMxApp = async () => {
    if (!mxAccessActive) {
      toast.error("Tu acceso está inactivo o suspendido. Actualiza tu membresía para ingresar a la app.");
      return;
    }

    setOpeningMxApp(true);

    try {
      const res = await postJSON(`${backendBaseUrl}/api/account/mx/magic-link/refresh/`);
      const magicLink = res?.data?.magic_link || res?.data?.magicLink || res?.magicLink;

      if (!magicLink) {
        toast.error("No se pudo generar el acceso a la app.");
        return;
      }

      window.open(magicLink, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(error?.message || "Tu acceso está inactivo o suspendido. Actualiza tu membresía.");
    } finally {
      setOpeningMxApp(false);
    }
  };
  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("learningRoute");

      await fetch(`${backendBaseUrl}/api/auth/logout/`, {
        method: "POST",
        credentials: "include",
      });

      navigate("/login");
    } catch {
      navigate("/login");
    }
  };
  const streakDays = Number(
    me?.learning_streak_days ||
    me?.streak_days ||
    learningRoute?.streak_days ||
    0
  );

  

  return (
    <aside className="fixed left-0 top-[66px] hidden h-[calc(100vh-66px)] w-[300px] border-r border-black/10 bg-white lg:flex lg:flex-col">
      <div className="border-b border-black/10 p-4">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[linear-gradient(135deg,#2563EB,#5CC781)] !font-['Montserrat'] font-bold text-white">
            {initial}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate !font-['Montserrat'] text-[18px] font-bold text-[#111111]">Mi cuenta</h2>
              <span className="rounded-full bg-[#2563EB] px-2 py-0.5 !font-['Montserrat'] text-[11px] font-black text-white">
                {planLabel}
              </span>
            </div>
            <p className="-mt-1 truncate !font-['Montserrat'] text-[12px] text-neutral-400">{me?.email || "—"}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {TABS.map((item) => {
          const active = activeTab === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onTabChange(item.key)}
              className={`flex w-full items-center justify-between rounded-[14px] px-3 py-2 !font-['Montserrat'] text-[15px] font-semibold transition ${
                active
                  ? "bg-[#100A0D] text-white shadow-[0_14px_35px_rgba(0,0,0,0.16)]"
                  : "text-neutral-600 hover:bg-[#F6F4EF] hover:text-[#111111]"
              }`}
            >
              <span className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </span>
              {active && <span className="h-2 w-2 rounded-full bg-[#5CC781]" />}
            </button>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-black/10 p-4">
        <button
          type="button"
          onClick={goToMxApp}
          disabled={openingMxApp}
          className={`flex w-full items-center justify-between rounded-[18px] p-3 !font-['Montserrat'] text-white shadow-[0_14px_35px_rgba(92,199,129,0.28)] ${
            mxAccessActive ? "bg-[#63BE79]" : "bg-neutral-400 cursor-not-allowed"
          } ${openingMxApp ? "opacity-70" : ""}`}
        >
          <span className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-[12px] bg-white/18">↗</span>
            <span className="flex flex-wrap items-center">
              <strong className="block !text-left">Ir a la App</strong>
              <span className="text-sm text-white/80">
                {openingMxApp
                  ? "Generando acceso..."
                  : mxAccessActive
                  ? "Abrir plataforma MX"
                  : "Acceso suspendido"}
              </span>
            </span>
          </span>
          <span>›</span>
        </button>

        <div className="rounded-[20px] bg-[#100A0D] p-3 text-white">
          <div className="flex items-center gap-2">
            <StarMark small />
            <div>
              <span className="!font-['Montserrat'] text-[13px] font-semibold uppercase  text-[#5CC781]">Consejo</span>
              <p className="!font-['Montserrat'] text-[11px] leading-[1.3em]">
                {streakDays > 0
                  ? `Llevas ${streakDays} días seguidos aprendiendo 🔥 ¡Sigue así!`
                  : "Aún no tienes racha activa. Ingresa a la app para empezar."}
              </p>
            </div>
            
          </div>
          
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-2xl px-4 py-2 text-red-500 transition hover:bg-red-50"
        >
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}

function MobileMenuDrawer({
  open,
  onClose,
  activeTab,
  onTabChange,
  me,
  planLabel,
  backendBaseUrl,
  learningRoute,
}) {
  const navigate = useNavigate();
  const initial = (me?.email || me?.username || "U").charAt(0).toUpperCase();
  const mxAccessActive = hasActiveMxAccess(me, learningRoute);
  const [openingMxApp, setOpeningMxApp] = useState(false);

  if (!open) return null;

  const goToMxApp = async () => {
    if (!mxAccessActive) {
      toast.error("Tu acceso está inactivo o suspendido.");
      return;
    }

    setOpeningMxApp(true);

    try {
      const res = await postJSON(`${backendBaseUrl}/api/account/mx/magic-link/refresh/`);
      const magicLink = res?.data?.magic_link || res?.data?.magicLink || res?.magicLink;

      if (!magicLink) {
        toast.error("No se pudo generar el acceso a la app.");
        return;
      }

      window.open(magicLink, "_blank", "noopener,noreferrer");
      onClose();
    } catch (error) {
      toast.error(error?.message || "No fue posible abrir la app.");
    } finally {
      setOpeningMxApp(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("learningRoute");

    await fetch(`${backendBaseUrl}/api/auth/logout/`, {
      method: "POST",
      credentials: "include",
    }).catch(() => null);

    navigate("/login");
  };

  const streakDays = Number(
    me?.learning_streak_days ||
    me?.streak_days ||
    learningRoute?.streak_days ||
    0
  );

  return (
    <div className="fixed inset-0 !z-[999] lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Cerrar menú"
      />

      <aside className="absolute right-0 top-0 flex h-full w-[86vw] max-w-[380px] flex-col rounded-l-[28px] bg-white shadow-[0_25px_90px_rgba(0,0,0,0.35)] animate-[mobileDrawerIn_0.25s_ease-out]">
        <div className="flex items-center justify-between border-b border-black/10 p-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[linear-gradient(135deg,#2563EB,#5CC781)] !font-['Montserrat'] font-bold text-white">
              {initial}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate !font-['Montserrat'] text-lg font-black text-[#111111]">
                  Mi cuenta
                </h2>
                <span className="rounded-full bg-[#2563EB] px-2 py-0.5 !font-['Montserrat'] text-[11px] font-black text-white">
                  {planLabel}
                </span>
              </div>
              <p className="truncate !font-['Montserrat'] text-xs text-neutral-400">
                {me?.email || "—"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100 text-neutral-600"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-5">
          {TABS.map((item) => {
            const active = activeTab === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  onTabChange(item.key);
                  onClose();
                }}
                className={`flex w-full items-center justify-between rounded-[18px] px-4 py-4 !font-['Montserrat'] text-[15px] font-bold transition ${
                  active
                    ? "bg-[#100A0D] text-white"
                    : "bg-[#F6F4EF] text-neutral-700"
                }`}
              >
                <span className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </span>
                {active && <span className="h-2 w-2 rounded-full bg-[#5CC781]" />}
              </button>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-black/10 p-5">
          <button
            type="button"
            onClick={goToMxApp}
            disabled={openingMxApp}
            className={`flex w-full items-center justify-between rounded-[20px] p-4 !font-['Montserrat'] text-white ${
              mxAccessActive ? "bg-[#63BE79]" : "bg-neutral-400"
            } ${openingMxApp ? "opacity-70" : ""}`}
          >
            <span>
              <strong className="block !text-left">Ir a la App</strong>
              <span className="text-sm text-white/80">
                {openingMxApp ? "Generando acceso..." : "Abrir plataforma MX"}
              </span>
            </span>
            <span>↗</span>
          </button>

          <div className="rounded-[20px] bg-[#100A0D] p-4 text-white">
            <span className="!font-['Montserrat'] text-xs font-bold uppercase text-[#5CC781]">
              Consejo
            </span>
            <p className="mt-1 !font-['Montserrat'] text-sm leading-snug text-white/85">
              {streakDays > 0
                ? `Llevas ${streakDays} días seguidos aprendiendo 🔥`
                : "Aún no tienes racha activa. Ingresa a la app para empezar."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-[18px] px-4 py-3 !font-['Montserrat'] font-bold text-red-500 hover:bg-red-50"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </div>
  );
}

function DashboardWelcomeModal({ open, onClose, defaultTab }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center pt-20 justify-center bg-black/55 px-4 backdrop-blur-sm">
      <div className="w-full max-w-[820px] rounded-[28px] bg-white p-8 shadow-[0_35px_100px_rgba(0,0,0,0.25)]">
        <div className="text-center">
          <div className="mx-auto grid h-18 w-18 place-items-center rounded-full bg-[#1941CF] text-white">
            <Star size={40} strokeWidth={2.2} />
          </div>

          <h2 className="mt-2 !font-['Montserrat'] text-[1.3rem] font-black text-[#111111]">¡Bienvenido a tu dashboard!</h2>
          <p className="!font-['Montserrat'] leading-[1em] text-neutral-500">Te mostraremos rápidamente las funciones principales.</p>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
          {[
            ["career", <TrendingUp size={28} />, "Plan de Carrera", "Visualiza tu ruta personalizada con cursos recomendados según tus intereses."],
            ["cv", <FileText size={28} />, "Mi CV", "Sube tu CV y recibe análisis detallados con recomendaciones para mejorar tu perfil profesional."],
            ["profile", <User size={28} />, "Perfil", "Gestiona tu información, revisa tu progreso y accede a tus certificaciones obtenidas."],
            ["license", <Star size={28} />, "Licencia", "Administra tu plan, métodos de pago y beneficios de tu suscripción."],
          ].map(([key, icon, title, text]) => (
            <div key={key} className={`rounded-[18px] flex gap-2 border p-4 ${defaultTab === key ? "border-[#1941CF]" : "border-black/10"}`}>
              <div className="grid !h-12 !w-12 place-items-center rounded-[14px] bg-[#1941CF]/10 text-[#1941CF]">{icon}</div>
              <div className="w-full">
                <h3 className="!font-['Montserrat'] text-lg font-black text-[#111111]">{title}</h3>
                <p className="!font-['Montserrat'] text-[12px] leading-[1.2em] text-neutral-500">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-[18px] border border-[#FDBA3B]/25 bg-[#FFF8EA] p-4">
          <div className="flex gap-4">
            <span className="text-2xl">🎓</span>
            <div>
              <h3 className="!font-['Montserrat'] text-lg font-black text-[#111111]">Comienza tu aprendizaje</h3>
              <p className="mt-0 !font-['Montserrat'] text-sm leading-[1.2em] text-neutral-500">
                {defaultTab === "cv"
                  ? 'Empieza desde "Mi CV" para mejorar tu perfil antes de continuar.'
                  : 'Ve a "Plan de Carrera" para ver tu ruta personalizada con cursos disponibles.'}
              </p>
            </div>
          </div>
        </div>

        <button type="button" onClick={onClose} className="mt-5 flex w-full items-center justify-center gap-3 rounded-[16px] bg-[#1941CF] px-7 py-4 !font-['Montserrat'] font-black text-white shadow-[0_18px_45px_rgba(37,58,207,0.25)]">
          Entendido, comenzar →
        </button>
      </div>
    </div>
  );
}

function ChangePlanModal({ open, type, currentPlan, targetPlan, onClose, onConfirm, loading }) {
  if (!open || !targetPlan) return null;

  const isUpgrade = type === "upgrade";
  const difference = Math.max(0, (targetPlan.priceNumber || 0) - (currentPlan.priceNumber || 0));
  const prorated = difference ? Math.round(difference * 0.775 * 100) / 100 : 0;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm">
      <div className="w-full max-w-[560px] rounded-[28px] bg-white p-7 shadow-[0_35px_100px_rgba(0,0,0,0.28)]">
        <button type="button" onClick={onClose} className="float-right grid h-9 w-9 place-items-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200">
          <X size={18} />
        </button>

        <h2 className="!font-['Montserrat'] text-[1.65rem] font-semibold text-[#111111]">{isUpgrade ? "Actualizar membresía" : "Cambiar plan"}</h2>
        <p className="!font-['Montserrat'] text-neutral-500">
          {isUpgrade ? "Obtendrás acceso inmediato a los beneficios adicionales." : "Tu acceso actual permanecerá activo hasta el final del ciclo de facturación."}
        </p>

        {isUpgrade ? (
          <>
            <div className="mt-2 rounded-[18px] bg-[#F6F4EF] p-5">
              <h3 className="!font-['Montserrat'] text-lg font-semibold text-[#111111]">Nuevos beneficios desbloqueados</h3>
              <ul className="space-y-1 !font-['Montserrat'] text-neutral-700">
                {["Acceso a edX adicional", "Todas las certificaciones", "IA Premium", "Rutas avanzadas"].map((item) => (
                  <li key={item} className="flex text-[13px] items-center gap-1">
                    <CheckCircle className="text-[#5CC781]" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3 space-y-1 border-t border-black/10 pt-3 !font-['Montserrat']">
              <div className="flex justify-between text-neutral-500">
                <span>Precio actual</span>
                <span className="font-bold text-[#111111] line-through">{currentPlan.changePrice}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Precio nuevo</span>
                <span className="font-black text-[#1941CF]">{targetPlan.changePrice}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Diferencia</span>
                <span className="font-bold text-[#111111]">+${difference} USD / mes</span>
              </div>
            </div>

            <div className="mt-5 rounded-[16px] bg-[#EEF2FF] p-4 !font-['Montserrat']">
              <div className="flex justify-between font-black text-[#1941CF]">
                <span>Prorrateo estimado</span>
                <span>${prorated.toFixed(2)} USD hoy</span>
              </div>
              <p className="mt-1 text-[12px] text-neutral-500">Se cobrará la diferencia proporcional por los días restantes del ciclo actual.</p>
            </div>
          </>
        ) : (
          <>
            <div className="mt-3 rounded-[18px] bg-[#F1FAF5] p-5">
              <h3 className="flex items-center gap-3 !font-['Montserrat'] text-lg font-semibold text-[#111111]">
                <CheckCircle className="text-[#5CC781]" size={24} />
                Conservarás
              </h3>
              <ul className="mt-1 space-y-1 !font-['Montserrat'] text-neutral-700">
                {["Perfil", "Historial", "Progreso", "Certificados obtenidos"].map((item) => (
                  <li key={item} className="text-[#5CC781] text-[13px]">✓ <span className="text-neutral-700">{item}</span></li>
                ))}
              </ul>
            </div>

            <div className="mt-3 rounded-[18px] bg-[#FFF1F1] p-5">
              <h3 className="flex items-center gap-3 !font-['Montserrat'] text-lg font-semibold text-[#111111]">
                <AlertCircle className="text-red-500" size={24} />
                Perderás
              </h3>
              <ul className="mt-1 space-y-1 !font-['Montserrat'] text-neutral-700">
                {["Acceso a proveedores premium", "Nuevas certificaciones", "Funciones avanzadas"].map((item) => (
                  <li key={item} className="text-red-500 text-[13px]">× <span className="text-neutral-700">{item}</span></li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          <button type="button" onClick={onClose} className={`rounded-[16px] px-6 py-4 !font-['Montserrat'] font-black ${isUpgrade ? "border border-black/10 text-[#111111]" : "bg-[#1941CF] text-white"}`}>
            {isUpgrade ? "Cancelar" : "Mantener plan actual"}
          </button>
          <button type="button" onClick={onConfirm} disabled={loading} className={`rounded-[16px] px-6 py-4 !font-['Montserrat'] font-black disabled:opacity-50 ${isUpgrade ? "bg-[#1941CF] text-white" : "border border-black/10 text-[#111111]"}`}>
            {loading ? "Procesando..." : isUpgrade ? "Confirmar Upgrade" : "Confirmar cambio"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddPaymentMethodModal({ open, onClose, backendBaseUrl, onSaved, userEmail }) {
  const stripe = useStripe();
  const elements = useElements();
  const [saving, setSaving] = useState(false);
  const [complete, setComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!open) return null;

  const savePaymentMethod = async () => {
    setErrorMsg("");

    if (!stripe || !elements) {
      setErrorMsg("Stripe aún está cargando. Intenta nuevamente.");
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card || !complete) {
      setErrorMsg("Completa los datos de la tarjeta.");
      return;
    }

    setSaving(true);

    try {
      const setup = await postJSON(`${backendBaseUrl}/api/billing/setup-intent/`, {
        email: userEmail,
      });

      const clientSecret = setup?.client_secret || setup?.data?.client_secret;

      if (!clientSecret) throw new Error("No se pudo preparar la tarjeta en Stripe.");

      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card,
          billing_details: { email: userEmail },
        },
      });

      if (result.error) throw new Error(result.error.message || "No se pudo validar la tarjeta.");

      const paymentMethodId = result.setupIntent?.payment_method;

      if (!paymentMethodId) throw new Error("Stripe no devolvió el método de pago.");

      await postJSON(`${backendBaseUrl}/api/billing/payment-methods/create/`, {
        email: userEmail,
        payment_method_id: paymentMethodId,
      });

      await onSaved?.();
      onClose();
      toast.success("Método de pago agregado.");
    } catch (error) {
      setErrorMsg(error?.message || "No se pudo guardar la tarjeta.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-[520px] rounded-[26px] bg-white p-6 shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
        <div className="flex items-start justify-between gap-5">
          <div>
            <span className="!font-['Montserrat'] text-xs font-black uppercase tracking-[0.16em] text-[#2563EB]">Método de pago</span>
            <h2 className="mt-2 !font-['Montserrat'] text-2xl font-black text-[#111111]">Agregar nueva tarjeta</h2>
            <p className="mt-1 !font-['Montserrat'] text-sm text-neutral-500">La tarjeta se guarda de forma segura en Stripe.</p>
          </div>

          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100 text-xl text-neutral-500 hover:bg-neutral-200">×</button>
        </div>

        <div className="mt-6 rounded-[18px] border border-black/10 bg-[#F6F4EF] px-5 py-5">
          <CardElement options={cardElementOptions} onChange={(event) => {
            setComplete(event.complete);
            setErrorMsg(event.error?.message || "");
          }} />
        </div>

        <div className="mt-5 rounded-[16px] border border-[#5CC781]/25 bg-[#5CC781]/10 p-4">
          <p className="!font-['Montserrat'] text-sm font-semibold text-[#111111]">✓ Top Education no almacena los números de tarjeta.</p>
          <p className="mt-1 !font-['Montserrat'] text-sm text-neutral-600">Stripe tokeniza el método de pago para cobros recurrentes.</p>
        </div>

        {errorMsg && <div className="mt-5 rounded-[16px] border border-red-100 bg-red-50 px-4 py-3 !font-['Montserrat'] text-sm font-semibold text-red-600">{errorMsg}</div>}

        <button type="button" onClick={savePaymentMethod} disabled={saving || !stripe} className="mt-6 flex w-full items-center justify-center rounded-[16px] bg-[#2563EB] px-6 py-4 !font-['Montserrat'] font-black text-white shadow-[0_18px_45px_rgba(25,65,207,0.25)] disabled:opacity-50">
          {saving ? "Guardando..." : "Guardar método de pago"}
        </button>
      </div>
    </div>
  );
}

function CareerTab({ learningRoute }) {
  const topics = learningRoute?.topics?.length ? learningRoute.topics : ["Liderazgo", "Comunicación", "Estrategia"];
  const goal = learningRoute?.goal || "Liderazgo aplicado";

  const steps = [
    { number: "✓", title: "Fundamentos", status: "Completada", done: true, active: false, skills: [topics[0] || "Comunicación", "Pensamiento crítico"] },
    { number: "02", title: goal, status: "En curso", done: false, active: true, skills: [topics[1] || "Gestión de equipos", "Toma de decisiones"] },
    { number: "03", title: "Especialización", status: "", done: false, active: false, skills: ["Data-driven leadership", topics[2] || "Estrategia"] },
    { number: "04", title: "Nivel experto", status: "", done: false, active: false, skills: ["Dirección ejecutiva", "Innovación"] },
  ];

  const skillRows = [
    ["Liderazgo", 68, "#2563EB"],
    ["Comunicación", 45, "#5CC781"],
    ["Estrategia", 30, "#F5B63D"],
    ["Tecnología", 20, "#1F64D8"],
    ["Creatividad", 55, "#8B5CF6"],
  ];

  return (
    <>
      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="!font-['Montserrat'] text-[2rem] font-bold leading-[1.1em] text-[#111111]">Plan de Carrera</h1>
          <p className="!font-['Montserrat'] leading-[1.2em] text-neutral-500">Tu hoja de ruta profesional personalizada.</p>
        </div>
        <span className="w-fit rounded-full bg-[#2563EB]/10 px-4 py-2 !font-['Montserrat'] text-sm font-bold text-[#2563EB]">✦ Generado para ti</span>
      </div>

      <section className="rounded-[24px] border border-black/10 bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.05)]">
        <span className="!font-['Montserrat'] text-xs font-black uppercase tracking-[0.16em] text-neutral-500">Ruta de competencias</span>

        <div className="mt-3 space-y-6">
          {steps.map((step, index) => (
            <div key={step.title} className="relative grid grid-cols-[48px_1fr] gap-5">
              {index !== steps.length - 1 && <span className={`absolute left-[23px] top-[48px] h-[62px] w-[2px] ${step.done ? "bg-[#5CC781]" : "bg-neutral-200"}`} />}

              <div className={`relative z-10 grid h-12 w-12 place-items-center rounded-full border !font-['Montserrat'] font-black ${step.done ? "border-[#5CC781] bg-[#5CC781] text-white" : step.active ? "border-[#2563EB] bg-[#2563EB] text-white" : "border-neutral-200 bg-white text-neutral-400"}`}>
                {step.number}
              </div>

              <div className={step.active || step.done ? "" : "opacity-45"}>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="!font-['Montserrat'] text-xl font-bold text-[#111111]">{step.title}</h3>
                  {step.status && <span className={`rounded-full px-3 py-1 !font-['Montserrat'] text-xs font-bold ${step.done ? "bg-[#5CC781]/10 text-[#5CC781]" : "bg-[#2563EB] text-white"}`}>{step.done ? "✓ " : ""}{step.status}</span>}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {step.skills.map((skill) => (
                    <span key={skill} className={`rounded-full border px-3 py-1.5 !font-['Montserrat'] text-sm ${step.done ? "border-[#5CC781]/25 bg-[#5CC781]/5 text-[#5CC781]" : step.active ? "border-[#2563EB]/25 bg-[#2563EB]/5 text-[#2563EB]" : "border-neutral-200 bg-white text-neutral-400"}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-[24px] border border-black/10 bg-white p-7 shadow-[0_12px_35px_rgba(0,0,0,0.05)]">
          <span className="!font-['Montserrat'] text-xs font-black uppercase tracking-[0.16em] text-neutral-500">Matriz de habilidades</span>
          <div className="mt-6 space-y-4">
            {skillRows.map(([label, value, color]) => (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between !font-['Montserrat'] text-sm">
                  <span>{label}</span>
                  <span style={{ color }}>{value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                  <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-black/10 bg-white p-7 shadow-[0_12px_35px_rgba(0,0,0,0.05)]">
          <span className="!font-['Montserrat'] text-xs font-black uppercase tracking-[0.16em] text-neutral-500">Próximos hitos</span>
          <div className="mt-6 space-y-4">
            {[
              ["#2563EB", "Completar módulo 2", "Esta semana"],
              ["#5CC781", "Certificación de Liderazgo", "Jun 2026"],
              ["#F5B63D", "Especialización en Estrategia", "Ago 2026"],
            ].map(([color, title, date]) => (
              <div key={title} className="flex items-center justify-between rounded-[16px] border border-black/5 bg-white px-5 py-4">
                <span className="flex items-center gap-3 !font-['Montserrat'] text-sm font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                  {title}
                </span>
                <span className="!font-['Montserrat'] text-xs text-neutral-400">{date}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function CvTab({ backendBaseUrl, me, learningRoute }) {
  const [subTab, setSubTab] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingLast, setLoadingLast] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const email = me?.email || learningRoute?.email || "";
  const routeId = learningRoute?.route_id || learningRoute?.id || "";

  const loadLastAnalysis = async () => {
    if (!email) return;

    setLoadingLast(true);
    setErrorMsg("");

    try {
      const res = await getJSON(
        `${backendBaseUrl}/api/account/cv/last-analysis/?email=${encodeURIComponent(email)}`
      );
      setAnalysis(res?.data || null);
    } catch (error) {
      setErrorMsg(error?.message || "No se pudo cargar el último análisis.");
    } finally {
      setLoadingLast(false);
    }
  };

  useEffect(() => {
    if (subTab === "history") loadLastAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subTab]);

  const handleFileChange = (file) => {
    setErrorMsg("");

    if (!file) {
      setSelectedFile(null);
      setFileName("");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (file.size > maxSize) {
      setErrorMsg("El archivo no puede superar los 5MB.");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setErrorMsg("Solo se permiten archivos PDF o Word.");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
  };

  const analyzeCv = async () => {
    if (!selectedFile) {
      setErrorMsg("Selecciona un archivo para analizar.");
      return;
    }

    setLoadingAnalysis(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("language", "es-CO");
      formData.append("email", email);
      if (routeId) formData.append("route_id", routeId);

      const res = await postFormData(
        `${backendBaseUrl}/api/account/cv/analyze/`,
        formData
      );

      const nextAnalysis = res?.data || null;

      setAnalysis(nextAnalysis);
      setSubTab("history");
      toast.success("CV analizado correctamente.");
    } catch (error) {
      setErrorMsg(error?.message || "No se pudo analizar el CV.");
      toast.error(error?.message || "No se pudo analizar el CV.");
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const score = analysis?.score || {};
  const recommendations = Array.isArray(analysis?.recommendations)
    ? analysis.recommendations
    : [];

  const strengths = recommendations.filter((item) => item.type === "strength");
  const improvements = recommendations.filter((item) => item.type === "improvement");

  return (
    <div className="relative w-full">
      {loadingAnalysis && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/55 px-5 backdrop-blur-sm">
          <div className="w-full max-w-[520px] rounded-[30px] bg-white p-8 text-center shadow-[0_35px_100px_rgba(0,0,0,0.28)]">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#2563EB]/10 text-[#2563EB]">
              <span className="animate-pulse text-4xl">★</span>
            </div>

            <h2 className="mt-5 !font-['Montserrat'] text-2xl font-black text-[#111111]">
              Analizando tu CV...
            </h2>

            <p className="mt-2 !font-['Montserrat'] text-neutral-500">
              Estamos revisando tu hoja de vida y generando recomendaciones personalizadas.
            </p>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-[#2563EB]" />
            </div>

            <p className="mt-4 !font-['Montserrat'] text-sm font-semibold text-neutral-400">
              Esto puede tardar algunos segundos.
            </p>
          </div>
        </div>
      )}

      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="!font-['Montserrat'] text-[2rem] font-bold leading-[1em] text-[#111111]">
            Mi CV
          </h1>
          <p className="!font-['Montserrat'] leading-[1.2em] text-neutral-500">
            Analiza tu hoja de vida y recibe recomendaciones personalizadas.
          </p>
        </div>

        <div className="flex w-fit rounded-[18px] border border-black/10 bg-white p-1 shadow-sm">
          {[
            ["upload", "Subir CV"],
            ["history", "Último análisis"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSubTab(key)}
              className={`rounded-[14px] px-6 py-3 !font-['Montserrat'] text-sm font-bold transition md:px-8 ${
                subTab === key
                  ? "bg-[#2563EB] text-white shadow-[0_12px_25px_rgba(25,65,207,0.25)]"
                  : "text-neutral-600 hover:bg-[#F6F4EF]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {subTab === "upload" ? (
        <section className="grid w-full grid-cols-1 gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[26px] border border-black/10 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.05)]">
            <div className="flex items-start gap-4">
              <StarMark />
              <div className="w-[90%]">
                <h2 className="!font-['Montserrat'] text-xl font-black text-[#111111]">
                  Mejora tu perfil profesional
                </h2>
                <p className="!font-['Montserrat'] text-sm leading-[1.5em] text-neutral-500">
                  Analizaremos tu CV y te daremos recomendaciones concretas para mejorarlo.
                  <strong className="text-[#111111]"> Es gratis, siempre.</strong>
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2">
              {[
                "Score general sobre 10",
                "Resumen del perfil",
                "5 recomendaciones accionables",
                "Reporte PDF descargable",
              ].map((item) => (
                <div key={item} className="rounded-[16px] bg-[#F6F4EF] px-4 py-2 !font-['Montserrat'] text-sm font-semibold text-neutral-600">
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="flex min-h-[310px] cursor-pointer flex-col items-center justify-center rounded-[26px] border-2 border-dashed border-[#2563EB]/25 bg-white p-8 text-center shadow-[0_12px_35px_rgba(0,0,0,0.05)] transition hover:border-[#2563EB]/55">
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={(event) => handleFileChange(event.target.files?.[0])}
              />

              <span className="grid h-16 w-16 place-items-center rounded-[18px] bg-[#2563EB]/10 text-4xl text-[#2563EB]">
                ⇧
              </span>

              <h2 className="mt-5 !font-['Montserrat'] text-xl font-black text-[#111111]">
                Arrastra tu CV aquí o selecciona un archivo
              </h2>

              <span className="mt-5 rounded-full border border-[#2563EB] px-7 py-3 !font-['Montserrat'] text-sm font-bold text-[#2563EB]">
                Seleccionar archivo
              </span>

              <p className="mt-5 !font-['Montserrat'] text-sm text-neutral-400">
                PDF o Word (.docx) · Máximo 5MB
              </p>

              {fileName && (
                <p className="mt-4 rounded-full bg-[#5CC781]/10 px-4 py-2 !font-['Montserrat'] text-sm font-bold text-[#5CC781]">
                  {fileName}
                </p>
              )}
            </label>

            {errorMsg && (
              <div className="mt-5 rounded-[16px] border border-red-100 bg-red-50 px-5 py-4 !font-['Montserrat'] text-sm font-semibold text-red-600">
                {errorMsg}
              </div>
            )}

            <button
              type="button"
              disabled={!selectedFile || loadingAnalysis}
              onClick={analyzeCv}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-[18px] bg-[#2563EB] px-7 py-5 !font-['Montserrat'] text-lg font-bold text-white shadow-[0_18px_45px_rgba(25,65,207,0.25)] transition hover:-translate-y-0.5 disabled:bg-neutral-400 disabled:shadow-none"
            >
              {loadingAnalysis ? "Analizando CV..." : "Analizar mi CV →"}
            </button>
          </div>
        </section>
      ) : (
        <section className="w-full rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.05)] md:p-8">
          {loadingLast ? (
            <p className="!font-['Montserrat'] text-neutral-500">
              Cargando último análisis...
            </p>
          ) : analysis ? (
            <>
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_280px]">
                <div>
                  <span className="!font-['Montserrat'] text-xs font-black uppercase tracking-[0.16em] text-[#2563EB]">
                    Análisis completado
                  </span>

                  <h2 className="mt-1 line-clamp-2 !font-['Montserrat'] text-2xl font-black text-[#111111]">
                    {analysis.filename || "CV analizado"}
                  </h2>

                  <p className="mt-1 !font-['Montserrat'] text-sm text-neutral-400">
                    Analizado el {fmtDate(analysis.analyzedAt || analysis.analyzed_at)}
                  </p>

                  
                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-[18px] flex gap-3 border border-[#5CC781]/20 bg-[#5CC781]/5 p-5">
                      <div className="!font-['Montserrat'] text-5xl font-black text-[#5CC781]">
                        {strengths.length}
                      </div>
                      <div>
                        <span className="!font-['Montserrat'] text-xs font-black uppercase text-[#5CC781]">
                          Fortalezas detectadas
                        </span>
                        <p className="!font-['Montserrat'] text-sm text-neutral-500">
                          Puntos positivos identificados en tu CV.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[18px] flex gap-3 border border-[#FDBA3B]/20 bg-[#FDBA3B]/10 p-5">
                      <div className="!font-['Montserrat'] text-5xl font-black text-[#D99000]">
                        {improvements.length}
                      </div>
                      <div>
                        <span className="!font-['Montserrat'] text-xs font-black uppercase text-[#D99000]">
                          Mejoras sugeridas
                        </span>
                        <p className="!font-['Montserrat'] text-sm text-neutral-500">
                          Acciones recomendadas para optimizar tu perfil.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] bg-[#1941CF] p-6 text-center text-white shadow-[0_20px_50px_rgba(25,65,207,0.22)]">
                  <div className="">
                      <span className="!font-['Montserrat'] text-xs font-black uppercase text-white/80">
                        Score general
                      </span>
                      <div className="mt-2 !font-['Montserrat'] text-6xl font-black text-white">
                        {score.value || 0} / {score.max || 10}
                      </div>
                      <p className="mt-1 !font-['Montserrat'] text-sm font-bold text-white/90">
                        {score.label || "Resultado"} · {score.percentage || 0}%
                      </p>
                    </div>
                  {analysis?.report?.signedUrl && (
                    <a
                      href={analysis.report.signedUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex w-full justify-center rounded-[16px] bg-white px-5 py-3 !font-['Montserrat'] text-sm font-black text-[#1941CF]"
                    >
                      Descargar PDF →
                    </a>
                  )}
                </div>
              </div>
              <div className="mt-3 rounded-[20px] bg-[#F6F4EF] p-5">
                <h3 className="!font-['Montserrat'] text-lg font-black text-[#111111]">
                  Resumen
                </h3>
                <p className="!font-['Montserrat'] leading-[1.55em] text-neutral-600">
                  {analysis.summary || "No hay resumen disponible."}
                </p>
              </div>

              <div className="mt-7">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3 className="!font-['Montserrat'] text-xl font-black text-[#111111]">
                      Recomendaciones
                    </h3>
                    <p className="!font-['Montserrat'] text-sm text-neutral-500">
                      Acciones concretas para fortalecer tu hoja de vida.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSubTab("upload")}
                    className="w-fit rounded-full border border-black/10 px-5 py-2 !font-['Montserrat'] text-sm font-black text-[#111111] hover:bg-[#F6F4EF]"
                  >
                    Analizar otro CV
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {recommendations.map((item, index) => (
                    <article
                      key={`${item.title}-${index}`}
                      className="rounded-[20px] border border-black/10 bg-white p-5 shadow-[0_10px_28px_rgba(0,0,0,0.04)]"
                    >
                      <span
                        className={`rounded-full px-3 py-1 !font-['Montserrat'] text-[11px] font-black uppercase ${
                          item.type === "strength"
                            ? "bg-[#5CC781]/10 text-[#5CC781]"
                            : "bg-[#FDBA3B]/12 text-[#D99000]"
                        }`}
                      >
                        {item.type === "strength" ? "Fortaleza" : "Mejora"} ·{" "}
                        {item.priority || "medium"}
                      </span>

                      <h4 className="mt-3 !font-['Montserrat'] text-lg font-black leading-tight text-[#111111]">
                        {item.title}
                      </h4>

                      <p className="mt-2 !font-['Montserrat'] text-sm leading-[1.45em] text-neutral-500">
                        {item.detail}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-[22px] bg-[#F6F4EF] p-8">
              <h2 className="!font-['Montserrat'] text-xl font-bold">
                Aún no hay análisis
              </h2>
              <p className="mt-2 !font-['Montserrat'] text-neutral-500">
                Cuando analices tu CV, aparecerán aquí las recomendaciones.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function ProfileTab({ me }) {
  const [profileTab, setProfileTab] = useState("basic");

  return (
    <>
      <div className="mb-5 flex flex-wrap w-full justify-between items-center">
        <h1 className="!font-['Montserrat'] text-[2rem] font-bold tracking-[-0.04em] text-[#111111]">Mi perfil</h1>

        <div className="flex max-w-[610px] w-full rounded-[18px] border border-black/10 bg-white p-1 shadow-sm">
          {[["basic", "Información básica"], ["progress", "Progreso"], ["certs", "Certificaciones"]].map(([key, label]) => (
            <button key={key} type="button" onClick={() => setProfileTab(key)} className={`flex-1 rounded-[14px] px-4 py-3 !font-['Montserrat'] text-sm font-semibold transition ${profileTab === key ? "bg-[#100A0D] text-white" : "text-neutral-600 hover:bg-[#F6F4EF]"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>
      {profileTab === "basic" ? (
        <section className="max-w-[760px] rounded-[24px] border border-black/10 bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.05)]">
          <span className="!font-['Montserrat'] text-xs font-black uppercase tracking-[0.16em] text-neutral-500">Información básica</span>
          <div className="mt-3 space-y-3">
            {[["Nombre completo", me?.full_name || me?.name || "Usuario top.education"], ["Correo electrónico", me?.email || "—"], ["País", me?.country || "Colombia"], ["Idioma", me?.language || "Español"]].map(([label, value]) => (
              <label key={label} className="block !font-['Montserrat'] text-sm text-neutral-600">
                {label}
                <input value={value} readOnly className="mt-1 w-full rounded-[16px] border border-black/10 bg-[#F6F4EF] px-5 py-3 text-[17px] text-[#111111] outline-none" />
              </label>
            ))}
          </div>

          <button type="button" className="mt-8 rounded-full bg-[#2563EB] px-7 py-3 !font-['Montserrat'] text-sm font-bold text-white shadow-[0_12px_28px_rgba(25,65,207,0.22)]">
            Guardar cambios
          </button>
        </section>
      ) : (
        <section className="max-w-[760px] rounded-[24px] border border-black/10 bg-white p-8 shadow-[0_12px_35px_rgba(0,0,0,0.05)]">
          <h2 className="!font-['Montserrat'] text-xl font-bold text-[#111111]">Próximamente</h2>
          <p className="mt-2 !font-['Montserrat'] text-neutral-500">Esta sección quedará conectada con el progreso real del usuario.</p>
        </section>
      )}
    </>
  );
}

function LicenseTab({ me, purchases, invoices, paymentMethods, load, backendBaseUrl, learningRoute }) {
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [planModal, setPlanModal] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [cancelStep, setCancelStep] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  const planDetails = getPlanDetails(me, learningRoute);

  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [invoiceModalUrl, setInvoiceModalUrl] = useState("");

  const openInvoiceModal = (url) => {
    setInvoiceModalUrl(url);
    setInvoiceModalOpen(true);
  };

  const isCancelScheduled = Boolean(me?.cancel_at_period_end);

  const [billingCycle, setBillingCycle] = useState(
    planDetails.billingCycle || "monthly"
  );

  useEffect(() => {
    setBillingCycle(planDetails.billingCycle || "monthly");
  }, [planDetails.billingCycle]);

  const isAnnual = billingCycle === "yearly";

  const plans = [
    PLAN_CATALOG.free,
    PLAN_CATALOG.basic,
    PLAN_CATALOG.x,
    PLAN_CATALOG.plus,
  ].filter(Boolean);

  const subscriptionStatus =
    me?.subscription_status || me?.subscription?.status || "free";

  const isTrial =
    subscriptionStatus === "trialing" ||
    subscriptionStatus === "pro_trialing" ||
    Boolean(me?.trial_end);

  const trialStart =
    me?.trial_start ||
    me?.subscription_trial_start ||
    me?.subscription?.trial_start ||
    learningRoute?.trial_start ||
    null;

  const trialEnd =
    me?.trial_end ||
    me?.subscription_trial_end ||
    me?.current_period_end ||
    me?.subscription_renewal ||
    me?.subscription?.current_period_end ||
    learningRoute?.trial_end ||
    null;

  const firstChargeDate =
    trialEnd || me?.current_period_end || me?.subscription_renewal || null;

  const trialDays = daysUntil(trialEnd);
  const progressWidth = trialPercentLeft(trialEnd, trialStart);

  const currentPlanMonthlyValue = Number(planDetails.monthlyValue || 0);
  const currentPlanYearlyValue = Number(planDetails.yearlyValue || 0);
  const currentDisplayedValue =
    planDetails.billingCycle === "yearly"
      ? currentPlanYearlyValue
      : currentPlanMonthlyValue;

  const currentActivePrice = planDetails.activePrice || planDetails.monthlyPrice || "$0";

  const getPlanFeatures = (plan) => {
    if (Array.isArray(plan.features) && plan.features.length) return plan.features;
    if (Array.isArray(plan.includes) && plan.includes.length) {
      return plan.includes.slice(0, 5);
    }
    return [];
  };
  const openBillingPortal = async () => {
    try {
      const res = await postJSON(`${backendBaseUrl}/api/billing/portal/`);
      const url = res?.data?.url;

      if (!url) throw new Error("Stripe no devolvió el portal.");

      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(error?.message || "No fue posible abrir el portal de facturación.");
    }
  };

  const reactivateSubscription = async () => {
    try {
      await postJSON(`${backendBaseUrl}/api/billing/subscription/reactivate/`);
      await load();
      toast.success("Tu suscripción fue reactivada correctamente.");
    } catch (error) {
      toast.error(error?.message || "No fue posible reactivar la suscripción.");
    }
  };

  const confirmCancelSubscription = async () => {
    if (!cancelReason) {
      toast.error("Selecciona una razón para cancelar.");
      return;
    }

    setCancelLoading(true);

    try {
      await postJSON(`${backendBaseUrl}/api/billing/subscription/cancel/`, {
        reason: cancelReason,
      });

      await load();
      setCancelStep(null);
      setCancelReason("");

      toast.success("Tu suscripción se cancelará al finalizar el período actual.");
    } catch (error) {
      toast.error(error?.message || "No fue posible cancelar la suscripción.");
    } finally {
      setCancelLoading(false);
    }
  };

  const deletePaymentMethod = async (method) => {
    const ok = window.confirm(`¿Eliminar la tarjeta terminada en ${method.last4}?`);
    if (!ok) return;

    try {
      await postJSON(`${backendBaseUrl}/api/billing/payment-methods/${method.id}/delete/`);
      await load();
      toast.success("Método de pago eliminado.");
    } catch (error) {
      toast.error(error?.message || "No fue posible eliminar el método de pago.");
    }
  };

  const setDefaultMethod = async (methodId) => {
    try {
      await postJSON(`${backendBaseUrl}/api/billing/payment-methods/${methodId}/default/`);
      await load();
      toast.success("Método de pago principal actualizado.");
    } catch {
      toast.error("No fue posible cambiar el método principal.");
    }
  };

  const openPlanModal = (targetPlan) => {
    const samePlan = targetPlan.key === planDetails.key;
    const sameCycle =
      targetPlan.key === "free" ||
      targetPlan.billingCycle === planDetails.billingCycle;

    if (samePlan && sameCycle) return;

    const targetPriceNumber = Number(targetPlan.priceNumber || 0);
    const isUpgrade = targetPriceNumber > currentDisplayedValue;

    setPlanModal({
      type: isUpgrade ? "upgrade" : "downgrade",
      targetPlan,
    });
  };

  const confirmPlanChange = async () => {
    if (!planModal?.targetPlan) return;

    const targetKey = planModal.targetPlan.key;

    const planValue =
      planModal?.targetPlan?.targetPlanValue ||
      (targetKey === "free" ? "free" : `${billingCycle}_${targetKey}`);

    setPlanLoading(true);

    try {
      await postJSON(`${backendBaseUrl}/api/billing/subscription/change-plan/`, {
        plan: planValue,
      });

      await load();
      toast.success("Plan actualizado correctamente.");
      setPlanModal(null);
    } catch (error) {
      toast.error(error?.message || "No fue posible cambiar el plan.");
    } finally {
      setPlanLoading(false);
    }
  };

  return (
    <>
      <div className="mb-3">
        <h1 className="!font-['Montserrat'] text-[2rem] font-semibold leading-[1.1em] text-[#111111]">
          Gestionar Membresía
        </h1>
        
        <p className="!font-['Montserrat'] leading-[1.2em] text-neutral-500">
          Administra tu plan, beneficios y método de pago desde un solo lugar.
        </p>
        {isCancelScheduled && (
          <div className="mb-5 mt-2 rounded-[18px] border border-[#FDBA3B]/30 bg-[#FFF7E8] p-4 !font-['Montserrat']">
            <h3 className="font-black !font-['Montserrat'] text-[#111111]">
              Tu suscripción está cancelada
            </h3>
            <p className="text-sm text-neutral-600">
              Mantendrás acceso hasta el {fmtDate(me?.current_period_end)}. Después de esa fecha tu acceso será restringido.
            </p>
          </div>
        )}
      </div>

      <section className="rounded-[24px] bg-[#1941CF] p-5 text-white shadow-[0_24px_65px_rgba(37,58,207,0.22)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="!font-['Montserrat'] text-[1.65rem] font-black">
                {planDetails.title}
              </h2>

              <span className="rounded-full bg-[#6EC982] px-3 py-1 !font-['Montserrat'] text-xs font-black text-white">
                {isTrial && planDetails.key !== "free" ? "PRUEBA ACTIVA" : "PLAN ACTUAL"}
              </span>

              <span className="rounded-full bg-white/15 px-3 py-1 !font-['Montserrat'] text-xs font-black text-white">
                {planDetails.key === "free"
                  ? "GRATIS"
                  : planDetails.billingCycle === "yearly"
                  ? "ANUAL"
                  : "MENSUAL"}
              </span>
            </div>

            <p className="mt-2 max-w-[720px] !font-['Montserrat'] text-sm leading-[1.45em] text-white/80">
              {planDetails.planLine}
            </p>

            <div className="mt-3 flex flex-wrap gap-2 lg:gap-3">
              {(planDetails.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/16 px-3 py-1 lg:px-4 lg:py-2 !font-['Montserrat'] text-[12px] lg:text-sm font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="md:text-right">
            <div className="!font-['Montserrat'] text-[2.6rem] font-black leading-none">
              {currentActivePrice}
            </div>

            {planDetails.key !== "free" && (
              <div className="mt-1 !font-['Montserrat'] text-sm text-white/80">
                USD / mes · {planDetails.billingCycle === "yearly" ? "Facturación anual" : "Facturación mensual"}
              </div>
            )}

            {planDetails.key !== "free" && planDetails.billingCycle === "yearly" && planDetails.yearlyTotal && (
              <div className="mt-1 !font-['Montserrat'] text-xs font-semibold text-white/70">
                {planDetails.yearlyTotal}
              </div>
            )}
          </div>
        </div>

        {isTrial && planDetails.key !== "free" && (
          <div className="mt-4 border-t border-white/20 pt-4">
            <div className="flex items-center justify-between !font-['Montserrat']">
              <span>Período de prueba</span>
              <strong>{trialDays ?? 7} días restantes</strong>
            </div>

            <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-[#FFD23F]"
                style={{ width: `${progressWidth}%` }}
              />
            </div>

            <p className="mt-2 !font-['Montserrat'] text-sm text-white/80">
              Próximo cobro: {fmtDate(firstChargeDate)} · {currentActivePrice} USD
            </p>
          </div>
        )}
      </section>

      <section className="mt-5 rounded-[24px] border border-black/10 bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="!font-['Montserrat'] text-xl font-semibold text-[#111111]">
              Cambiar plan
            </h2>
            <p className="!font-['Montserrat'] text-neutral-500">
              Actualiza tu experiencia o cambia entre facturación mensual y anual.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 !font-['Montserrat']">
            <span className={!isAnnual ? "font-black text-[#111111]" : "font-semibold text-neutral-500"}>
              Mensual
            </span>

            <button
              type="button"
              onClick={() =>
                setBillingCycle((prev) => (prev === "monthly" ? "yearly" : "monthly"))
              }
              className={`relative h-8 w-[70px] rounded-full p-1 transition ${
                isAnnual ? "bg-[#1941CF]" : "bg-neutral-300"
              }`}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-white shadow transition ${
                  isAnnual ? "translate-x-9" : "translate-x-0"
                }`}
              />
            </button>

            <span className={isAnnual ? "font-black text-[#111111]" : "font-semibold text-neutral-500"}>
              Anual
            </span>

            <span className="rounded-full bg-[#6EC982] px-3 py-1 text-xs font-black text-white">
              Ahorra 14%
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => {
            const targetPlanValue =
              billingCycle === "yearly"
                ? plan.yearlyPlanValue
                : plan.monthlyPlanValue;

            const targetPriceNumber =
              billingCycle === "yearly"
                ? Number(plan.yearlyValue || 0)
                : Number(plan.monthlyValue || 0);

            const active =
              planDetails.key === plan.key &&
              (plan.key === "free" || planDetails.billingCycle === billingCycle);

            const isDowngrade = !active && targetPriceNumber < currentDisplayedValue;
            const isPlanX = plan.key === "x";
            const isPlus = plan.key === "plus";

            const shownPrice = isAnnual ? plan.yearlyPrice : plan.monthlyPrice;
            const features = getPlanFeatures(plan);

            return (
              <div
                key={plan.key}
                className={`relative flex min-h-[390px] flex-col rounded-[22px] border p-4 transition ${
                  active
                    ? "border-[#1941CF] bg-[#1941CF]/5 shadow-[0_18px_45px_rgba(37,58,207,0.10)]"
                    : isPlanX
                    ? "border-[#1941CF]/35 bg-white"
                    : isPlus
                    ? "border-[#FDBA3B]/45 bg-white"
                    : "border-black/10 bg-white"
                }`}
              >
                {active && (
                  <span className="absolute left-5 top-[-12px] rounded-full bg-[#1941CF] px-3 py-1 !font-['Montserrat'] text-[10px] font-black text-white">
                    PLAN ACTUAL · {plan.key === "free" ? "FREE" : isAnnual ? "ANUAL" : "MENSUAL"}
                  </span>
                )}

                {isPlanX && !active && (
                  <span className="absolute left-5 top-[-12px] rounded-full bg-[#FDBA3B] px-3 py-1 !font-['Montserrat'] text-[10px] font-black text-white">
                    MÁS POPULAR
                  </span>
                )}

                {isDowngrade && (
                  <span className="absolute right-3 top-3 rounded-full bg-red-50 px-3 py-1 !font-['Montserrat'] text-[10px] font-black text-red-500">
                    DOWNGRADE
                  </span>
                )}

                <h3 className="mt-4 !font-['Montserrat'] text-xl font-black leading-tight text-[#111111]">
                  {plan.title}
                </h3>

                <div className="mt-3 flex items-end gap-2">
                  <strong className="!font-['Montserrat'] text-[2.8rem] font-black leading-none text-[#111111]">
                    {shownPrice}
                  </strong>

                  {plan.key !== "free" && (
                    <span className="mb-2 !font-['Montserrat'] text-sm font-semibold text-neutral-500">
                      USD / mes
                    </span>
                  )}
                </div>

                {plan.key !== "free" && (
                  <p className="mt-2 !font-['Montserrat'] text-sm text-neutral-500">
                    {isAnnual ? (
                      <>
                        {plan.yearlyTotal} ·{" "}
                        <span className="font-black text-[#6EC982]">
                          {plan.yearlySaving}
                        </span>
                      </>
                    ) : (
                      <>o {plan.yearlyTotal}</>
                    )}
                  </p>
                )}

                <p className="mt-4 !font-['Montserrat'] text-sm leading-[1.45em] text-neutral-600">
                  {plan.planLine}
                </p>

                <div className="mt-2 flex flex-wrap gap-1">
                  {(plan.tags || []).slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#F6F4EF] px-2 py-1 !font-['Montserrat'] text-[10px] font-bold text-neutral-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <span className="mt-5 !font-['Montserrat'] text-xs font-black uppercase text-[#111111]">
                  Resumen:
                </span>

                <ul className="mt-2 mb-3 space-y-1.5 !font-['Montserrat'] text-[12px] leading-[1.2em] text-neutral-700">
                  {features.slice(0, 5).map((feature) => (
                    <li key={feature} className="text-[#5CC781]">
                      ✓ <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() =>
                    openPlanModal({
                      ...plan,
                      priceNumber: targetPriceNumber,
                      changePrice:
                        plan.key === "free"
                          ? "Gratis"
                          : `${shownPrice} USD / mes`,
                      targetPlanValue,
                      billingCycle,
                    })
                  }
                  disabled={active}
                  className={`mt-auto rounded-[14px] px-3 py-2 leading-[1.2em] !font-['Montserrat'] text-sm font-semibold transition ${
                    active
                      ? "bg-[#F6F4EF] text-neutral-400"
                      : isPlus || isPlanX
                      ? "bg-[#1941CF] text-white hover:bg-[#1036B8]"
                      : "border border-black/10 text-[#111111] hover:bg-[#F6F4EF]"
                  }`}
                >
                  {active
                    ? "Plan actual"
                    : plan.key === "free"
                    ? "Cambiar a Free"
                    : `Cambiar a ${plan.title} ${isAnnual ? "Anual" : "Mensual"}`}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-[24px] border border-black/10 bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.05)]">
          <h2 className="!font-['Montserrat'] text-xl font-semibold text-[#111111]">
            Método de pago
          </h2>
          <p className="!font-['Montserrat'] text-neutral-500">
            Administra tus tarjetas y métodos de pago.
          </p>

          <div className="mt-3 space-y-3">
            {paymentMethods.length ? (
              paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between rounded-[16px] border border-black/10 bg-[#F6F4EF] p-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="rounded-[6px] bg-[#091A60] px-3 py-2 !font-['Montserrat'] text-xs font-black uppercase text-white">
                      {method.brand || "CARD"}
                    </span>
                    <div>
                      <p className="!font-['Montserrat'] text-sm font-bold text-[#111111]">
                        •••• •••• •••• {method.last4 || "—"}
                      </p>
                      <p className="!font-['Montserrat'] text-sm text-neutral-400">
                        Vence {method.exp_month || "—"}/{method.exp_year || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {method.is_default ? (
                      <span className="rounded-full bg-[#5CC781]/10 px-3 py-1 !font-['Montserrat'] text-xs font-black text-[#5CC781]">
                        Principal
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDefaultMethod(method.id)}
                        className="rounded-full border border-[#5CC781]/35 px-3 py-1 !font-['Montserrat'] text-xs font-black text-[#5CC781]"
                      >
                        Hacer principal
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => deletePaymentMethod(method)}
                      className="grid h-8 w-8 place-items-center rounded-full text-neutral-400 transition hover:bg-red-50 hover:text-red-500"
                      title="Eliminar método de pago"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[16px] border border-black/10 bg-[#F6F4EF] p-5 !font-['Montserrat'] text-sm text-neutral-500">
                Aún no tienes métodos de pago guardados.
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowAddMethod(true)}
              className="!font-['Montserrat'] text-sm font-black text-[#2563EB]"
            >
              + Agregar método de pago
            </button>
          </div>
        </section>

        <section className="rounded-[24px] border border-black/10 bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.05)]">
          <h2 className="!font-['Montserrat'] text-xl font-semibold text-[#111111]">
            Cancelar suscripción
          </h2>

          <div className="mt-3 rounded-[18px] border border-black/10 p-4">
            <h3 className="!font-['Montserrat'] text-lg font-semibold text-[#111111]">
              Cancelar membresía
            </h3>
            <p className="!font-['Montserrat'] text-neutral-500">
              Tu acceso continuará hasta finalizar tu período actual.
            </p>

            {isCancelScheduled ? (
              <button
                type="button"
                onClick={reactivateSubscription}
                className="mt-7 w-full rounded-[14px] bg-[#1941CF] py-4 !font-['Montserrat'] font-semibold text-white"
              >
                Reactivar suscripción
              </button>
            ) : (
              <button
                onClick={() => setCancelStep("reason")}
                disabled={planDetails.key === "free"}
                className="mt-7 w-full rounded-[14px] border border-red-200 py-4 !font-['Montserrat'] font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Cancelar membresía
              </button>
            )}
          </div>
        </section>
      </div>

      <section className="mt-7 rounded-[24px] border border-black/10 bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.05)]">
        <div className="flex flex-wrap justify-between">
          <div>
            <h2 className="!font-['Montserrat'] text-xl font-semibold text-[#111111]">
              Facturación y pagos
            </h2>
            <p className="!font-['Montserrat'] text-neutral-500">
              Descarga facturas y consulta tu historial de pagos.
            </p>
          </div>
          <button
            type="button"
            onClick={openBillingPortal}
            className="rounded-full bg-[#1941CF] mt-2 lg:mt-0 px-5 py-3 !font-['Montserrat'] text-sm font-black text-white"
          >
            Gestionar facturación en Stripe
          </button>
        </div>
        
        <div className="mt-3 overflow-x-auto">
          {invoices.length ? (
            <table className="min-w-full !font-['Montserrat'] text-sm">
              <thead>
                <tr className="border-b border-black/10 text-neutral-500">
                  <th className="py-2 pr-4 text-left">Fecha</th>
                  <th className="py-2 pr-4 text-left">Factura</th>
                  <th className="py-2 pr-4 text-left">Monto</th>
                  <th className="py-2 pr-4 text-left">Estado</th>
                  <th className="py-2 pr-4 text-left">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-black/5">
                    <td className="py-4 pr-4">{fmtDate(invoice.created_at)}</td>
                    <td className="py-4 pr-4">{invoice.number || invoice.id}</td>
                    <td className="py-4 pr-4 font-semibold">
                      {fmtMoney(invoice.amount, invoice.currency)}
                    </td>
                    <td className="py-4 pr-4">
                      <span className="rounded-full bg-[#FDBA3B]/10 px-3 py-1 text-xs font-bold text-[#F5A400]">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        {invoice.hosted_invoice_url && (
                          <button
                            type="button"
                            onClick={() => openInvoiceModal(invoice.hosted_invoice_url)}
                            className="rounded-full bg-[#1941CF] px-4 py-2 !font-['Montserrat'] text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#1234A8]"
                          >
                            Ver factura
                          </button>
                        )}

                        {invoice.invoice_pdf && (
                          <a
                            href={invoice.invoice_pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-[#1941CF]/20 bg-[#EEF2FF] px-4 py-2 !font-['Montserrat'] text-xs font-black text-[#1941CF] transition hover:-translate-y-0.5 hover:bg-[#E0E7FF]"
                          >
                            Descargar PDF
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="rounded-[16px] bg-[#F6F4EF] p-5 !font-['Montserrat'] text-sm text-neutral-500">
              Aún no tienes facturas generadas por Stripe.
            </div>
          )}
        </div>
      </section>

      <AddPaymentMethodModal
        open={showAddMethod}
        onClose={() => setShowAddMethod(false)}
        backendBaseUrl={backendBaseUrl}
        userEmail={me?.email}
        onSaved={load}
      />

      <ChangePlanModal
        open={Boolean(planModal)}
        type={planModal?.type}
        currentPlan={planDetails}
        targetPlan={planModal?.targetPlan}
        onClose={() => setPlanModal(null)}
        onConfirm={confirmPlanChange}
        loading={planLoading}
      />

      {invoiceModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative h-[88vh] w-full max-w-[980px] overflow-hidden rounded-[24px] bg-white shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
              <h3 className="!font-['Montserrat'] text-lg font-black text-[#111111]">
                Vista de factura
              </h3>

              <button
                type="button"
                onClick={() => setInvoiceModalOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              >
                ×
              </button>
            </div>

            <iframe
              src={invoiceModalUrl}
              title="Factura Stripe"
              className="h-[calc(88vh-65px)] w-full"
            />
          </div>
        </div>
      )}

      {cancelStep === "reason" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[540px] rounded-[28px] bg-white p-7 shadow-[0_35px_100px_rgba(0,0,0,0.28)]">
            <h2 className="!font-['Montserrat'] text-[1.7rem] font-semibold text-[#111111]">
              ¿Por qué deseas cancelar?
            </h2>

            <p className="!font-['Montserrat'] text-neutral-500">
              Tu opinión nos ayuda a mejorar. Selecciona la razón principal:
            </p>

            <div className="mt-2 space-y-2">
              {[
                "Es muy costoso",
                "No encontré lo que buscaba",
                "Lo usaré después",
                "Problemas técnicos",
                "Otro",
              ].map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setCancelReason(reason)}
                  className={`flex w-full items-center gap-4 rounded-[14px] border px-5 py-3 text-left !font-['Montserrat'] transition ${
                    cancelReason === reason
                      ? "border-[#1941CF] bg-[#1941CF]/5"
                      : "border-black/10 bg-white hover:bg-[#F6F4EF]"
                  }`}
                >
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full border ${
                      cancelReason === reason ? "border-[#1941CF]" : "border-neutral-300"
                    }`}
                  >
                    {cancelReason === reason && (
                      <span className="h-2.5 w-2.5 rounded-full bg-[#1941CF]" />
                    )}
                  </span>

                  <span className="text-[#111111]">{reason}</span>
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!cancelReason) {
                    toast.error("Selecciona una razón para continuar.");
                    return;
                  }

                  setCancelStep("confirm");
                }}
                className="rounded-[14px] bg-[#1941CF] px-6 py-4 !font-['Montserrat'] font-black text-white"
              >
                Continuar
              </button>

              <button
                type="button"
                onClick={() => {
                  setCancelStep(null);
                  setCancelReason("");
                }}
                className="rounded-[14px] border border-black/10 px-6 py-4 !font-['Montserrat'] font-black text-[#111111]"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}

      {cancelStep === "confirm" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[540px] rounded-[28px] bg-white p-7 shadow-[0_35px_100px_rgba(0,0,0,0.28)]">
            <h2 className="!font-['Montserrat'] text-[1.7rem] font-semibold text-[#111111]">
              Confirmar cancelación
            </h2>

            <p className="!font-['Montserrat'] text-neutral-500">
              Tu acceso a {planDetails.title} continuará hasta el{" "}
              <strong>{fmtDate(firstChargeDate)}</strong>.
            </p>

            <div className="mt-5 rounded-[18px] bg-[#F6F4EF] p-6">
              <h3 className="!font-['Montserrat'] text-lg font-semibold text-[#111111]">
                Después de esta fecha:
              </h3>

              <ul className="mt-2 space-y-2 !font-['Montserrat'] text-neutral-500">
                <li>× No tendrás acceso a proveedores premium</li>
                <li>× No podrás obtener nuevas certificaciones</li>
                <li>× Top Education IA dejará de estar disponible</li>
              </ul>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setCancelStep(null);
                  setCancelReason("");
                }}
                className="rounded-[14px] bg-[#1941CF] px-6 py-4 !font-['Montserrat'] font-semibold text-white"
              >
                Mantener suscripción
              </button>

              <button
                type="button"
                onClick={confirmCancelSubscription}
                disabled={cancelLoading}
                className="rounded-[14px] border border-red-200 px-6 py-4 !font-['Montserrat'] font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
              >
                {cancelLoading ? "Cancelando..." : "Confirmar cancelación"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AccountSkeleton() {
  return (
    <div className="min-h-screen bg-[#F6F4EF]">
      <div className="fixed left-0 top-0 z-30 h-[66px] w-full bg-[#100A0D]" />
      <div className="grid min-h-screen grid-cols-1 pt-[66px] lg:grid-cols-[270px_1fr]">
        <aside className="hidden border-r border-black/10 bg-white lg:block" />
        <main className="px-6 py-10">
          <div className="mx-auto max-w-[1120px] animate-pulse">
            <div className="h-8 w-[280px] rounded-full bg-neutral-200" />
            <div className="mt-4 h-5 w-[460px] rounded-full bg-neutral-200" />
            <div className="mt-10 h-[360px] rounded-[24px] bg-white shadow-sm" />
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="h-[240px] rounded-[24px] bg-white shadow-sm" />
              <div className="h-[240px] rounded-[24px] bg-white shadow-sm" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Account() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [invoices, setInvoices] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  

  const backendBaseUrl = useMemo(() => {
    const fromEnv = process.env.REACT_APP_API_URL || "";
    return (fromEnv).replace(/\/+$/, "");
  }, []);

  const INVOICES_URL = `${backendBaseUrl}/api/billing/invoices/`;
  const BILLING_PORTAL_URL = `${backendBaseUrl}/api/billing/portal/`;
  const ME_URL = `${backendBaseUrl}/api/account/me/`;
  const PURCHASES_URL = `${backendBaseUrl}/api/account/purchases/`;
  const PAYMENT_METHODS_URL = `${backendBaseUrl}/api/billing/payment-methods/`;

  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);

  const learningRoute = location.state?.learningRoute || JSON.parse(localStorage.getItem("learningRoute") || "null");

  const urlTab = searchParams.get("tab");
  const defaultTab = learningRoute?.selected_plan === "free" ? "cv" : "career";
  const [activeTab, setActiveTab] = useState(TABS.some((item) => item.key === urlTab) ? urlTab : defaultTab);

  useEffect(() => {
    if (location.state?.learningRoute) {
      localStorage.setItem("learningRoute", JSON.stringify(location.state.learningRoute));
    }
  }, [location.state]);

  useEffect(() => {
    const nextTab = searchParams.get("tab");
    if (TABS.some((item) => item.key === nextTab) && nextTab !== activeTab) setActiveTab(nextTab);
  }, [searchParams, activeTab]);

  const changeTab = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  async function load() {
    
    setErrorMsg("");
    setLoading(true);

    try {
      const [meRes, purchasesRes, paymentMethodsRes, invoicesRes] = await Promise.all([
        getJSON(ME_URL),
        getJSON(PURCHASES_URL).catch(() => ({ data: [] })),
        getJSON(PAYMENT_METHODS_URL).catch(() => ({ data: [] })),
        getJSON(INVOICES_URL).catch(() => ({ data: [] })),
      ]);

      setInvoices(invoicesRes?.data || []);

      setMe(meRes?.data || meRes);
      setPurchases(normalizePurchases(purchasesRes));
      setPaymentMethods(normalizePaymentMethods(paymentMethodsRes));
    } catch (error) {
      console.error(error);

      if (error?.code === "not_authenticated" || error?.message === "not_authenticated") {
        navigate("/login", { replace: true, state: { from: "/account" } });
        return;
      }

      setErrorMsg(error?.message || String(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!urlTab) setSearchParams({ tab: defaultTab }, { replace: true });

    const alreadyShown = sessionStorage.getItem("accountWelcomeShown");
    if (!alreadyShown) {
      setShowWelcome(true);
      sessionStorage.setItem("accountWelcomeShown", "1");
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <AccountSkeleton />;

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-[#F6F4EF] px-5 py-28">
        <div className="mx-auto max-w-4xl rounded-[24px] border border-red-100 bg-red-50 p-6 text-red-700">
          <h1 className="!font-['Montserrat'] text-xl font-bold">No se pudo cargar tu cuenta</h1>
          <pre className="mt-3 whitespace-pre-wrap break-words text-xs">{errorMsg}</pre>
          <div className="mt-5 flex gap-3">
            <button type="button" onClick={load} className="rounded-full bg-[#111111] px-5 py-3 !font-['Montserrat'] text-sm font-bold text-white">Reintentar</button>
            <button type="button" onClick={() => navigate("/login")} className="rounded-full border border-red-200 px-5 py-3 !font-['Montserrat'] text-sm font-bold text-red-700">Ir a login</button>
          </div>
        </div>
      </div>
    );
  }

  const initial = (me?.email || me?.username || "A").charAt(0).toUpperCase();
  const planDetails = getPlanDetails(me, learningRoute);
  const planLabel = planDetails.badge;

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-[#F6F4EF]">
        <TopBar
          email={me?.email}
          initial={initial}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <MobileMenuDrawer
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          activeTab={activeTab}
          onTabChange={changeTab}
          me={me}
          planLabel={planLabel}
          backendBaseUrl={backendBaseUrl}
          learningRoute={learningRoute}
        />

        <div className="grid min-h-screen grid-cols-1 pt-[66px] lg:grid-cols-[300px_1fr]">
          <Sidebar activeTab={activeTab} learningRoute={learningRoute} onTabChange={changeTab} me={me} planLabel={planLabel} backendBaseUrl={backendBaseUrl} />

          <main className="box-border px-2 py-3 lg:ml-[300px] lg:w-[calc(100vw-300px)] lg:px-12 lg:py-10">
            <div className="mx-auto max-w-[1240px]">

              {activeTab === "career" && <CareerTab learningRoute={learningRoute} />}
              {activeTab === "cv" && (
                <CvTab
                  backendBaseUrl={backendBaseUrl}
                  me={me}
                  learningRoute={learningRoute}
                />
              )}
              {activeTab === "profile" && <ProfileTab me={me} />}
              {activeTab === "license" && (
                <LicenseTab
                  me={me}
                  purchases={purchases}
                  invoices={invoices}
                  paymentMethods={paymentMethods}
                  load={load}
                  backendBaseUrl={backendBaseUrl}
                  learningRoute={learningRoute}
                />
              )}
            </div>
          </main>
        </div>

        <DashboardWelcomeModal open={showWelcome} onClose={() => setShowWelcome(false)} defaultTab={defaultTab} />
      </div>
    </Elements>
  );
}
