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
  LayoutGrid,
  X,
  Menu,
  CheckCircle,
  AlertCircle,
  CircleHelp,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import Seo from "../components/Seo";
import CareerTab from "../components/account/CareerTab";
import AvailableCoursesTab from "../components/account/AvailableCoursesTab";

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

  let data = {};

  try {
    data = text
      ? JSON.parse(text)
      : {};
  } catch {
    throw new Error(
      `El servidor devolvió una respuesta no válida. HTTP ${res.status}`
    );
  }

  if (!res.ok || data?.ok === false) {
    const error = new Error(
      data?.message ||
      data?.detail ||
      data?.error ||
      `HTTP ${res.status}`
    );

    error.code =
      data?.error ||
      "http_error";

    error.status =
      res.status;

    error.data =
      data;

    throw error;
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


function toTimestamp(value) {
  if (!value) return null;

  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

function isSuccessfulPaymentStatus(status) {
  const normalized = String(status || "").trim().toLowerCase();

  return [
    "paid",
    "succeeded",
    "success",
    "complete",
    "completed",
  ].includes(normalized);
}

function getPaymentCreatedAt(payment) {
  return (
    payment?.created_at ||
    payment?.created ||
    payment?.date ||
    payment?.paid_at ||
    payment?.status_transitions?.paid_at ||
    null
  );
}

function getPaymentAmount(payment) {
  const rawAmount =
    payment?.amount_paid ??
    payment?.amount ??
    payment?.amount_total ??
    payment?.total ??
    payment?.amount_due ??
    0;

  const amount = Number(rawAmount);
  return Number.isFinite(amount) ? amount : 0;
}

function hasSuccessfulChargeAfterTrial({
  invoices = [],
  purchases = [],
  trialEnd,
}) {
  const trialEndTimestamp = toTimestamp(trialEnd);
  const payments = [
    ...(Array.isArray(invoices) ? invoices : []),
    ...(Array.isArray(purchases) ? purchases : []),
  ];

  return payments.some((payment) => {
    if (!isSuccessfulPaymentStatus(payment?.status)) return false;
    if (getPaymentAmount(payment) <= 0) return false;

    const createdTimestamp = toTimestamp(getPaymentCreatedAt(payment));

    /*
     * Cuando tenemos la fecha final de la prueba, solo consideramos cobros
     * realizados al terminarla o después. Si el backend no devuelve esa fecha,
     * la existencia de un pago exitoso y con valor positivo evita mostrar una
     * prueba activa indefinidamente.
     */
    if (!trialEndTimestamp) return true;
    if (!createdTimestamp) return false;

    return createdTimestamp >= trialEndTimestamp;
  });
}

function getTrialState({
  me,
  learningRoute,
  invoices = [],
  purchases = [],
  planKey,
}) {
  const subscriptionStatus = String(
    me?.subscription_status ||
      me?.subscription?.status ||
      learningRoute?.subscription_status ||
      ""
  )
    .trim()
    .toLowerCase();

  const explicitTrialActive =
    me?.trial_active ??
    me?.is_trial_active ??
    me?.subscription?.trial_active ??
    learningRoute?.trial_active;

  const trialStart =
    me?.trial_start ||
    me?.subscription_trial_start ||
    me?.subscription?.trial_start ||
    learningRoute?.trial_start ||
    null;

  /*
   * No usamos current_period_end como trial_end. Después del primer cobro,
   * Stripe actualiza current_period_end al final del ciclo pagado y eso hacía
   * que el frontend siguiera mostrando la prueba como activa.
   */
  const trialEnd =
    me?.trial_end ||
    me?.subscription_trial_end ||
    me?.subscription?.trial_end ||
    learningRoute?.trial_end ||
    null;

  const trialEndTimestamp = toTimestamp(trialEnd);
  const now = Date.now();
  const trialHasEnded =
    trialEndTimestamp !== null && trialEndTimestamp <= now;

  const successfulChargeAfterTrial = hasSuccessfulChargeAfterTrial({
    invoices,
    purchases,
    trialEnd,
  });

  const statusSaysTrial = ["trialing", "pro_trialing"].includes(
    subscriptionStatus
  );

  const backendSaysTrial =
    explicitTrialActive === true ||
    String(explicitTrialActive).toLowerCase() === "true";

  const backendSaysNotTrial =
    explicitTrialActive === false ||
    String(explicitTrialActive).toLowerCase() === "false";

  const isActive =
    planKey !== "free" &&
    !backendSaysNotTrial &&
    !trialHasEnded &&
    !successfulChargeAfterTrial &&
    (backendSaysTrial || statusSaysTrial) &&
    Boolean(trialEndTimestamp);

  return {
    isActive,
    trialStart,
    trialEnd,
    daysRemaining: isActive ? daysUntil(trialEnd) : null,
    progressPercent: isActive
      ? trialPercentLeft(trialEnd, trialStart)
      : 0,
    successfulChargeAfterTrial,
  };
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
  const subscription = me?.subscription || {};

  const normalize = (value) =>
    String(value || "")
      .trim()
      .toLowerCase();

  const upper = (value) =>
    String(value || "")
      .trim()
      .toUpperCase();

  /*
   * Primero usamos los campos canónicos del contrato B2C.
   * Estos son más confiables que selected_plan o el estado
   * de la suscripción.
   */
  const tier = upper(
    me?.tier ||
      me?.plan?.tier ||
      subscription?.tier ||
      learningRoute?.tier
  );

  const packageCode = upper(
    me?.package_code ||
      me?.packageCode ||
      me?.plan?.packageCode ||
      subscription?.package_code ||
      subscription?.packageCode ||
      learningRoute?.package_code ||
      learningRoute?.packageCode
  );

  const billingPeriod = upper(
    me?.billing_period ||
      me?.billingPeriod ||
      me?.plan?.billingPeriod ||
      subscription?.billing_period ||
      subscription?.billingPeriod ||
      learningRoute?.billing_period ||
      learningRoute?.billingPeriod
  );

  /*
   * Valores legacy únicamente como respaldo.
   */
  const selectedPlan = normalize(
    me?.selected_plan ||
      me?.subscription_plan ||
      subscription?.selected_plan ||
      learningRoute?.selected_plan
  );

  const selectedPaidPlan = normalize(
    me?.selected_paid_plan ||
      me?.billing_variant ||
      subscription?.selected_paid_plan ||
      learningRoute?.selected_paid_plan
  );

  let planKey = "free";

  /*
   * packageCode tiene máxima prioridad porque identifica
   * inequívocamente el producto contratado.
   */
  if (
    packageCode === "TOP_EDUCATION_PLUS_MONTHLY" ||
    packageCode === "TOP_EDUCATION_PLUS_ANNUAL"
  ) {
    planKey = "plus";
  } else if (
    packageCode === "TOP_EDUCATION_X_MONTHLY" ||
    packageCode === "TOP_EDUCATION_X_ANNUAL"
  ) {
    planKey = "x";
  } else if (
    packageCode === "TOP_EDUCATION_BASIC_MONTHLY" ||
    packageCode === "TOP_EDUCATION_BASIC_ANNUAL"
  ) {
    planKey = "basic";
  } else if (packageCode === "TOP_EDUCATION_FREE") {
    planKey = "free";
  } else if (tier === "PLUS") {
    planKey = "plus";
  } else if (tier === "X") {
    planKey = "x";
  } else if (tier === "BASIC") {
    planKey = "basic";
  } else if (tier === "FREE") {
    planKey = "free";
  } else if (
    selectedPlan.includes("plus") ||
    selectedPaidPlan.includes("plus")
  ) {
    planKey = "plus";
  } else if (
    selectedPlan === "basic" ||
    selectedPaidPlan.includes("basic")
  ) {
    /*
     * Basic debe evaluarse antes que los valores legacy de X.
     */
    planKey = "basic";
  } else if (
    selectedPlan === "x" ||
    selectedPlan === "pro" ||
    selectedPaidPlan === "monthly_x" ||
    selectedPaidPlan === "yearly_x"
  ) {
    planKey = "x";
  }

  const plan =
    PLAN_CATALOG[planKey] ||
    PLAN_CATALOG.free;

  const isYearly =
    billingPeriod === "ANNUAL" ||
    selectedPaidPlan.includes("yearly") ||
    selectedPaidPlan.includes("annual");

  return {
    ...plan,
    billingCycle: isYearly
      ? "yearly"
      : "monthly",
    activePrice: isYearly
      ? plan.yearlyPrice
      : plan.monthlyPrice,
    activePlanValue: isYearly
      ? plan.yearlyPlanValue
      : plan.monthlyPlanValue,
  };
}

// Cambia únicamente estas rutas cuando tengas los PNG definitivos del menú.
// Si un PNG todavía no existe, el componente usa automáticamente el ícono Lucide de respaldo.
const SIDEBAR_ICON_PATHS = {
  career: "/assets/icons/account/plan-carrera.png",
  courses: "/assets/icons/account/cursos-disponibles.png",
  cv: "/assets/icons/account/mi-cv.png",
  profile: "/assets/icons/account/perfil.png",
  license: "/assets/icons/account/licencia.png",
};

const TABS = [
  {
    key: "career",
    label: "Plan de Carrera",
    iconSrc: SIDEBAR_ICON_PATHS.career,
    fallbackIcon: TrendingUp,
  },
  {
    key: "courses",
    label: "Cursos disponibles",
    iconSrc: SIDEBAR_ICON_PATHS.courses,
    fallbackIcon: LayoutGrid,
  },
  {
    key: "cv",
    label: "Mi CV",
    iconSrc: SIDEBAR_ICON_PATHS.cv,
    fallbackIcon: FileText,
  },
  {
    key: "profile",
    label: "Perfil",
    iconSrc: SIDEBAR_ICON_PATHS.profile,
    fallbackIcon: User,
  },
  {
    key: "license",
    label: "Licencia",
    iconSrc: SIDEBAR_ICON_PATHS.license,
    fallbackIcon: Star,
  },
];

function getAccountDisplayName(me) {
  const fullName = [
    me?.first_name || me?.firstName,
    me?.last_name || me?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    me?.full_name ||
    me?.fullName ||
    me?.name ||
    fullName ||
    me?.username ||
    me?.email?.split("@")[0] ||
    "Alumno"
  );
}

function getAccountInitials(me) {
  const displayName = getAccountDisplayName(me);
  const pieces = String(displayName)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!pieces.length) return "A";
  if (pieces.length === 1) return pieces[0].slice(0, 2).toUpperCase();

  return `${pieces[0][0]}${pieces[pieces.length - 1][0]}`.toUpperCase();
}

function NavigationIcon({ item, active = false, size = 20 }) {
  const [imageFailed, setImageFailed] = useState(false);
  const FallbackIcon = item.fallbackIcon;

  if (item.iconSrc && !imageFailed) {
    return (
      <img
        src={item.iconSrc}
        alt=""
        aria-hidden="true"
        onError={() => setImageFailed(true)}
        className={`shrink-0 object-contain ${
          size >= 22 ? "h-[22px] w-[22px]" : "h-5 w-5"
        } ${active ? "brightness-0 invert" : ""}`}
      />
    );
  }

  return (
    <FallbackIcon
      size={size}
      strokeWidth={1.85}
      className={active ? "text-white" : "text-[#667085]"}
    />
  );
}

function StarMark({ small = false }) {
  return (
    <div
      className={`grid place-items-center overflow-hidden rounded-full border border-[#BDEFF5] bg-[#D8F8FB] shadow-[0_12px_30px_rgba(81,170,189,0.18)] ${
        small ? "h-9 w-9" : "h-12 w-12"
      }`}
    >
      <img
        src="/assets/logos/topo-contenedor-claro.png"
        alt="Logo Topo"
        className="h-full w-full rounded-full object-cover"
      />
    </div>
  );
}

function TopBar({ activeLabel, onOpenMobileMenu, onOpenHelp, onOpenProfile }) {
  const navigate = useNavigate();

  const navigateWithTransition = (url) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(url));
    } else {
      navigate(url);
    }
  };

  return (
    <>
      <div className="fixed left-0 top-0 z-50 flex h-[64px] w-full items-center justify-between border-b border-[#E7EAF0] bg-white px-4 lg:left-[236px] lg:w-[calc(100%-236px)] lg:px-8">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="grid h-10 w-10 place-items-center rounded-[12px] border border-[#E2E6EC] bg-white text-[#1A2435] shadow-sm"
            aria-label="Abrir menú"
          >
            <Menu size={21} />
          </button>

          <button
            type="button"
            onClick={() => navigateWithTransition("/inicio")}
            className="text-left"
          >
            <strong className="block !font-['Montserrat'] text-[15px] font-bold leading-none text-[#1B2434]">
              Top Education
            </strong>
            <span className="mt-1 block !font-['Montserrat'] text-[10px] leading-none text-[#8A94A6]">
              Portal Alumno
            </span>
          </button>
        </div>

        <div className="hidden !font-['Montserrat'] text-sm text-[#8A94A6] lg:block">
          Mi espacio de aprendizaje
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenHelp}
            className="grid h-10 w-10 place-items-center rounded-full text-[#253247] transition hover:bg-[#F2F5F9] hover:text-[#315D9C]"
            aria-label="Ayuda"
            title="Ayuda"
          >
            <CircleHelp size={21} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            onClick={onOpenProfile}
            className="grid h-10 w-10 place-items-center rounded-full text-[#253247] transition hover:bg-[#F2F5F9] hover:text-[#315D9C]"
            aria-label="Configuración"
            title="Ir al perfil"
          >
            <Settings size={21} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className="fixed left-0 top-[64px] z-40 flex h-[50px] w-full items-center border-b border-[#EDF0F4] bg-white px-4 lg:left-[236px] lg:w-[calc(100%-236px)] lg:px-8">
        <button
          type="button"
          onClick={() => navigateWithTransition("/inicio")}
          className="!font-['Montserrat'] text-[13px] font-medium text-[#718096] transition hover:text-[#315D9C]"
        >
          Top Education
        </button>
        <ChevronRight size={17} className="mx-2 text-[#AAB2C0]" />
        <span className="truncate !font-['Montserrat'] text-[13px] font-bold text-[#1C2738]">
          {activeLabel}
        </span>
      </div>
    </>
  );
}

function Sidebar({ activeTab, onTabChange, me, planLabel, backendBaseUrl, learningRoute }) {
  const navigate = useNavigate();
  const mxAccessActive = hasActiveMxAccess(me, learningRoute);
  const [openingMxApp, setOpeningMxApp] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const displayName = getAccountDisplayName(me);
  const initials = getAccountInitials(me);

  const goToMxApp = async () => {
    if (!mxAccessActive) {
      toast.error(
        "Tu acceso está inactivo o suspendido. Actualiza tu membresía para ingresar a la app."
      );
      return;
    }

    if (openingMxApp) return;

    const mxWindow = window.open("", "_blank");

    if (!mxWindow) {
      toast.error(
        "Tu navegador bloqueó la nueva pestaña. Habilita las ventanas emergentes para Top Education e intenta nuevamente."
      );
      return;
    }

    try {
      mxWindow.document.title = "Top Education";
      mxWindow.document.body.innerHTML = `
        <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F7F8FA;font-family:Arial,sans-serif;color:#172033;">
          <div style="text-align:center;padding:32px;">
            <div style="width:48px;height:48px;margin:0 auto 18px;border-radius:50%;background:linear-gradient(135deg,#1F3557,#4C77B8);"></div>
            <strong style="font-size:18px;">Preparando tu acceso...</strong>
            <p style="margin-top:8px;color:#7D8799;font-size:14px;">Estamos generando un acceso seguro a la plataforma.</p>
          </div>
        </div>
      `;
    } catch {
      // No bloqueamos el flujo si el navegador impide modificar la pestaña.
    }

    setOpeningMxApp(true);

    try {
      const res = await postJSON(
        `${backendBaseUrl}/api/account/mx/magic-link/refresh/`
      );

      const magicLink =
        res?.data?.magic_link ||
        res?.data?.magicLink ||
        res?.magic_link ||
        res?.magicLink ||
        "";

      if (!magicLink) {
        throw new Error("No se pudo generar el acceso a la plataforma.");
      }

      mxWindow.location.replace(magicLink);
    } catch (error) {
      try {
        mxWindow.close();
      } catch {
        // noop
      }

      toast.error(
        error?.message || "No fue posible generar tu acceso a la plataforma."
      );
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
    <aside className="fixed left-0 top-0 z-[70] hidden h-screen w-[236px] flex-col border-r border-[#E6EAF0] bg-white lg:flex">
      <button
        type="button"
        onClick={() => navigate("/inicio")}
        className="flex h-[64px] min-h-[64px] w-full items-center gap-3 border-b border-[#E7EAF0] bg-white px-4 text-left"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[13px] bg-[#111D31] !font-['Montserrat'] text-[17px] font-bold text-white shadow-[0_8px_20px_rgba(17,29,49,0.14)]">
          T
        </span>
        <span className="min-w-0">
          <strong className="block truncate !font-['Montserrat'] text-[14px] font-bold leading-[1.1] text-[#1C2738]">
            Top Education
          </strong>
          <span className="mt-1 block truncate !font-['Montserrat'] text-[10px] leading-none text-[#8A94A6]">
            Portal Alumno
          </span>
        </span>
      </button>

      <div className="px-3 pt-5">
        <div className="mb-3 flex items-center gap-2 px-1 text-[#8792A4]">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[linear-gradient(135deg,#22395F,#4A70AD)] text-white shadow-sm">
            <ChevronLeft size={14} strokeWidth={2.2} />
          </span>
          <span className="!font-['Montserrat'] text-[10px] font-semibold uppercase tracking-[0.13em]">
            Navegación
          </span>
        </div>

        <nav className="space-y-0">
          {TABS.map((item) => {
            const active = activeTab === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onTabChange(item.key)}
                className={`group flex min-h-[38px] w-full items-center gap-3 rounded-[14px] px-3 py-2 text-left !font-['Montserrat'] text-[13px] font-medium transition-all duration-200 ${
                  active
                    ? "bg-[linear-gradient(105deg,#172A49_0%,#284A7D_52%,#3A65A3_100%)] text-white shadow-[0_9px_22px_rgba(43,80,128,0.20)]"
                    : "text-[#4B5565] hover:bg-[#F3F6FA] hover:text-[#172033]"
                }`}
              >
                <span className={`grid h-6 w-6 shrink-0 place-items-center ${active ? "text-white" : "text-[#6E788A]"}`}>
                  <NavigationIcon item={item} active={active} />
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto px-3 pb-3 pt-5">
        <button
          type="button"
          onClick={goToMxApp}
          disabled={openingMxApp || !mxAccessActive}
          className={`mb-3 flex w-full items-center justify-between rounded-[15px] border px-3 py-3 text-left !font-['Montserrat'] transition ${
            mxAccessActive
              ? "border-[#B9ECF2] bg-[linear-gradient(135deg,#D9FAFC_0%,#C3F3F7_100%)] text-[#18304C] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(75,153,169,0.16)]"
              : "cursor-not-allowed border-[#E1E5EA] bg-[#F1F3F5] text-[#9AA3AF]"
          } ${openingMxApp ? "cursor-wait opacity-70" : ""}`}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-white/75 text-[#315D9C] shadow-sm">
              ↗
            </span>
            <span className="min-w-0">
              <strong className="block truncate text-[12px] font-bold">
                Ir a la App
              </strong>
              <span className="mt-0.5 block truncate text-[10px] opacity-70">
                {openingMxApp
                  ? "Generando acceso..."
                  : mxAccessActive
                  ? "Abrir plataforma"
                  : "Acceso suspendido"}
              </span>
            </span>
          </span>
          <ChevronRight size={15} />
        </button>

        <div className="mb-3 rounded-[15px] bg-[#0D1A2D] p-3 text-white shadow-[0_12px_28px_rgba(13,26,45,0.14)]">
          <div className="flex items-start gap-2.5">
            <StarMark small />
            <div className="min-w-0  max-w-[75%] -mt-2">
              <span className="!font-['Montserrat'] text-[10px] -mt-1 font-bold uppercase text-[#74DCE8]">
                Topo dice
              </span>
              <p className="!font-['Montserrat'] text-[8px] leading-[1.2] text-white/80">
                {streakDays > 0
                  ? `Llevas ${streakDays} días seguidos aprendiendo 🔥 ¡Sigue así!`
                  : "Aún no tienes racha activa. Ingresa a la app para empezar."}
              </p>
            </div>
          </div>
        </div>

        <div className="relative border-t border-[#EDF0F4] pt-3">
          {userMenuOpen && (
            <div className="absolute bottom-[calc(100%+8px)] left-0 right-0 overflow-hidden rounded-[14px] border border-[#E5E9EF] bg-white p-1.5 shadow-[0_16px_40px_rgba(27,39,56,0.16)]">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left !font-['Montserrat'] text-[12px] font-semibold text-[#D34848] transition hover:bg-[#FFF2F2]"
              >
                <LogOut size={17} />
                Cerrar sesión
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setUserMenuOpen((value) => !value)}
            className="flex w-full items-center gap-2.5 rounded-[13px] px-1 py-2 text-left transition hover:bg-[#F6F8FA]"
            aria-expanded={userMenuOpen}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#203B66,#4B72AE)] !font-['Montserrat'] text-[11px] font-bold text-white">
              {initials}
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block truncate !font-['Montserrat'] text-[11px] font-semibold text-[#273244]">
                {displayName}
              </strong>
              <span className="mt-0.5 flex items-center gap-1.5 !font-['Montserrat'] text-[9px] text-[#8993A3]">
                Alumno
                {planLabel && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-[#C0C6D0]" />
                    <span>{planLabel}</span>
                  </>
                )}
              </span>
            </span>
            <ChevronDown
              size={15}
              className={`shrink-0 text-[#98A1AF] transition-transform ${
                userMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
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
  const mxAccessActive = hasActiveMxAccess(me, learningRoute);
  const [openingMxApp, setOpeningMxApp] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const displayName = getAccountDisplayName(me);
  const initials = getAccountInitials(me);

  if (!open) return null;

  const goToMxApp = async () => {
    if (!mxAccessActive) {
      toast.error("Tu acceso está inactivo o suspendido.");
      return;
    }

    setOpeningMxApp(true);

    try {
      const res = await postJSON(
        `${backendBaseUrl}/api/account/mx/magic-link/refresh/`
      );
      const magicLink =
        res?.data?.magic_link ||
        res?.data?.magicLink ||
        res?.magic_link ||
        res?.magicLink;

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
    <div className="fixed inset-0 z-[120] lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-[#0D1726]/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Cerrar menú"
      />

      <aside className="absolute left-0 top-0 flex h-full w-[88vw] max-w-[330px] flex-col bg-white shadow-[24px_0_70px_rgba(13,26,45,0.24)] animate-[mobileDrawerIn_0.25s_ease-out]">
        <div className="flex h-[64px] items-center justify-between border-b border-[#E7EAF0] px-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-[13px] bg-[#111D31] !font-['Montserrat'] text-[17px] font-bold text-white">
              T
            </span>
            <span>
              <strong className="block !font-['Montserrat'] text-[14px] font-bold leading-none text-[#1C2738]">
                Top Education
              </strong>
              <span className="mt-1 block !font-['Montserrat'] text-[10px] text-[#8A94A6]">
                Portal Alumno
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-[#F3F5F8] text-[#5A6575]"
            aria-label="Cerrar menú"
          >
            <X size={19} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <div className="mb-3 flex items-center gap-2 px-1 text-[#8792A4]">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[linear-gradient(135deg,#22395F,#4A70AD)] text-white">
              <ChevronLeft size={14} />
            </span>
            <span className="!font-['Montserrat'] text-[10px] font-semibold uppercase tracking-[0.13em]">
              Navegación
            </span>
          </div>

          <nav className="space-y-1.5">
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
                  className={`flex min-h-[44px] w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left !font-['Montserrat'] text-[13px] font-medium transition ${
                    active
                      ? "bg-[linear-gradient(105deg,#172A49_0%,#284A7D_52%,#3A65A3_100%)] text-white shadow-[0_9px_22px_rgba(43,80,128,0.20)]"
                      : "text-[#4B5565] hover:bg-[#F3F6FA]"
                  }`}
                >
                  <span className={`grid h-6 w-6 place-items-center ${active ? "text-white" : "text-[#6E788A]"}`}>
                    <NavigationIcon item={item} active={active} />
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={goToMxApp}
            disabled={openingMxApp || !mxAccessActive}
            className={`mt-5 flex w-full items-center justify-between rounded-[15px] border px-4 py-3 !font-['Montserrat'] ${
              mxAccessActive
                ? "border-[#B9ECF2] bg-[linear-gradient(135deg,#D9FAFC_0%,#C3F3F7_100%)] text-[#18304C]"
                : "cursor-not-allowed border-[#E1E5EA] bg-[#F1F3F5] text-[#9AA3AF]"
            } ${openingMxApp ? "opacity-70" : ""}`}
          >
            <span>
              <strong className="block text-left text-[12px] font-bold">Ir a la App</strong>
              <span className="block text-left text-[10px] opacity-70">
                {openingMxApp ? "Generando acceso..." : "Abrir plataforma"}
              </span>
            </span>
            <span>↗</span>
          </button>

          <div className="mt-3 rounded-[15px] bg-[#0D1A2D] p-3 text-white">
            <div className="flex items-start gap-2.5">
              <StarMark small />
              <div>
                <span className="!font-['Montserrat'] text-[10px] font-bold uppercase tracking-[0.08em] text-[#74DCE8]">
                  Topo dice
                </span>
                <p className="mt-1 !font-['Montserrat'] text-[10px] leading-[1.45] text-white/80">
                  {streakDays > 0
                    ? `Llevas ${streakDays} días seguidos aprendiendo 🔥 ¡Sigue así!`
                    : "Aún no tienes racha activa. Ingresa a la app para empezar."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-[#E7EAF0] p-3">
          {userMenuOpen && (
            <div className="mb-2 overflow-hidden rounded-[14px] border border-[#E5E9EF] bg-white p-1.5 shadow-[0_12px_30px_rgba(27,39,56,0.12)]">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 !font-['Montserrat'] text-[12px] font-semibold text-[#D34848] hover:bg-[#FFF2F2]"
              >
                <LogOut size={17} />
                Cerrar sesión
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setUserMenuOpen((value) => !value)}
            className="flex w-full items-center gap-2.5 rounded-[13px] p-1.5 text-left hover:bg-[#F6F8FA]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#203B66,#4B72AE)] !font-['Montserrat'] text-[11px] font-bold text-white">
              {initials}
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block truncate !font-['Montserrat'] text-[12px] font-semibold text-[#273244]">
                {displayName}
              </strong>
              <span className="mt-0.5 flex items-center gap-1.5 !font-['Montserrat'] text-[9px] text-[#8993A3]">
                Alumno
                {planLabel && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-[#C0C6D0]" />
                    <span>{planLabel}</span>
                  </>
                )}
              </span>
            </span>
            <ChevronDown
              size={16}
              className={`text-[#98A1AF] transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </aside>
    </div>
  );
}

function HelpFormModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#0D1726]/50 px-4 backdrop-blur-[3px]">
      <div className="relative w-full max-w-[720px] overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_30px_90px_rgba(13,26,45,0.28)]">
        <div className="flex items-start justify-between border-b border-[#E9EDF2] px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[linear-gradient(135deg,#1D3557,#4C74AE)] text-white shadow-[0_9px_20px_rgba(49,93,156,0.20)]">
              <CircleHelp size={22} />
            </span>
            <div>
              <h2 className="!font-['Montserrat'] text-[20px] font-bold text-[#182235]">
                ¿Necesitas ayuda?
              </h2>
              <p className="mt-1 !font-['Montserrat'] text-[12px] text-[#7D8798]">
                Este espacio queda preparado para embeber el formulario de soporte.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F2F4F7] text-[#667085] transition hover:bg-[#E8ECF1]"
            aria-label="Cerrar ayuda"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid min-h-[320px] place-items-center rounded-[20px] border border-dashed border-[#BFC9D6] bg-[#F8FAFC] px-6 py-10 text-center">
            <div className="max-w-[440px]">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#E8F7FA] text-[#315D9C]">
                <FileText size={25} />
              </span>
              <h3 className="mt-4 !font-['Montserrat'] text-[16px] font-bold text-[#202B3D]">
                Formulario de soporte
              </h3>
              <p className="mt-2 !font-['Montserrat'] text-[12px] leading-relaxed text-[#7D8798]">
                Aqui integraremos el embebido de la mesa de ayuda.
              </p>

              {/*
                EJEMPLO PARA EL FORMULARIO FINAL:

                <iframe
                  src="https://TU-FORMULARIO-AQUI"
                  title="Formulario de soporte Top Education"
                  className="h-[520px] w-full rounded-[16px] border-0"
                  loading="lazy"
                />
              */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardWelcomeModal({ open, onClose, defaultTab }) {
  if (!open) return null;

  const dashboardItems = [
    {
      key: "career",
      icon: <TrendingUp size={21} strokeWidth={1.8} />,
      title: "Plan de Carrera",
      text: "Visualiza tu ruta personalizada con cursos recomendados según tus intereses.",
    },
    {
      key: "courses",
      icon: <LayoutGrid size={21} strokeWidth={1.8} />,
      title: "Cursos disponibles",
      text: "Explora, busca y filtra todos los cursos que forman parte de tu ruta completa.",
    },
    {
      key: "cv",
      icon: <FileText size={21} strokeWidth={1.8} />,
      title: "Mi CV",
      text: "Sube tu CV y recibe análisis detallados con recomendaciones para mejorar tu perfil profesional.",
    },
    {
      key: "profile",
      icon: <User size={21} strokeWidth={1.8} />,
      title: "Perfil",
      text: "Gestiona tu información, revisa tu progreso y accede a tus certificaciones obtenidas.",
    },
    {
      key: "license",
      icon: <Star size={21} strokeWidth={1.8} />,
      title: "Licencia",
      text: "Administra tu plan, métodos de pago y beneficios de tu suscripción.",
    },
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#0D1726]/50 px-4 backdrop-blur-[3px]">
      <div className="relative w-full max-w-[720px] overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_30px_90px_rgba(13,26,45,0.28)]">
        
        {/* HEADER */}
        <div className="relative overflow-hidden border-b border-[#E9EDF2] px-6 py-5">
          <div className="pointer-events-none absolute right-0 top-0 h-[150px] w-[220px] translate-x-16 -translate-y-20 rounded-full bg-[#BDEFF5]/40 blur-3xl" />

          <div className="relative flex items-start justify-between gap-5">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[linear-gradient(135deg,#1D3557,#4C74AE)] text-white shadow-[0_9px_20px_rgba(49,93,156,0.20)]">
                <Star size={22} strokeWidth={1.9} />
              </span>

              <div>
                <span className="!font-['Montserrat'] text-[10px] font-bold uppercase tracking-[0.16em] text-[#4C74AE]">
                  Tu espacio de aprendizaje
                </span>

                <h2 className="mt-1 !font-['Montserrat'] text-[20px] font-bold leading-tight text-[#182235]">
                  ¡Bienvenido a tu dashboard!
                </h2>

                <p className="mt-1 !font-['Montserrat'] text-[12px] leading-relaxed text-[#7D8798]">
                  Conoce rápidamente las herramientas que tienes disponibles
                  para gestionar tu aprendizaje.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F2F4F7] text-[#667085] transition hover:bg-[#E8ECF1] hover:text-[#26354A]"
              aria-label="Cerrar bienvenida"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="max-h-[calc(100vh-150px)] overflow-y-auto p-6">
          
          {/* OPCIONES */}
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
            {dashboardItems.map((item) => {
              const active = defaultTab === item.key;

              return (
                <div
                  key={item.key}
                  className={`group relative flex min-h-[94px] gap-3 overflow-hidden rounded-[16px] border p-3.5 transition-all duration-200 ${
                    active
                      ? "border-[#A9BAD4] bg-[linear-gradient(135deg,#F4F7FB,#EEF3FA)] shadow-[0_8px_24px_rgba(29,53,87,0.08)]"
                      : "border-[#E5E9EF] bg-white hover:border-[#C9D3E0] hover:bg-[#FAFBFC]"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-0 h-full w-[3px] bg-[linear-gradient(180deg,#1D3557,#4C74AE)]" />
                  )}

                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-[12px] transition ${
                      active
                        ? "bg-[linear-gradient(135deg,#1D3557,#4C74AE)] text-white shadow-[0_7px_18px_rgba(49,93,156,0.16)]"
                        : "bg-[#F1F4F8] text-[#66768C] group-hover:bg-[#EAF0F7] group-hover:text-[#315D9C]"
                    }`}
                  >
                    {item.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="!font-['Montserrat'] text-[13px] font-bold text-[#202B3D]">
                        {item.title}
                      </h3>

                      {active && (
                        <span className="rounded-full bg-[#DDF4F7] px-2 py-0.5 !font-['Montserrat'] text-[8px] font-bold uppercase tracking-[0.08em] text-[#347486]">
                          Comienza aquí
                        </span>
                      )}
                    </div>

                    <p className="mt-1 !font-['Montserrat'] text-[10.5px] leading-[1.45] text-[#7D8798]">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* TOPO / CARD EXTRA PARA COMPLETAR GRID */}
            <div className="relative flex min-h-[94px] gap-3 overflow-hidden rounded-[16px] border border-[#CDEBF0] bg-[linear-gradient(135deg,#F4FBFC,#EFF8FA)] p-3.5">
              <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-[#BDEFF5] bg-[#D8F8FB]">
                <img
                  src="/assets/logos/topo-contenedor-claro.png"
                  alt="Topo"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="!font-['Montserrat'] text-[13px] font-bold text-[#202B3D]">
                  Topo te acompaña
                </h3>

                <p className="mt-1 !font-['Montserrat'] text-[10.5px] leading-[1.45] text-[#6F8390]">
                  Recibe recomendaciones y orientación mientras avanzas en tu
                  ruta profesional.
                </p>
              </div>
            </div>
          </div>

          {/* RECOMENDACIÓN */}
          <div className="mt-4 overflow-hidden rounded-[16px] border border-[#DDE5EF] bg-[#F8FAFC]">
            <div className="flex items-start gap-3 p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px] bg-[#E9F0F8] text-[#315D9C]">
                <TrendingUp size={18} strokeWidth={1.9} />
              </span>

              <div>
                <span className="!font-['Montserrat'] text-[9px] font-bold uppercase tracking-[0.12em] text-[#607894]">
                  Recomendación
                </span>

                <h3 className="mt-0.5 !font-['Montserrat'] text-[13px] font-bold text-[#202B3D]">
                  Comienza tu aprendizaje
                </h3>

                <p className="mt-1 !font-['Montserrat'] text-[11px] leading-relaxed text-[#7D8798]">
                  {defaultTab === "cv"
                    ? 'Empieza desde "Mi CV" para conocer mejor tu perfil y recibir recomendaciones antes de continuar.'
                    : 'Empieza desde "Plan de Carrera" para revisar tu ruta personalizada y los cursos recomendados para ti.'}
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={onClose}
            className="mt-4 flex h-[48px] w-full items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(135deg,#172A48,#41679F)] px-6 !font-['Montserrat'] text-[13px] font-bold text-white shadow-[0_10px_28px_rgba(29,53,87,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(29,53,87,0.28)]"
          >
            Entendido, comenzar
            <span className="text-[17px] font-normal">→</span>
          </button>
        </div>
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

function AddPaymentMethodModal({
  open,
  onClose,
  backendBaseUrl,
  onSaved,
  userEmail,
}) {
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
      const setup = await postJSON(
        `${backendBaseUrl}/api/billing/setup-intent/`,
        {
          email: userEmail,
        }
      );

      const clientSecret =
        setup?.client_secret ||
        setup?.data?.client_secret;

      if (!clientSecret) {
        throw new Error(
          "No se pudo preparar la tarjeta en Stripe."
        );
      }

      const result = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card,
            billing_details: {
              email: userEmail,
            },
          },
        }
      );

      if (result.error) {
        throw new Error(
          result.error.message ||
            "No se pudo validar la tarjeta."
        );
      }

      const paymentMethodId =
        result.setupIntent?.payment_method;

      if (!paymentMethodId) {
        throw new Error(
          "Stripe no devolvió el método de pago."
        );
      }

      await postJSON(
        `${backendBaseUrl}/api/billing/payment-methods/create/`,
        {
          email: userEmail,
          payment_method_id: paymentMethodId,
        }
      );

      await onSaved?.();

      onClose();

      toast.success(
        "Método de pago agregado."
      );
    } catch (error) {
      setErrorMsg(
        error?.message ||
          "No se pudo guardar la tarjeta."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-[#0D1726]/55 px-4 backdrop-blur-[3px]">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={() => {
          if (!saving) onClose();
        }}
        aria-label="Cerrar modal"
      />

      <div
        className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-[22px] border border-white/70 bg-white shadow-[0_30px_90px_rgba(13,26,45,0.28)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-payment-method-title"
      >
        {/* HEADER */}
        <div className="relative overflow-hidden border-b border-[#E9EDF2] px-6 py-5">
          <div className="pointer-events-none absolute -right-14 -top-16 h-[160px] w-[200px] rounded-full bg-[#BDEFF5]/35 blur-3xl" />

          <div className="relative flex items-start justify-between gap-5">
            <div className="flex min-w-0 items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px] bg-[linear-gradient(135deg,#111D31,#41679F)] text-white shadow-[0_8px_20px_rgba(29,53,87,0.18)]">
                <span className="text-[17px] font-medium">
                  $
                </span>
              </span>

              <div className="min-w-0">
                <span className="!font-['Montserrat'] text-[9px] font-semibold uppercase tracking-[0.15em] text-[#41679F]">
                  Método de pago
                </span>

                <h2
                  id="add-payment-method-title"
                  className="mt-1 !font-['Montserrat'] text-xl font-semibold tracking-[-0.02em] text-[#172033]"
                >
                  Agregar nueva tarjeta
                </h2>

                <p className="mt-1 !font-['Montserrat'] text-[11px] leading-relaxed text-[#7D8798]">
                  Agrega una tarjeta para gestionar tus cobros de forma segura con Stripe.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F2F4F7] text-lg text-[#667085] transition hover:bg-[#E8ECF1] hover:text-[#26354A] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6">
          {/* DATOS DE TARJETA */}
          <div>
            <span className="!font-['Montserrat'] text-[9px] font-semibold uppercase tracking-[0.12em] text-[#7D8798]">
              Datos de la tarjeta
            </span>

            <div
              className={`mt-2 rounded-[13px] border bg-[#F9FAFC] px-4 py-4 transition ${
                complete
                  ? "border-[#A9C9B4] bg-[#FBFDFC]"
                  : "border-[#DEE3EB] focus-within:border-[#91A7C5] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#41679F]/[0.06]"
              }`}
            >
              <CardElement
                options={cardElementOptions}
                onChange={(event) => {
                  setComplete(
                    event.complete
                  );

                  setErrorMsg(
                    event.error?.message ||
                      ""
                  );
                }}
              />
            </div>

            <div className="mt-2 flex items-start gap-2">
              <span className="mt-[2px] text-[12px] text-[#8A94A6]">
                🔒
              </span>

              <p className="!font-['Montserrat'] text-[10px] leading-relaxed text-[#8A94A6]">
                Tus datos son procesados directamente por Stripe y no se almacenan en nuestros servidores.
              </p>
            </div>
          </div>

          {/* SEGURIDAD */}
          <div className="mt-5 rounded-[14px] border border-[#D8E8DE] bg-[#F4FAF6] p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-[#E0F2E5] text-[13px] font-bold text-[#43845A]">
                ✓
              </span>

              <div>
                <h3 className="!font-['Montserrat'] text-[11px] font-semibold text-[#354156]">
                  Pago protegido
                </h3>

                <p className="mt-1 !font-['Montserrat'] text-[10px] leading-relaxed text-[#6F7A8C]">
                  Top Education no almacena los números de tu tarjeta. Stripe tokeniza el método de pago para procesar cobros recurrentes de forma segura.
                </p>
              </div>
            </div>
          </div>

          {/* ERROR */}
          {errorMsg && (
            <div className="mt-4 rounded-[13px] border border-[#F0CCCC] bg-[#FFF7F7] px-4 py-3">
              <div className="flex items-start gap-2">
                <span className="mt-[1px] text-[#C45555]">
                  !
                </span>

                <p className="!font-['Montserrat'] text-[10.5px] font-medium leading-relaxed text-[#B84D4D]">
                  {errorMsg}
                </p>
              </div>
            </div>
          )}

          {/* EMAIL DE FACTURACIÓN */}
          {userEmail && (
            <div className="mt-5 rounded-[13px] border border-[#E6EAF0] bg-[#F9FAFC] px-4 py-3">
              <span className="!font-['Montserrat'] text-[8px] font-semibold uppercase tracking-[0.12em] text-[#8A94A6]">
                Correo de facturación
              </span>

              <p className="mt-1 truncate !font-['Montserrat'] text-[11px] font-medium text-[#465166]">
                {userEmail}
              </p>
            </div>
          )}

          {/* ACCIONES */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[0.8fr_1.2fr]">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="order-2 flex h-[44px] items-center justify-center rounded-[12px] border border-[#DDE3EB] bg-white px-5 !font-['Montserrat'] text-[11px] font-semibold text-[#465166] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50 sm:order-1"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={savePaymentMethod}
              disabled={
                saving ||
                !stripe ||
                !complete
              }
              className="order-1 flex h-[44px] items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,#111D31,#41679F)] px-5 !font-['Montserrat'] text-[11px] font-semibold text-white shadow-[0_9px_24px_rgba(29,53,87,0.20)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(29,53,87,0.25)] disabled:cursor-not-allowed disabled:bg-[#C8CED8] disabled:shadow-none disabled:hover:translate-y-0 sm:order-2"
            >
              {saving && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}

              {saving
                ? "Guardando tarjeta..."
                : "Guardar método de pago"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


function getCleanPdfUrl(url) {
  const normalizedUrl = String(url || "").trim();

  if (!normalizedUrl) return "";

  const pdfPosition = normalizedUrl.toLowerCase().indexOf(".pdf");

  if (pdfPosition === -1) {
    return normalizedUrl;
  }

  return normalizedUrl.slice(0, pdfPosition + 4);
}

function CvReportPreviewModal({
  open,
  reportUrl,
  fileName = "reporte-analisis-cv.pdf",
  onClose,
}) {
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [previewObjectUrl, setPreviewObjectUrl] = useState("");

  useEffect(() => {
    if (!open || !reportUrl) {
      setLoadingPreview(false);
      setPreviewError("");
      setPreviewObjectUrl("");
      return undefined;
    }

    const controller = new AbortController();
    let generatedObjectUrl = "";

    const loadPdfAsBlob = async (url) => {
      const response = await fetch(url, {
        method: "GET",
        credentials: "omit",
        signal: controller.signal,
        headers: {
          Accept: "application/pdf",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const blob = await response.blob();

      if (!blob.size) {
        throw new Error("El reporte recibido está vacío.");
      }

      /*
       * Algunos servidores o S3 pueden responder con
       * application/octet-stream. Forzamos application/pdf
       * para que el navegador pueda representarlo.
       */
      return blob.type === "application/pdf"
        ? blob
        : new Blob([blob], {
            type: "application/pdf",
          });
    };

    const loadPreview = async () => {
      setLoadingPreview(true);
      setPreviewError("");
      setPreviewObjectUrl("");

      const cleanPdfUrl = getCleanPdfUrl(reportUrl);

      try {
        let pdfBlob = null;

        /*
         * PRIMER INTENTO:
         * URL limpia hasta .pdf, sin parámetros que fuerzan
         * Content-Disposition: attachment.
         */
        try {
          pdfBlob = await loadPdfAsBlob(cleanPdfUrl);
        } catch (cleanUrlError) {
          console.warn(
            "No fue posible cargar la URL limpia del PDF:",
            cleanUrlError
          );
        }

        /*
         * SEGUNDO INTENTO:
         * Si la URL limpia no funciona porque el objeto es privado,
         * usamos la URL firmada completa.
         */
        if (!pdfBlob && cleanPdfUrl !== reportUrl) {
          try {
            pdfBlob = await loadPdfAsBlob(reportUrl);
          } catch (signedUrlError) {
            console.warn(
              "No fue posible cargar la URL firmada del PDF:",
              signedUrlError
            );
          }
        }

        if (!pdfBlob) {
          throw new Error(
            "El servidor no permitió cargar el PDF dentro del navegador."
          );
        }

        generatedObjectUrl = URL.createObjectURL(pdfBlob);
        setPreviewObjectUrl(generatedObjectUrl);
      } catch (error) {
        if (error?.name === "AbortError") return;

        console.error("Error cargando la vista previa del reporte:", error);

        setPreviewError(
          error?.message ||
            "No fue posible cargar la vista previa del reporte."
        );
      } finally {
        setLoadingPreview(false);
      }
    };

    loadPreview();

    return () => {
      controller.abort();

      if (generatedObjectUrl) {
        URL.revokeObjectURL(generatedObjectUrl);
      }
    };
  }, [open, reportUrl]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !reportUrl) return null;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-[#0D1726]/55 px-3 py-5 backdrop-blur-[4px] md:px-6 lg:pl-[260px]">
      <button
        type="button"
        aria-label="Cerrar vista previa"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div
        className="relative z-10 flex h-[84vh] w-full max-w-[1180px] flex-col overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_35px_110px_rgba(13,26,45,0.36)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cv-report-preview-title"
      >
        <div className="relative overflow-hidden border-b border-[#E7EBF1] bg-white px-5 py-4 md:px-6">
          <div className="pointer-events-none absolute right-0 top-0 h-[130px] w-[220px] translate-x-14 -translate-y-20 rounded-full bg-[#C9F3F7]/45 blur-3xl" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px] bg-[linear-gradient(135deg,#172A48,#41679F)] text-white shadow-[0_8px_20px_rgba(29,53,87,0.18)]">
                <FileText size={21} strokeWidth={1.8} />
              </span>

              <div className="min-w-0">
                <span className="!font-['Montserrat'] text-[9px] font-bold uppercase tracking-[0.16em] text-[#4C74AE]">
                  Reporte de análisis
                </span>

                <h2
                  id="cv-report-preview-title"
                  className="truncate !font-['Montserrat'] text-[17px] font-semibold tracking-[-0.02em] text-[#182235] md:text-[19px]"
                >
                  Vista previa del reporte de CV
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F2F4F7] text-[#667085] transition hover:bg-[#E8ECF1] hover:text-[#26354A]"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden bg-[#E9EDF3]">
          {loadingPreview && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#F8FAFC]">
              <div className="h-11 w-11 animate-spin rounded-full border-[3px] border-[#C9D5E5] border-t-[#315D9C]" />

              <p className="mt-4 !font-['Montserrat'] text-[13px] font-semibold text-[#526075]">
                Cargando vista previa...
              </p>

              <p className="mt-1 !font-['Montserrat'] text-[11px] text-[#8A94A6]">
                Estamos preparando tu reporte para mostrarlo aquí.
              </p>
            </div>
          )}

          {!loadingPreview && !previewError && previewObjectUrl && (
            <iframe
              src={`${previewObjectUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
              title="Vista previa del reporte de análisis de CV"
              className="h-full w-full border-0 bg-white"
            />
          )}

          {!loadingPreview && previewError && (
            <div className="flex h-full items-center justify-center p-5 md:p-8">
              <div className="w-full max-w-[520px] rounded-[22px] border border-[#E4E8EF] bg-white p-7 text-center shadow-[0_18px_55px_rgba(17,29,49,0.10)]">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-[16px] bg-[#FFF1F2] text-[#D64F5E]">
                  <FileText size={27} strokeWidth={1.8} />
                </div>

                <span className="mt-4 block !font-['Montserrat'] text-[9px] font-bold uppercase tracking-[0.14em] text-[#9A6670]">
                  Vista previa no disponible
                </span>

                <h3 className="mt-1 !font-['Montserrat'] text-[19px] font-semibold tracking-[-0.02em] text-[#182235]">
                  No fue posible mostrar el reporte
                </h3>

                <p className="mt-2 !font-['Montserrat'] text-[12px] leading-relaxed text-[#7D8798]">
                  {previewError}
                </p>

                <p className="mt-1 !font-['Montserrat'] text-[12px] text-[#7D8798]">
                  Puedes abrir o descargar el archivo directamente para consultarlo.
                </p>

                <a
                  href={reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={fileName}
                  className="mt-5 inline-flex h-[44px] items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,#172A48,#41679F)] px-6 !font-['Montserrat'] text-[12px] font-semibold text-white shadow-[0_10px_26px_rgba(29,53,87,0.20)] transition hover:-translate-y-0.5"
                >
                  <span aria-hidden="true">⇩</span>
                  Descargar PDF
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CvTab({ backendBaseUrl, me, learningRoute }) {
  const [subTab, setSubTab] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingLast, setLoadingLast] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showReportPreview, setShowReportPreview] = useState(false);
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
  const improvements = recommendations.filter(
    (item) => item.type === "improvement"
  );

  const reportUrl =
    analysis?.report?.signedUrl ||
    analysis?.report?.signed_url ||
    analysis?.report?.url ||
    analysis?.reportUrl ||
    analysis?.report_url ||
    analysis?.signedUrl ||
    analysis?.signed_url ||
    "";

  const analyzedFileBaseName = String(
    analysis?.filename || "reporte-analisis-cv"
  ).replace(/\.[^.]+$/, "");

  const reportFileName =
    analysis?.report?.filename ||
    analysis?.report?.fileName ||
    `${analyzedFileBaseName}-analysis-report.pdf`;

  return (
    <div className="relative w-full pb-4">
      {loadingAnalysis && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#0D1726]/55 px-4 backdrop-blur-[4px] lg:pl-[260px]">
          <div className="relative w-full max-w-[520px] overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_30px_90px_rgba(13,26,45,0.30)]">
            <div className="pointer-events-none absolute right-0 top-0 h-[180px] w-[230px] translate-x-16 -translate-y-20 rounded-full bg-[#C9F3F7]/55 blur-3xl" />

            <div className="relative p-7 text-center md:p-8">
              <div className="mx-auto grid h-16 w-16 place-items-center overflow-hidden rounded-full border border-[#BFE8EE] bg-[#DDF7FA] shadow-[0_10px_30px_rgba(83,170,184,0.16)]">
                <img
                  src="/assets/logos/topo-contenedor-claro.png"
                  alt="Logo Topo"
                  className="h-full w-full object-cover"
                />
              </div>

              <span className="mt-4 block !font-['Montserrat'] text-[9px] font-bold uppercase tracking-[0.16em] text-[#4C7482]">
                Análisis inteligente de Topo
              </span>

              <h2 className="mt-1 !font-['Montserrat'] text-[21px] font-semibold tracking-[-0.025em] text-[#182235]">
                Analizando tu CV...
              </h2>

              <p className="mx-auto mt-2 max-w-[410px] !font-['Montserrat'] text-[12px] leading-relaxed text-[#7D8798]">
                Estamos revisando tu hoja de vida y generando recomendaciones personalizadas para fortalecer tu perfil.
              </p>

              <div className="mx-auto mt-6 h-2 max-w-[360px] overflow-hidden rounded-full bg-[#E9EDF3]">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-[linear-gradient(90deg,#172A48,#4C74AE,#63C4CF)]" />
              </div>

              <p className="mt-3 !font-['Montserrat'] text-[10.5px] font-medium text-[#9AA3B1]">
                Esto puede tardar algunos segundos.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="!font-['Montserrat'] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#78869B]">
            Perfil profesional
          </span>

          <h1 className="mt-1 !font-['Montserrat'] text-[2rem] font-semibold leading-[1.05em] tracking-[-0.035em] text-[#121B2D]">
            Mi CV
          </h1>

          <p className="mt-2 !font-['Montserrat'] text-sm text-[#7B8699]">
            Analiza tu hoja de vida y recibe recomendaciones personalizadas.
          </p>
        </div>

        <div className="flex w-full rounded-[14px] border border-[#E2E7EE] bg-white p-1 shadow-[0_6px_18px_rgba(17,29,49,0.035)] sm:w-fit">
          {[
            ["upload", "Subir CV"],
            ["history", "Último análisis"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSubTab(key)}
              className={`flex-1 rounded-[10px] px-5 py-2.5 !font-['Montserrat'] text-[11px] font-semibold transition sm:flex-none md:px-7 ${
                subTab === key
                  ? "bg-[linear-gradient(135deg,#111D31_0%,#4266A4_100%)] text-white shadow-[0_7px_18px_rgba(48,79,134,0.16)]"
                  : "text-[#687386] hover:bg-[#F6F8FB] hover:text-[#344156]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {subTab === "upload" ? (
        <section className="grid w-full grid-cols-1 gap-5 xl:grid-cols-[0.86fr_1.14fr]">
          <div className="rounded-[20px] border border-[#E4E8EF] bg-white p-5 shadow-[0_7px_24px_rgba(17,29,49,0.035)] md:p-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <StarMark />
              </div>

              <div className="min-w-0 flex-1">
                <span className="!font-['Montserrat'] text-[9px] font-bold uppercase tracking-[0.14em] text-[#4D7485]">
                  Análisis con Topo
                </span>

                <h2 className="mt-1 !font-['Montserrat'] text-[18px] font-semibold tracking-[-0.02em] text-[#182235]">
                  Mejora tu perfil profesional
                </h2>

                <p className="mt-1 !font-['Montserrat'] text-[12px] leading-[1.55] text-[#7D8798]">
                  Analizaremos tu CV y te daremos recomendaciones concretas para mejorarlo.
                  <strong className="font-semibold text-[#28364B]"> Es gratis, siempre.</strong>
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2.5">
              {[
                "Score general sobre 10",
                "Resumen del perfil",
                "5 recomendaciones accionables",
                "Reporte PDF descargable",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-[13px] border border-[#EDF0F4] bg-[#F8FAFC] px-4 py-3"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#E8F4EE] !font-['Montserrat'] text-[11px] font-bold text-[#4D8D69]">
                    ✓
                  </span>

                  <span className="!font-['Montserrat'] text-[11.5px] font-medium text-[#526075]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[14px] border border-[#CDEBF0] bg-[linear-gradient(135deg,#F5FBFC,#EFF8FA)] p-4">
              <div className="flex items-start gap-3">
                <img
                  src="/assets/logos/topo-contenedor-claro.png"
                  alt="Topo"
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                />

                <div>
                  <span className="!font-['Montserrat'] text-[9px] font-bold uppercase tracking-[0.12em] text-[#4B7A85]">
                    Topo dice
                  </span>
                  <p className="mt-0.5 !font-['Montserrat'] text-[10.5px] leading-relaxed text-[#657886]">
                    Para obtener mejores recomendaciones, procura subir una versión actualizada y completa de tu hoja de vida.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="group flex min-h-[318px] cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-[#B9C8DB] bg-white p-7 text-center shadow-[0_7px_24px_rgba(17,29,49,0.03)] transition hover:border-[#6F8FB9] hover:bg-[#FCFDFE] md:p-8">
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={(event) => handleFileChange(event.target.files?.[0])}
              />

              <span className="grid h-14 w-14 place-items-center rounded-[16px] bg-[#EEF3F8] !font-['Montserrat'] text-[27px] font-light text-[#41679F] transition group-hover:bg-[#E7EEF7]">
                ⇧
              </span>

              <h2 className="mt-4 max-w-[460px] !font-['Montserrat'] text-[17px] font-semibold leading-snug tracking-[-0.015em] text-[#182235]">
                Arrastra tu CV aquí o selecciona un archivo
              </h2>

              <p className="mt-2 !font-['Montserrat'] text-[11px] text-[#8A94A6]">
                Carga una versión actualizada para obtener un análisis más preciso.
              </p>

              <span className="mt-5 rounded-[11px] border border-[#B7C5D8] bg-white px-6 py-2.5 !font-['Montserrat'] text-[11px] font-semibold text-[#315D9C] transition group-hover:border-[#6F8FB9]">
                Seleccionar archivo
              </span>

              <p className="mt-4 !font-['Montserrat'] text-[10.5px] text-[#9AA3B1]">
                PDF o Word (.docx) · Máximo 5MB
              </p>

              {fileName && (
                <div className="mt-4 flex max-w-full items-center gap-2 rounded-full border border-[#CAE7D7] bg-[#EFF9F3] px-4 py-2">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#5DA778]" />
                  <span className="max-w-[300px] truncate !font-['Montserrat'] text-[10.5px] font-semibold text-[#4C8261]">
                    {fileName}
                  </span>
                </div>
              )}
            </label>

            {errorMsg && (
              <div className="mt-4 rounded-[14px] border border-[#F3D6DA] bg-[#FFF5F6] px-4 py-3 !font-['Montserrat'] text-[11.5px] font-medium text-[#C44D5A]">
                {errorMsg}
              </div>
            )}

            <button
              type="button"
              disabled={!selectedFile || loadingAnalysis}
              onClick={analyzeCv}
              className="mt-4 flex h-[50px] w-full items-center justify-center gap-2 rounded-[13px] bg-[linear-gradient(135deg,#172A48,#41679F)] px-6 !font-['Montserrat'] text-[13px] font-semibold text-white shadow-[0_10px_28px_rgba(29,53,87,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(29,53,87,0.28)] disabled:cursor-not-allowed disabled:bg-none disabled:bg-[#B9C0CA] disabled:shadow-none disabled:hover:translate-y-0"
            >
              {loadingAnalysis ? "Analizando CV..." : "Analizar mi CV"}
              {!loadingAnalysis && <span className="text-[16px]">→</span>}
            </button>
          </div>
        </section>
      ) : (
        <section className="w-full rounded-[20px] border border-[#E4E8EF] bg-white p-5 shadow-[0_7px_24px_rgba(17,29,49,0.035)] md:p-7">
          {errorMsg && !loadingLast && (
            <div className="mb-5 rounded-[14px] border border-[#F3D6DA] bg-[#FFF5F6] px-4 py-3 !font-['Montserrat'] text-[11.5px] font-medium text-[#C44D5A]">
              {errorMsg}
            </div>
          )}

          {loadingLast ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
              <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#D8E0EA] border-t-[#41679F]" />
              <p className="mt-3 !font-['Montserrat'] text-[12px] font-medium text-[#7D8798]">
                Cargando último análisis...
              </p>
            </div>
          ) : analysis ? (
            <>
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_286px]">
                <div>
                  <span className="!font-['Montserrat'] text-[9px] font-bold uppercase tracking-[0.16em] text-[#4C74AE]">
                    Análisis completado
                  </span>

                  <h2 className="mt-1 line-clamp-2 !font-['Montserrat'] text-[22px] font-semibold tracking-[-0.025em] text-[#182235]">
                    {analysis.filename || "CV analizado"}
                  </h2>

                  <p className="mt-1 !font-['Montserrat'] text-[11px] text-[#929BA9]">
                    Analizado el {fmtDate(analysis.analyzedAt || analysis.analyzed_at)}
                  </p>

                  <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="flex gap-4 rounded-[16px] border border-[#DCEDE4] bg-[#F5FBF7] p-4">
                      <div className="!font-['Montserrat'] text-[38px] font-semibold leading-none text-[#4F956C]">
                        {strengths.length}
                      </div>

                      <div>
                        <span className="!font-['Montserrat'] text-[9px] font-bold uppercase tracking-[0.08em] text-[#4F956C]">
                          Fortalezas detectadas
                        </span>
                        <p className="mt-1 !font-['Montserrat'] text-[10.5px] leading-relaxed text-[#728078]">
                          Puntos positivos identificados en tu CV.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 rounded-[16px] border border-[#F0E4C8] bg-[#FFF9EE] p-4">
                      <div className="!font-['Montserrat'] text-[38px] font-semibold leading-none text-[#B57C1D]">
                        {improvements.length}
                      </div>

                      <div>
                        <span className="!font-['Montserrat'] text-[9px] font-bold uppercase tracking-[0.08em] text-[#A66E15]">
                          Mejoras sugeridas
                        </span>
                        <p className="mt-1 !font-['Montserrat'] text-[10.5px] leading-relaxed text-[#81745F]">
                          Acciones recomendadas para optimizar tu perfil.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[18px] bg-[linear-gradient(145deg,#111D31_0%,#2D4C7B_58%,#4C74AE_100%)] p-5 text-center text-white shadow-[0_16px_38px_rgba(29,53,87,0.20)]">
                  <div className="pointer-events-none absolute -right-10 -top-14 h-32 w-32 rounded-full bg-[#C9F3F7]/20 blur-2xl" />

                  <div className="relative">
                    <span className="!font-['Montserrat'] text-[9px] font-bold uppercase tracking-[0.14em] text-white/65">
                      Score general
                    </span>

                    <div className="mt-2 !font-['Montserrat'] text-[48px] font-semibold leading-none tracking-[-0.05em] text-white">
                      {score.value || 0}
                      <span className="ml-1 text-[18px] font-medium tracking-normal text-white/55">
                        / {score.max || 10}
                      </span>
                    </div>

                    <p className="mt-2 !font-['Montserrat'] text-[10.5px] font-medium text-white/80">
                      {score.label || "Resultado"} · {score.percentage || 0}%
                    </p>

                    {reportUrl && (
                      <button
                        type="button"
                        onClick={() => setShowReportPreview(true)}
                        className="mt-5 inline-flex h-[40px] w-full items-center justify-center gap-2 rounded-[11px] bg-white px-4 !font-['Montserrat'] text-[11px] font-semibold text-[#223C63] transition hover:-translate-y-0.5 hover:bg-[#F5F8FC]"
                      >
                        <FileText size={15} strokeWidth={1.8} />
                        Ver reporte PDF
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[16px] border border-[#E8ECF1] bg-[#F8FAFC] p-4 md:p-5">
                <span className="!font-['Montserrat'] text-[9px] font-bold uppercase tracking-[0.13em] text-[#78869B]">
                  Resumen
                </span>

                <p className="mt-2 !font-['Montserrat'] text-[12px] leading-[1.65] text-[#5F6B7E]">
                  {analysis.summary || "No hay resumen disponible."}
                </p>
              </div>

              <div className="mt-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3 className="!font-['Montserrat'] text-[18px] font-semibold tracking-[-0.02em] text-[#182235]">
                      Recomendaciones
                    </h3>
                    <p className="mt-1 !font-['Montserrat'] text-[11.5px] text-[#7D8798]">
                      Acciones concretas para fortalecer tu hoja de vida.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSubTab("upload")}
                    className="w-fit rounded-[11px] border border-[#DDE3EB] bg-white px-4 py-2.5 !font-['Montserrat'] text-[10.5px] font-semibold text-[#354156] transition hover:border-[#BFCADA] hover:bg-[#F8FAFC]"
                  >
                    Analizar otro CV
                  </button>
                </div>

                {recommendations.length ? (
                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {recommendations.map((item, index) => (
                      <article
                        key={`${item.title}-${index}`}
                        className="rounded-[16px] border border-[#E5E9EF] bg-white p-4 shadow-[0_6px_18px_rgba(17,29,49,0.03)]"
                      >
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 !font-['Montserrat'] text-[8.5px] font-bold uppercase tracking-[0.06em] ${
                            item.type === "strength"
                              ? "bg-[#EDF8F1] text-[#4C8C66]"
                              : "bg-[#FFF7E8] text-[#A66E15]"
                          }`}
                        >
                          {item.type === "strength" ? "Fortaleza" : "Mejora"} · {item.priority || "medium"}
                        </span>

                        <h4 className="mt-3 !font-['Montserrat'] text-[13px] font-semibold leading-snug text-[#202B3D]">
                          {item.title}
                        </h4>

                        <p className="mt-2 !font-['Montserrat'] text-[10.5px] leading-[1.55] text-[#788395]">
                          {item.detail}
                        </p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-[14px] border border-[#E7EBF1] bg-[#F8FAFC] p-5 !font-['Montserrat'] text-[11px] text-[#7D8798]">
                    Este análisis todavía no contiene recomendaciones detalladas.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex min-h-[290px] flex-col items-center justify-center rounded-[17px] border border-dashed border-[#D7DEE8] bg-[#F9FBFC] p-8 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-[#EDF2F7] text-[#5E7390]">
                <FileText size={22} strokeWidth={1.8} />
              </span>

              <h2 className="mt-4 !font-['Montserrat'] text-[17px] font-semibold text-[#182235]">
                Aún no hay análisis
              </h2>

              <p className="mt-2 max-w-[420px] !font-['Montserrat'] text-[11.5px] leading-relaxed text-[#7D8798]">
                Cuando analices tu CV, aparecerán aquí el score, el resumen y las recomendaciones generadas para tu perfil.
              </p>

              <button
                type="button"
                onClick={() => setSubTab("upload")}
                className="mt-5 rounded-[11px] bg-[#111D31] px-5 py-2.5 !font-['Montserrat'] text-[11px] font-semibold text-white transition hover:bg-[#1B2D4B]"
              >
                Subir mi CV
              </button>
            </div>
          )}
        </section>
      )}

      <CvReportPreviewModal
        open={showReportPreview}
        reportUrl={reportUrl}
        fileName={reportFileName}
        onClose={() => setShowReportPreview(false)}
      />
    </div>
  );
}

function ProfileTab({ me }) {
  const [profileTab, setProfileTab] = useState("basic");

  const profileTabs = [
    ["basic", "Información básica"],
    ["progress", "Progreso"],
    ["certs", "Certificaciones"],
  ];

  const profileFields = [
    ["Nombre completo", me?.full_name || me?.name || "Usuario top.education"],
    ["Correo electrónico", me?.email || "—"],
    ["País", me?.country || "Colombia"],
    ["Idioma", me?.language || "Español"],
  ];

  const initial = String(me?.full_name || me?.name || me?.email || "A")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="w-full pb-5">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="!font-['Montserrat'] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#78869B]">
            Cuenta del alumno
          </span>

          <h1 className="mt-1 !font-['Montserrat'] text-[2rem] font-semibold leading-[1.05em] tracking-[-0.035em] text-[#121B2D]">
            Mi perfil
          </h1>

          <p className="mt-2 !font-['Montserrat'] text-sm text-[#7B8699]">
            Consulta la información principal de tu cuenta y tu avance en Top Education.
          </p>
        </div>

        <div className="flex w-full overflow-x-auto rounded-[14px] border border-[#E2E7EE] bg-white p-1 shadow-[0_6px_18px_rgba(17,29,49,0.035)] md:w-auto">
          {profileTabs.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setProfileTab(key)}
              className={`min-w-max flex-1 rounded-[10px] px-4 py-2.5 !font-['Montserrat'] text-[10.5px] font-semibold transition md:flex-none md:px-5 ${
                profileTab === key
                  ? "bg-[linear-gradient(135deg,#111D31_0%,#4266A4_100%)] text-white shadow-[0_7px_18px_rgba(48,79,134,0.16)]"
                  : "text-[#687386] hover:bg-[#F6F8FB] hover:text-[#344156]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {profileTab === "basic" ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="h-fit rounded-[20px] border border-[#E4E8EF] bg-white p-5 shadow-[0_7px_24px_rgba(17,29,49,0.035)]">
            <div className="flex flex-col items-center text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-[linear-gradient(135deg,#223A61,#4E72AA)] !font-['Montserrat'] text-[24px] font-semibold text-white shadow-[0_12px_30px_rgba(49,93,156,0.18)]">
                {initial}
              </div>

              <h2 className="mt-4 line-clamp-2 !font-['Montserrat'] text-[16px] font-semibold text-[#202B3D]">
                {me?.full_name || me?.name || "Usuario top.education"}
              </h2>

              <p className="mt-1 max-w-full truncate !font-['Montserrat'] text-[10.5px] text-[#8A94A6]">
                {me?.email || "—"}
              </p>

              <span className="mt-3 rounded-full border border-[#D7E0EC] bg-[#F5F8FB] px-3 py-1 !font-['Montserrat'] text-[9px] font-semibold uppercase tracking-[0.08em] text-[#536A88]">
                Alumno
              </span>
            </div>

            <div className="mt-5 border-t border-[#EDF0F4] pt-4">
              <div className="flex items-start gap-3 rounded-[13px] border border-[#CDEBF0] bg-[linear-gradient(135deg,#F5FBFC,#EFF8FA)] p-3.5">
                <img
                  src="/assets/logos/topo-contenedor-claro.png"
                  alt="Topo"
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                />

                <div>
                  <span className="!font-['Montserrat'] text-[8.5px] font-bold uppercase tracking-[0.11em] text-[#4B7A85]">
                    Topo dice
                  </span>
                  <p className="mt-0.5 !font-['Montserrat'] text-[9.5px] leading-relaxed text-[#657886]">
                    Mantén tus datos actualizados para que tu experiencia sea cada vez más personalizada.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section className="rounded-[20px] border border-[#E4E8EF] bg-white p-5 shadow-[0_7px_24px_rgba(17,29,49,0.035)] md:p-6">
            <div className="flex flex-col gap-1 border-b border-[#EDF0F4] pb-4">
              <span className="!font-['Montserrat'] text-[9px] font-bold uppercase tracking-[0.14em] text-[#78869B]">
                Información básica
              </span>

              <h2 className="!font-['Montserrat'] text-[18px] font-semibold tracking-[-0.02em] text-[#182235]">
                Datos de tu cuenta
              </h2>

              <p className="!font-['Montserrat'] text-[11px] text-[#8A94A6]">
                Esta información corresponde a los datos registrados actualmente en tu perfil.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {profileFields.map(([label, value]) => (
                <label
                  key={label}
                  className="block !font-['Montserrat'] text-[10px] font-semibold text-[#687386]"
                >
                  {label}
                  <input
                    value={value}
                    readOnly
                    className="mt-2 h-[46px] w-full rounded-[12px] border border-[#DEE3EB] bg-[#F8FAFC] px-4 !font-['Montserrat'] text-[12px] font-medium text-[#263246] outline-none"
                  />
                </label>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-[#EDF0F4] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="!font-['Montserrat'] text-[10.5px] leading-relaxed text-[#8A94A6]">
                Algunos datos pueden depender de la información registrada durante tu inscripción.
              </p>

              <button
                type="button"
                className="shrink-0 rounded-[11px] bg-[linear-gradient(135deg,#172A48,#41679F)] px-5 py-2.5 !font-['Montserrat'] text-[11px] font-semibold text-white shadow-[0_8px_20px_rgba(29,53,87,0.18)] transition hover:-translate-y-0.5"
              >
                Guardar cambios
              </button>
            </div>
          </section>
        </div>
      ) : (
        <section className="flex min-h-[330px] w-full flex-col items-center justify-center rounded-[20px] border border-[#E4E8EF] bg-white p-8 text-center shadow-[0_7px_24px_rgba(17,29,49,0.035)]">
          <span className="grid h-14 w-14 place-items-center rounded-[16px] bg-[#EEF3F8] text-[#41679F]">
            {profileTab === "progress" ? (
              <TrendingUp size={25} strokeWidth={1.8} />
            ) : (
              <Star size={25} strokeWidth={1.8} />
            )}
          </span>

          <span className="mt-4 !font-['Montserrat'] text-[9px] font-bold uppercase tracking-[0.14em] text-[#78869B]">
            {profileTab === "progress" ? "Progreso" : "Certificaciones"}
          </span>

          <h2 className="mt-1 !font-['Montserrat'] text-[18px] font-semibold text-[#182235]">
            Próximamente
          </h2>

          <p className="mt-2 max-w-[480px] !font-['Montserrat'] text-[11.5px] leading-relaxed text-[#7D8798]">
            {profileTab === "progress"
              ? "Esta sección quedará conectada con el progreso real del usuario y mostrará el avance de su ruta de aprendizaje."
              : "Aquí podrás consultar las certificaciones obtenidas y los logros asociados a tu ruta de aprendizaje."}
          </p>
        </section>
      )}
    </div>
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

  const trialState = getTrialState({
    me,
    learningRoute,
    invoices,
    purchases,
    planKey: planDetails.key,
  });

  const isTrial = trialState.isActive;
  const trialEnd = trialState.trialEnd;
  const trialDays = trialState.daysRemaining;
  const progressWidth = trialState.progressPercent;

  const firstChargeDate =
    trialEnd ||
    me?.current_period_end ||
    me?.subscription_renewal ||
    me?.subscription?.current_period_end ||
    null;

  const currentPlanTags = (planDetails.tags || []).filter(
    (tag) =>
      isTrial ||
      !String(tag).toLowerCase().includes("7 días gratis")
  );

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
      <div className="w-full pb-10">
        {/* ENCABEZADO */}
        <div className="mb-5">
          <span className="!font-['Montserrat'] text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6F7C90]">
            Membresía y facturación
          </span>

          <h1 className="mt-1 !font-['Montserrat'] text-[2rem] font-semibold leading-[1.08em] tracking-[-0.035em] text-[#121B2D]">
            Gestionar membresía
          </h1>

          <p className="mt-2 max-w-[760px] !font-['Montserrat'] text-sm leading-relaxed text-[#7D8798]">
            Administra tu plan, beneficios, métodos de pago y facturación desde un solo lugar.
          </p>

          {isCancelScheduled && (
            <div className="mt-4 flex items-start gap-3 rounded-[16px] border border-[#F0D59E] bg-[#FFF9EE] px-4 py-3.5">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-[#FFF0CB] !font-['Montserrat'] text-sm font-bold text-[#B7791F]">
                !
              </span>

              <div>
                <h3 className="!font-['Montserrat'] text-sm font-semibold text-[#2A3446]">
                  Tu suscripción tiene una cancelación programada
                </h3>
                <p className="mt-0.5 !font-['Montserrat'] text-[12px] leading-relaxed text-[#7A6E58]">
                  Mantendrás acceso hasta el {fmtDate(me?.current_period_end)}. Después de esa fecha tu acceso será restringido.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* PLAN ACTUAL */}
        <section className="relative overflow-hidden rounded-[22px] border border-[#203957] bg-[linear-gradient(135deg,#111D31_0%,#203C64_56%,#41679F_100%)] p-5 text-white shadow-[0_18px_50px_rgba(17,29,49,0.18)] md:p-6">
          <div className="pointer-events-none absolute -right-16 -top-20 h-[240px] w-[240px] rounded-full bg-[#C9F4F7]/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-90px] left-[38%] h-[180px] w-[260px] rounded-full bg-white/5 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="!font-['Montserrat'] text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60">
                  Tu plan actual
                </span>

                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 !font-['Montserrat'] text-[9px] font-semibold uppercase tracking-[0.08em] text-white/90">
                  {planDetails.key === "free"
                    ? "Gratis"
                    : planDetails.billingCycle === "yearly"
                    ? "Anual"
                    : "Mensual"}
                </span>

                {isTrial && planDetails.key !== "free" && (
                  <span className="rounded-full bg-[#D9F7E3] px-3 py-1 !font-['Montserrat'] text-[9px] font-bold uppercase tracking-[0.08em] text-[#31784A]">
                    Prueba activa
                  </span>
                )}
              </div>

              <h2 className="mt-3 !font-['Montserrat'] text-[1.65rem] font-semibold leading-tight tracking-[-0.025em] text-white">
                {planDetails.title}
              </h2>

              <p className="mt-2 max-w-[720px] !font-['Montserrat'] text-[13px] leading-relaxed text-white/72">
                {planDetails.planLine}
              </p>

              {!!currentPlanTags.length && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {currentPlanTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 !font-['Montserrat'] text-[10px] font-medium text-white/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="shrink-0 md:min-w-[190px] md:text-right">
              <span className="!font-['Montserrat'] text-[9px] font-semibold uppercase tracking-[0.14em] text-white/55">
                Valor del plan
              </span>

              <div className="mt-1 !font-['Montserrat'] text-[2.5rem] font-semibold leading-none tracking-[-0.05em] text-white">
                {currentActivePrice}
              </div>

              {planDetails.key !== "free" && (
                <div className="mt-2 !font-['Montserrat'] text-[11px] leading-relaxed text-white/65">
                  USD / mes
                  <br />
                  {planDetails.billingCycle === "yearly"
                    ? "Facturación anual"
                    : "Facturación mensual"}
                </div>
              )}

              {planDetails.key !== "free" &&
                planDetails.billingCycle === "yearly" &&
                planDetails.yearlyTotal && (
                  <div className="mt-1 !font-['Montserrat'] text-[10px] font-medium text-[#D8F2F5]">
                    {planDetails.yearlyTotal}
                  </div>
                )}
            </div>
          </div>

          {isTrial && planDetails.key !== "free" && (
            <div className="relative mt-5 border-t border-white/10 pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 !font-['Montserrat'] text-[11px]">
                <span className="text-white/65">Período de prueba</span>
                <strong className="font-semibold text-white">
                  {trialDays === 1
                    ? "1 día restante"
                    : `${trialDays ?? 0} días restantes`}
                </strong>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/12">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#BDEFF5,#FFFFFF)]"
                  style={{ width: `${progressWidth}%` }}
                />
              </div>

              <p className="mt-2 !font-['Montserrat'] text-[11px] text-white/60">
                Próximo cobro: {fmtDate(firstChargeDate)} · {currentActivePrice} USD
              </p>
            </div>
          )}
        </section>

        {/* CAMBIAR PLAN */}
        <section className="mt-5 rounded-[20px] border border-[#E4E8EF] bg-white p-5 shadow-[0_7px_24px_rgba(17,29,49,0.035)] md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="!font-['Montserrat'] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7D8798]">
                Opciones de membresía
              </span>
              <h2 className="mt-1 !font-['Montserrat'] text-xl font-semibold tracking-[-0.02em] text-[#172033]">
                Cambiar plan
              </h2>
              <p className="mt-1 !font-['Montserrat'] text-[12px] text-[#7D8798]">
                Actualiza tu experiencia o cambia entre facturación mensual y anual.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-[14px] border border-[#E4E8EF] bg-[#F8FAFC] px-3 py-2">
              <span
                className={`!font-['Montserrat'] text-[11px] font-semibold ${
                  !isAnnual ? "text-[#182235]" : "text-[#8A94A6]"
                }`}
              >
                Mensual
              </span>

              <button
                type="button"
                onClick={() =>
                  setBillingCycle((prev) =>
                    prev === "monthly" ? "yearly" : "monthly"
                  )
                }
                className={`relative h-7 w-[58px] rounded-full p-1 transition ${
                  isAnnual
                    ? "bg-[linear-gradient(135deg,#111D31,#41679F)]"
                    : "bg-[#D9DEE7]"
                }`}
                aria-label="Cambiar período de facturación"
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white shadow-sm transition ${
                    isAnnual ? "translate-x-[30px]" : "translate-x-0"
                  }`}
                />
              </button>

              <span
                className={`!font-['Montserrat'] text-[11px] font-semibold ${
                  isAnnual ? "text-[#182235]" : "text-[#8A94A6]"
                }`}
              >
                Anual
              </span>

              <span className="rounded-full bg-[#DFF5E6] px-2.5 py-1 !font-['Montserrat'] text-[9px] font-bold text-[#39794C]">
                Ahorra 14%
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                (plan.key === "free" ||
                  planDetails.billingCycle === billingCycle);

              const isDowngrade =
                !active && targetPriceNumber < currentDisplayedValue;
              const isPlanX = plan.key === "x";
              const isPlus = plan.key === "plus";

              const shownPrice = isAnnual
                ? plan.yearlyPrice
                : plan.monthlyPrice;

              const features = getPlanFeatures(plan);

              return (
                <article
                  key={plan.key}
                  className={`relative flex min-h-[400px] flex-col overflow-hidden rounded-[18px] border p-4 transition duration-200 ${
                    active
                      ? "border-[#91A7C5] bg-[linear-gradient(180deg,#F4F7FB_0%,#FFFFFF_100%)] shadow-[0_12px_30px_rgba(29,53,87,0.09)]"
                      : "border-[#E2E7EE] bg-white hover:-translate-y-0.5 hover:border-[#C7D1DF] hover:shadow-[0_12px_28px_rgba(17,29,49,0.06)]"
                  }`}
                >
                  {active && (
                    <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#111D31,#41679F)]" />
                  )}

                  <div className="flex min-h-[26px] flex-wrap items-start justify-between gap-2">
                    {active ? (
                      <span className="rounded-full bg-[#E7EDF6] px-2.5 py-1 !font-['Montserrat'] text-[8px] font-bold uppercase tracking-[0.08em] text-[#34557F]">
                        Plan actual ·{" "}
                        {plan.key === "free"
                          ? "Free"
                          : isAnnual
                          ? "Anual"
                          : "Mensual"}
                      </span>
                    ) : isPlanX ? (
                      <span className="rounded-full bg-[#EAF2FB] px-2.5 py-1 !font-['Montserrat'] text-[8px] font-bold uppercase tracking-[0.08em] text-[#41679F]">
                        Más popular
                      </span>
                    ) : (
                      <span />
                    )}

                    {isDowngrade && (
                      <span className="rounded-full bg-[#FFF1F1] px-2.5 py-1 !font-['Montserrat'] text-[8px] font-bold uppercase tracking-[0.08em] text-[#C45555]">
                        Downgrade
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 !font-['Montserrat'] text-[17px] font-semibold leading-tight tracking-[-0.02em] text-[#172033]">
                    {plan.title}
                  </h3>

                  <div className="mt-3 flex items-end gap-1.5">
                    <strong className="!font-['Montserrat'] text-[2.2rem] font-semibold leading-none tracking-[-0.045em] text-[#172033]">
                      {shownPrice}
                    </strong>

                    {plan.key !== "free" && (
                      <span className="mb-1 !font-['Montserrat'] text-[10px] font-medium text-[#8A94A6]">
                        USD / mes
                      </span>
                    )}
                  </div>

                  {plan.key !== "free" && (
                    <p className="mt-2 min-h-[34px] !font-['Montserrat'] text-[10px] leading-relaxed text-[#7D8798]">
                      {isAnnual ? (
                        <>
                          {plan.yearlyTotal}
                          {plan.yearlySaving && (
                            <>
                              {" · "}
                              <span className="font-semibold text-[#43845A]">
                                {plan.yearlySaving}
                              </span>
                            </>
                          )}
                        </>
                      ) : (
                        <>o {plan.yearlyTotal}</>
                      )}
                    </p>
                  )}

                  <p className="mt-3 min-h-[55px] !font-['Montserrat'] text-[11px] leading-[1.55] text-[#687386]">
                    {plan.planLine}
                  </p>

                  {!!(plan.tags || []).length && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(plan.tags || []).slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[#F5F7FA] px-2.5 py-1 !font-['Montserrat'] text-[8.5px] font-medium text-[#657084]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="my-4 h-px bg-[#EEF1F5]" />

                  <span className="!font-['Montserrat'] text-[9px] font-semibold uppercase tracking-[0.1em] text-[#7D8798]">
                    Incluye
                  </span>

                  <ul className="mb-4 mt-2 space-y-2 !font-['Montserrat'] text-[10px] leading-[1.35] text-[#5D687B]">
                    {features.slice(0, 5).map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <span className="font-bold text-[#4C8B61]">✓</span>
                        <span>{feature}</span>
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
                    className={`mt-auto flex min-h-[38px] w-full items-center justify-center rounded-[11px] px-3 !font-['Montserrat'] text-[10.5px] font-semibold transition ${
                      active
                        ? "cursor-default bg-[#F1F3F6] text-[#9AA3B1]"
                        : isPlus || isPlanX
                        ? "bg-[#111D31] text-white hover:bg-[#1D3151]"
                        : "border border-[#DDE3EB] bg-white text-[#354156] hover:border-[#BFC9D8] hover:bg-[#F9FAFC]"
                    }`}
                  >
                    {active
                      ? "Plan actual"
                      : plan.key === "free"
                      ? "Cambiar a Free"
                      : `Cambiar a ${plan.title} ${
                          isAnnual ? "Anual" : "Mensual"
                        }`}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        {/* PAGO + CANCELACIÓN */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="rounded-[20px] border border-[#E4E8EF] bg-white p-5 shadow-[0_7px_24px_rgba(17,29,49,0.035)]">
            <span className="!font-['Montserrat'] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7D8798]">
              Cobro
            </span>
            <h2 className="mt-1 !font-['Montserrat'] text-lg font-semibold text-[#172033]">
              Método de pago
            </h2>
            <p className="mt-1 !font-['Montserrat'] text-[12px] text-[#7D8798]">
              Administra tus tarjetas y métodos de pago.
            </p>

            <div className="mt-4 space-y-3">
              {paymentMethods.length ? (
                paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex flex-col gap-3 rounded-[14px] border border-[#E6EAF0] bg-[#F9FAFC] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-10 min-w-[58px] place-items-center rounded-[9px] bg-[#152642] px-2 !font-['Montserrat'] text-[9px] font-bold uppercase tracking-[0.06em] text-white">
                        {method.brand || "CARD"}
                      </span>

                      <div className="min-w-0">
                        <p className="truncate !font-['Montserrat'] text-[12px] font-semibold text-[#263247]">
                          •••• •••• •••• {method.last4 || "—"}
                        </p>
                        <p className="mt-0.5 !font-['Montserrat'] text-[10px] text-[#8A94A6]">
                          Vence {method.exp_month || "—"}/{method.exp_year || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {method.is_default ? (
                        <span className="rounded-full bg-[#E5F5EA] px-3 py-1 !font-['Montserrat'] text-[9px] font-bold text-[#43845A]">
                          Principal
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDefaultMethod(method.id)}
                          className="rounded-full border border-[#BFD7C7] bg-white px-3 py-1 !font-['Montserrat'] text-[9px] font-semibold text-[#43845A] transition hover:bg-[#F2FAF4]"
                        >
                          Hacer principal
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => deletePaymentMethod(method)}
                        className="grid h-8 w-8 place-items-center rounded-full text-[#9AA3B1] transition hover:bg-[#FFF1F1] hover:text-[#C45555]"
                        title="Eliminar método de pago"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[14px] border border-[#E6EAF0] bg-[#F9FAFC] p-4 !font-['Montserrat'] text-[11px] text-[#7D8798]">
                  Aún no tienes métodos de pago guardados.
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowAddMethod(true)}
                className="inline-flex items-center gap-1 !font-['Montserrat'] text-[11px] font-semibold text-[#365E96] transition hover:text-[#244A7E]"
              >
                <span className="text-base leading-none">+</span>
                Agregar método de pago
              </button>
            </div>
          </section>

          <section className="rounded-[20px] border border-[#E4E8EF] bg-white p-5 shadow-[0_7px_24px_rgba(17,29,49,0.035)]">
            <span className="!font-['Montserrat'] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7D8798]">
              Suscripción
            </span>
            <h2 className="mt-1 !font-['Montserrat'] text-lg font-semibold text-[#172033]">
              Gestionar cancelación
            </h2>
            <p className="mt-1 !font-['Montserrat'] text-[12px] text-[#7D8798]">
              Puedes cancelar o reactivar tu membresía según el estado actual.
            </p>

            <div className="mt-4 rounded-[14px] border border-[#E6EAF0] bg-[#F9FAFC] p-4">
              <h3 className="!font-['Montserrat'] text-[13px] font-semibold text-[#263247]">
                {isCancelScheduled
                  ? "Cancelación programada"
                  : "Cancelar membresía"}
              </h3>

              <p className="mt-1 !font-['Montserrat'] text-[11px] leading-relaxed text-[#7D8798]">
                {isCancelScheduled
                  ? `Tu acceso continuará hasta el ${fmtDate(
                      me?.current_period_end
                    )}.`
                  : "Tu acceso continuará hasta finalizar tu período actual."}
              </p>

              {isCancelScheduled ? (
                <button
                  type="button"
                  onClick={reactivateSubscription}
                  className="mt-5 flex h-[42px] w-full items-center justify-center rounded-[11px] bg-[#111D31] px-4 !font-['Montserrat'] text-[11px] font-semibold text-white transition hover:bg-[#1D3151]"
                >
                  Reactivar suscripción
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCancelStep("reason")}
                  disabled={planDetails.key === "free"}
                  className="mt-5 flex h-[42px] w-full items-center justify-center rounded-[11px] border border-[#EDCACA] bg-white px-4 !font-['Montserrat'] text-[11px] font-semibold text-[#B84D4D] transition hover:bg-[#FFF7F7] disabled:cursor-not-allowed disabled:border-[#E7EAF0] disabled:bg-[#F5F6F8] disabled:text-[#A4ACB8]"
                >
                  Cancelar membresía
                </button>
              )}
            </div>
          </section>
        </div>

        {/* FACTURACIÓN */}
        <section className="mt-5 rounded-[20px] border border-[#E4E8EF] bg-white p-5 shadow-[0_7px_24px_rgba(17,29,49,0.035)] md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="!font-['Montserrat'] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7D8798]">
                Historial
              </span>
              <h2 className="mt-1 !font-['Montserrat'] text-lg font-semibold text-[#172033]">
                Facturación y pagos
              </h2>
              <p className="mt-1 !font-['Montserrat'] text-[12px] text-[#7D8798]">
                Descarga facturas y consulta tu historial de pagos.
              </p>
            </div>

            <button
              type="button"
              onClick={openBillingPortal}
              className="flex h-[40px] shrink-0 items-center justify-center rounded-[11px] bg-[#111D31] px-4 !font-['Montserrat'] text-[10.5px] font-semibold text-white transition hover:bg-[#1D3151]"
            >
              Gestionar facturación en Stripe
            </button>
          </div>

          <div className="mt-5 overflow-hidden rounded-[14px] border border-[#E7EBF1]">
            {invoices.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full !font-['Montserrat'] text-[11px]">
                  <thead className="bg-[#F8FAFC]">
                    <tr className="border-b border-[#E7EBF1] text-[#7D8798]">
                      <th className="px-4 py-3 text-left font-semibold">Fecha</th>
                      <th className="px-4 py-3 text-left font-semibold">Factura</th>
                      <th className="px-4 py-3 text-left font-semibold">Monto</th>
                      <th className="px-4 py-3 text-left font-semibold">Estado</th>
                      <th className="px-4 py-3 text-left font-semibold">Acciones</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white">
                    {invoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="border-b border-[#EEF1F5] last:border-b-0"
                      >
                        <td className="whitespace-nowrap px-4 py-4 text-[#526075]">
                          {fmtDate(invoice.created_at)}
                        </td>
                        <td className="px-4 py-4 font-medium text-[#263247]">
                          {invoice.number || invoice.id}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 font-semibold text-[#263247]">
                          {fmtMoney(invoice.amount, invoice.currency)}
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-[#FFF4D9] px-2.5 py-1 text-[9px] font-semibold text-[#A76D16]">
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            {invoice.hosted_invoice_url && (
                              <button
                                type="button"
                                onClick={() =>
                                  openInvoiceModal(
                                    invoice.hosted_invoice_url
                                  )
                                }
                                className="rounded-full bg-[#111D31] px-3 py-1.5 !font-['Montserrat'] text-[9px] font-semibold text-white transition hover:bg-[#1D3151]"
                              >
                                Ver factura
                              </button>
                            )}

                            {invoice.invoice_pdf && (
                              <a
                                href={invoice.invoice_pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full border border-[#CFD8E5] bg-white px-3 py-1.5 !font-['Montserrat'] text-[9px] font-semibold text-[#41679F] transition hover:bg-[#F6F9FC]"
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
              </div>
            ) : (
              <div className="bg-[#F9FAFC] p-5 !font-['Montserrat'] text-[11px] text-[#7D8798]">
                Aún no tienes facturas generadas por Stripe.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* MODALES EXTERNOS EXISTENTES */}
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

      {/* MODAL FACTURA */}
      {invoiceModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0D1726]/55 p-4 backdrop-blur-[3px]">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={() => setInvoiceModalOpen(false)}
            aria-label="Cerrar modal"
          />

          <div className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-[22px] border border-white/70 bg-white shadow-[0_30px_90px_rgba(13,26,45,0.28)]">
            <div className="border-b border-[#E9EDF2] px-6 py-5">
              <button
                type="button"
                onClick={() => setInvoiceModalOpen(false)}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-[#F2F4F7] text-[#667085] transition hover:bg-[#E8ECF1]"
                aria-label="Cerrar"
              >
                ×
              </button>

              <span className="!font-['Montserrat'] text-[9px] font-semibold uppercase tracking-[0.15em] text-[#41679F]">
                Facturación
              </span>
              <h3 className="mt-1 pr-10 !font-['Montserrat'] text-xl font-semibold text-[#172033]">
                Ver factura en Stripe
              </h3>
              <p className="mt-2 !font-['Montserrat'] text-[12px] leading-relaxed text-[#7D8798]">
                Por seguridad, Stripe no permite mostrar esta factura embebida dentro de la página.
              </p>
            </div>

            <div className="p-6">
              <div className="rounded-[14px] border border-[#E5E9EF] bg-[#F8FAFC] p-4 !font-['Montserrat'] text-[11px] leading-relaxed text-[#687386]">
                La factura se abrirá en una nueva pestaña directamente desde Stripe.
              </div>

              <button
                type="button"
                onClick={() =>
                  window.open(
                    invoiceModalUrl,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                className="mt-5 flex h-[44px] w-full items-center justify-center rounded-[12px] bg-[#111D31] px-5 !font-['Montserrat'] text-[11px] font-semibold text-white transition hover:bg-[#1D3151]"
              >
                Abrir factura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MOTIVO CANCELACIÓN */}
      {cancelStep === "reason" && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#0D1726]/55 px-4 backdrop-blur-[3px]">
          <div className="w-full max-w-[560px] overflow-hidden rounded-[22px] border border-white/70 bg-white shadow-[0_30px_90px_rgba(13,26,45,0.28)]">
            <div className="border-b border-[#E9EDF2] px-6 py-5">
              <span className="!font-['Montserrat'] text-[9px] font-semibold uppercase tracking-[0.15em] text-[#A65A5A]">
                Cancelación
              </span>

              <h2 className="mt-1 !font-['Montserrat'] text-xl font-semibold text-[#172033]">
                ¿Por qué deseas cancelar?
              </h2>

              <p className="mt-2 !font-['Montserrat'] text-[12px] leading-relaxed text-[#7D8798]">
                Tu opinión nos ayuda a mejorar. Selecciona la razón principal.
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-2">
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
                    className={`flex w-full items-center gap-3 rounded-[12px] border px-4 py-3 text-left !font-['Montserrat'] transition ${
                      cancelReason === reason
                        ? "border-[#91A7C5] bg-[#F2F6FB]"
                        : "border-[#E4E8EF] bg-white hover:bg-[#FAFBFC]"
                    }`}
                  >
                    <span
                      className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border ${
                        cancelReason === reason
                          ? "border-[#41679F]"
                          : "border-[#C9D0DA]"
                      }`}
                    >
                      {cancelReason === reason && (
                        <span className="h-2 w-2 rounded-full bg-[#41679F]" />
                      )}
                    </span>

                    <span className="text-[11px] font-medium text-[#354156]">
                      {reason}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setCancelStep(null);
                    setCancelReason("");
                  }}
                  className="order-2 flex h-[43px] items-center justify-center rounded-[11px] border border-[#DDE3EB] bg-white px-5 !font-['Montserrat'] text-[11px] font-semibold text-[#354156] transition hover:bg-[#F8FAFC] sm:order-1"
                >
                  Volver
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!cancelReason) {
                      toast.error("Selecciona una razón para continuar.");
                      return;
                    }

                    setCancelStep("confirm");
                  }}
                  className="order-1 flex h-[43px] items-center justify-center rounded-[11px] bg-[#111D31] px-5 !font-['Montserrat'] text-[11px] font-semibold text-white transition hover:bg-[#1D3151] sm:order-2"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR CANCELACIÓN */}
      {cancelStep === "confirm" && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#0D1726]/55 px-4 backdrop-blur-[3px]">
          <div className="w-full max-w-[560px] overflow-hidden rounded-[22px] border border-white/70 bg-white shadow-[0_30px_90px_rgba(13,26,45,0.28)]">
            <div className="border-b border-[#E9EDF2] px-6 py-5">
              <span className="!font-['Montserrat'] text-[9px] font-semibold uppercase tracking-[0.15em] text-[#A65A5A]">
                Confirmación
              </span>

              <h2 className="mt-1 !font-['Montserrat'] text-xl font-semibold text-[#172033]">
                Confirmar cancelación
              </h2>

              <p className="mt-2 !font-['Montserrat'] text-[12px] leading-relaxed text-[#7D8798]">
                Tu acceso a <strong className="font-semibold text-[#354156]">{planDetails.title}</strong> continuará hasta el{" "}
                <strong className="font-semibold text-[#354156]">{fmtDate(firstChargeDate)}</strong>.
              </p>
            </div>

            <div className="p-6">
              <div className="rounded-[14px] border border-[#E5E9EF] bg-[#F8FAFC] p-4">
                <h3 className="!font-['Montserrat'] text-[12px] font-semibold text-[#263247]">
                  Después de esta fecha:
                </h3>

                <ul className="mt-3 space-y-2 !font-['Montserrat'] text-[11px] text-[#687386]">
                  <li className="flex gap-2">
                    <span className="text-[#C45555]">×</span>
                    No tendrás acceso a proveedores premium
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#C45555]">×</span>
                    No podrás obtener nuevas certificaciones
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#C45555]">×</span>
                    Top Education IA dejará de estar disponible
                  </li>
                </ul>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setCancelStep(null);
                    setCancelReason("");
                  }}
                  className="flex h-[43px] items-center justify-center rounded-[11px] bg-[#111D31] px-5 !font-['Montserrat'] text-[11px] font-semibold text-white transition hover:bg-[#1D3151]"
                >
                  Mantener suscripción
                </button>

                <button
                  type="button"
                  onClick={confirmCancelSubscription}
                  disabled={cancelLoading}
                  className="flex h-[43px] items-center justify-center rounded-[11px] border border-[#EDCACA] bg-white px-5 !font-['Montserrat'] text-[11px] font-semibold text-[#B84D4D] transition hover:bg-[#FFF7F7] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cancelLoading
                    ? "Cancelando..."
                    : "Confirmar cancelación"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AccountSkeleton() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <aside className="fixed inset-y-0 left-0 hidden w-[236px] border-r border-[#E6EAF0] bg-white lg:block">
        <div className="h-[64px] border-b border-[#E7EAF0]" />
      </aside>

      <div className="fixed left-0 right-0 top-0 h-[64px] border-b border-[#E7EAF0] bg-white lg:left-[236px]" />
      <div className="fixed left-0 right-0 top-[64px] h-[50px] border-b border-[#EDF0F4] bg-white lg:left-[236px]" />

      <main className="min-h-screen px-4 pb-10 pt-[138px] lg:ml-[236px] lg:px-8 lg:pt-[146px]">
        <div className="mx-auto max-w-[1240px] animate-pulse">
          <div className="h-8 w-[280px] rounded-full bg-[#E6EAF0]" />
          <div className="mt-4 h-5 w-[460px] max-w-full rounded-full bg-[#E9EDF2]" />
          <div className="mt-10 h-[360px] rounded-[24px] bg-white shadow-sm" />
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="h-[240px] rounded-[24px] bg-white shadow-sm" />
            <div className="h-[240px] rounded-[24px] bg-white shadow-sm" />
          </div>
        </div>
      </main>
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
  const [showHelp, setShowHelp] = useState(false);

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

  if (loading) {
    return (
      <>
        <Seo
          title="Mi cuenta"
          description="Administra tu cuenta, ruta de aprendizaje y membresía en Top Education."
          canonicalPath="/account"
          robots="noindex, nofollow"
        />
        <AccountSkeleton />
      </>
    );
  }

  if (errorMsg) {
    return (
      <>
        <Seo
          title="Mi cuenta"
          description="Administra tu cuenta, ruta de aprendizaje y membresía en Top Education."
          canonicalPath="/account"
          robots="noindex, nofollow"
        />
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
      </>
    );
  }

  const planDetails = getPlanDetails(me, learningRoute);
  const planLabel = planDetails.badge;
  const activeTabLabel =
    TABS.find((item) => item.key === activeTab)?.label || "Mi espacio";

  return (
    <>
      <Seo
        title="Mi cuenta"
        description="Administra tu cuenta, ruta de aprendizaje y membresía en Top Education."
        canonicalPath="/account"
        robots="noindex, nofollow"
      />

      <Elements stripe={stripePromise}>
        <div className="min-h-screen bg-[#F7F8FA]">
          <TopBar
            activeLabel={activeTabLabel}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onOpenHelp={() => setShowHelp(true)}
            onOpenProfile={() => changeTab("profile")}
          />

          <Sidebar
            activeTab={activeTab}
            learningRoute={learningRoute}
            onTabChange={changeTab}
            me={me}
            planLabel={planLabel}
            backendBaseUrl={backendBaseUrl}
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

          <main className="box-border min-h-screen px-2 pb-8 pt-[126px] sm:px-4 lg:ml-[236px] lg:px-8 lg:pb-12 lg:pt-[138px] xl:px-10">
            <div className="mx-auto max-w-[1240px]">
              {activeTab === "career" && (
                <CareerTab
                  learningRoute={learningRoute}
                  currentPlanKey={planDetails.key}
                  onPlanAction={(targetPlan) => {
                    sessionStorage.setItem(
                      "careerTargetPlan",
                      targetPlan
                    );

                    changeTab("license");
                  }}
                  onComparePlans={() => {
                    changeTab("license");
                  }}
                />
              )}

              {activeTab === "courses" && (
                <AvailableCoursesTab backendBaseUrl={backendBaseUrl} />
              )}

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

          <HelpFormModal
            open={showHelp}
            onClose={() => setShowHelp(false)}
          />

          <DashboardWelcomeModal
            open={showWelcome}
            onClose={() => setShowWelcome(false)}
            defaultTab={defaultTab}
          />
        </div>
      </Elements>
    </>
  );
}