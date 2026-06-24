// src/pages/StartNow.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import endpoints from "../config/api";

async function postJSON(url, body, { withCredentials = true } = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body || {}),
    ...(withCredentials ? { credentials: "include" } : {}),
  });

  const text = await res.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (data?.error === "not_authenticated" || res.status === 401) {
    throw Object.assign(new Error("not_authenticated"), {
      code: "not_authenticated",
    });
  }

  if (!res.ok || data?.ok === false) {
    const detail =
      data?.detail ||
      data?.message ||
      data?.error ||
      data?.errorCode ||
      `HTTP ${res.status}`;

    throw new Error(detail);
  }

  return data;
}

const normalizeLevelItems = (levelData) => {
  if (Array.isArray(levelData)) return levelData;
  if (Array.isArray(levelData?.items)) return levelData.items;
  return [];
};

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="m13 5 7 7-7 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StarLogo = ({ size = "lg" }) => {
  const isSmall = size === "sm";

  return (
    <div
      className={`relative grid place-items-center ${
        isSmall ? "h-16 w-16" : "h-32 w-32"
      }`}
    >
      <span className="absolute h-full w-full animate-[topoWave_2.4s_ease-out_infinite] rounded-full bg-[#2563EB]/10" />
      <span className="absolute h-full w-full animate-[topoWave_2.4s_ease-out_infinite_0.8s] rounded-full bg-[#2563EB]/10" />

      <div
        className={`relative z-10 grid place-items-center rounded-full bg-[linear-gradient(135deg,#2563EB_0%,#2563EB_45%,#165C5B_100%)] text-white shadow-[0_18px_55px_rgba(25,65,207,0.35)] ${
          isSmall ? "h-14 w-14 text-2xl" : "h-24 w-24 text-5xl"
        }`}
      >
        ★
      </div>
    </div>
  );
};

const StepProgress = ({ current }) => (
  <div className="mb-5">
    <span className="!font-['Montserrat'] text-[13px] font-semibold uppercase text-neutral-600">
      Paso {current} de 3
    </span>

    <div className="mt-2 h-1 overflow-hidden rounded-full bg-black/10">
      <div
        className="h-full rounded-full bg-[#2563EB] transition-all duration-300"
        style={{ width: `${(current / 3) * 100}%` }}
      />
    </div>
  </div>
);

const FormInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  rightAction = null,
  readOnly = false,
}) => (
  <label className="block !font-['Montserrat'] text-[18px] font-semibold text-[#111111]">
    {label} {required && <span className="text-[#2563EB]">*</span>}

    <div className="relative mt-1">
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-full rounded-[25px] border border-black/10 bg-white px-7 py-3 pr-20 text-[18px] font-normal text-[#111111] outline-none transition-all duration-300 placeholder:text-neutral-300 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15 read-only:bg-neutral-50"
      />

      {rightAction}
    </div>
  </label>
);

const FormSelect = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  children,
}) => (
  <label className="block !font-['Montserrat'] text-[18px] font-semibold text-[#111111]">
    {label} {required && <span className="text-[#2563EB]">*</span>}

    <select
      value={value || ""}
      onChange={onChange}
      className="mt-1 w-full rounded-[25px] border border-black/10 bg-white px-7 py-4 text-[18px] font-normal text-[#111111] outline-none transition-all duration-300 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15"
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  </label>
);

const CheckIcon = () => (
  <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
    <circle cx="27" cy="27" r="18" stroke="currentColor" strokeWidth="4" />
    <path
      d="M18 27.5L24.5 34L37 21"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LockIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path
      d="M7 10V8a5 5 0 0 1 10 0v2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M6 10h12v10H6V10Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M12 15v2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const countries = [
  "Colombia",
  "México",
  "Perú",
  "Chile",
  "Argentina",
  "Ecuador",
  "Estados Unidos",
  "España",
  "Otro",
];

const getPasswordChecks = (password = "") => ({
  length: password.length >= 8,
  uppercase: /[A-ZÁÉÍÓÚÑ]/.test(password),
  number: /\d/.test(password),
  special: /[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9]/.test(password),
});

const getPasswordScore = (password = "") => {
  const checks = getPasswordChecks(password);
  return Object.values(checks).filter(Boolean).length;
};

const PasswordStrength = ({ password }) => {
  const checks = getPasswordChecks(password);
  const score = getPasswordScore(password);
  const label =
    score >= 4
      ? "Fuerte"
      : score >= 3
      ? "Buena"
      : score >= 2
      ? "Media"
      : password
      ? "Débil"
      : "";

  return (
    <div className="mt-3">
      <div className="grid grid-cols-4 gap-1">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className={`h-1.5 rounded-full ${
              score >= item ? "bg-[#5CC781]" : "bg-neutral-200"
            }`}
          />
        ))}
      </div>

      <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 !font-['Montserrat'] !text-[10px] text-[13px] md:grid-cols-4">
        <span className={checks.length ? "text-[#5CC781]" : "text-neutral-400"}>
          {checks.length ? "⌁" : "○"} 8 caracteres mínimo
        </span>
        <span
          className={checks.uppercase ? "text-[#5CC781]" : "text-neutral-400"}
        >
          {checks.uppercase ? "⌁" : "○"} Una mayúscula
        </span>
        <span className={checks.number ? "text-[#5CC781]" : "text-neutral-400"}>
          {checks.number ? "⌁" : "○"} Un número
        </span>
        <span
          className={checks.special ? "text-[#5CC781]" : "text-neutral-400"}
        >
          {checks.special ? "⌁" : "○"} Un carácter especial
        </span>
      </div>

      <p className="mt-1 text-right !font-['Montserrat'] text-sm font-bold text-[#5CC781]">
        {label}
      </p>
    </div>
  );
};

const SuccessToast = ({ message }) => (
  <div className="fixed left-1/2 top-5 z-[9999] w-[calc(100vw-32px)] max-w-[560px] -translate-x-1/2 rounded-[18px] bg-[#6EC982] p-5 text-white shadow-[0_22px_55px_rgba(49,151,85,0.35)]">
    <div className="flex items-center gap-4">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-white/20 text-white">
        <CheckIcon />
      </span>
      <div>
        <h3 className="!font-['Montserrat'] text-xl font-black">
          ¡Cuenta creada exitosamente!
        </h3>
        <p className="!font-['Montserrat'] text-white/90">
          {message || "Tu cuenta está lista. Redirigiendo al dashboard..."}
        </p>
      </div>
    </div>
  </div>
);

const CourseCard = ({ course }) => (
  <article className="group overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(0,0,0,0.10)]">
    <div className="relative h-[150px] overflow-hidden bg-neutral-100">
      <img
        src={course.image}
        alt={course.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

      <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 !font-['Montserrat'] text-[11px] font-bold text-[#2563EB] shadow-sm">
        {course.level}
      </span>

      {course.platformLogo && (
        <span className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm">
          <img
            src={course.platformLogo}
            alt={course.provider || "Proveedor"}
            className="max-h-8 max-w-8 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </span>
      )}
    </div>

    <div className="p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="line-clamp-1 !font-['Montserrat'] text-sm font-bold text-neutral-500">
          {course.institution}
        </p>

        {course.provider && (
          <span className="shrink-0 rounded-full bg-[#F5F3EE] px-3 py-1 !font-['Montserrat'] text-[11px] font-bold text-neutral-600">
            {course.provider}
          </span>
        )}
      </div>

      <h4 className="mt-2 line-clamp-2 !font-['Montserrat'] text-[1rem] font-bold leading-tight text-[#111111]">
        {course.title}
      </h4>

      {course.mainSkill && (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#E8EEFF] px-3 py-1 !font-['Montserrat'] text-[12px] font-bold text-[#2563EB]">
          {course.mainSkillIcon && (
            <img
              src={course.mainSkillIcon}
              alt={course.mainSkill}
              className="h-4 w-4 rounded-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
          {course.mainSkill}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-3 !font-['Montserrat'] text-sm text-neutral-500">
        <span>⏱ {course.hours}</span>

        {course.idInterno && (
          <span className="text-[11px] text-neutral-400">
            ID MX
          </span>
        )}
      </div>
    </div>
  </article>
);

const cardElementOptions = {
  hidePostalCode: true,
  style: {
    base: {
      fontSize: "17px",
      color: "#111111",
      fontFamily: "Montserrat, Arial, sans-serif",
      "::placeholder": {
        color: "#A3A3A3",
      },
    },
    invalid: {
      color: "#D33B3E",
    },
  },
};

function StartNowContent() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [searchParams] = useSearchParams();

  const initialEmail = searchParams.get("email") || "";

  const [step, setStep] = useState("welcome");
  const [routeId, setRouteId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedPaidPlan, setSelectedPaidPlan] = useState("monthly_x");
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [showProPass, setShowProPass] = useState(false);
  const [showProPass2, setShowProPass2] = useState(false);
  const [paidSubscriptionData, setPaidSubscriptionData] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");

  const [isBuildingRoute, setIsBuildingRoute] = useState(false);

  const [recommendedByLevel, setRecommendedByLevel] = useState({
    level_1: [],
    level_2: [],
    level_3: [],
  });

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: initialEmail,
    age: "",
    gender: "",
    country: "",
    topics: [],
    goal: "",
    password: "",
    confirm_password: "",
    pro_password: "",
    pro_confirm_password: "",
  });

  const backendBaseUrl = useMemo(() => {
    const fromEnv = process.env.REACT_APP_API_URL;
    return (fromEnv || "http://127.0.0.1:8000").replace(/\/+$/, "");
  }, []);

  const LEARNING_ROUTE_CREATE_URL =
    endpoints.learningRouteCreate ||
    `${backendBaseUrl}/api/learning-route/create/`;

  const LEARNING_ROUTE_RECOMMENDATIONS_URL =
    endpoints.learningRouteRecommendations ||
    `${backendBaseUrl}/api/learning-route/recommendations/`;

  const LEARNING_ROUTE_COMPLETE_SIGNUP_URL =
    endpoints.learningRouteCompleteSignup ||
    `${backendBaseUrl}/api/learning-route/complete-signup/`;

  const LEARNING_ROUTE_FREE_SIGNUP_URL = LEARNING_ROUTE_COMPLETE_SIGNUP_URL;

  const BILLING_SETUP_INTENT_URL =
    endpoints.billingSetupIntent || `${backendBaseUrl}/api/billing/setup-intent/`;

  const BILLING_PAYMENT_METHOD_CREATE_URL =
    endpoints.billingPaymentMethodsCreate ||
    `${backendBaseUrl}/api/billing/payment-methods/create/`;

  const BILLING_SUBSCRIPTION_CREATE_URL =
    endpoints.billingSubscriptionCreate ||
    `${backendBaseUrl}/api/billing/subscriptions/create/`;

  const isAnnual = billingCycle === "yearly";

  const planXPrice = isAnnual ? "$25" : "$29";
  const planPlusPrice = isAnnual ? "$42" : "$49";

  const planXSubcopy = isAnnual ? (
    <>
      $299 USD al año ·{" "}
      <span className="font-black text-[#5CC781]">Ahorras $49</span>
    </>
  ) : (
    "o $299 USD al año"
  );

  const planPlusSubcopy = isAnnual ? (
    <>
      $499 USD al año ·{" "}
      <span className="font-black text-[#5CC781]">Ahorras $89</span>
    </>
  ) : (
    "o $499 USD al año"
  );

  const topicOptions = [
    ["🎯", "Inteligencia Artificial"],
    ["🎯", "Liderazgo"],
    ["📈", "Productividad"],
    ["📈", "Marketing"],
    ["🎯", "Ventas"],
    ["🎨", "Diseño UX/UI"],
    ["💻", "Desarrollo de Software"],
    ["📊", "Análisis de Datos"],
    ["📋", "Gestión de Proyectos"],
    ["💰", "Finanzas"],
    ["💬", "Comunicación"],
    ["🚀", "Innovación"],
    ["👥", "Recursos Humanos"],
    ["⭐", "Éxito del Cliente"],
  ];

  const goals = [
    ["📈", "Obtener un ascenso"],
    ["🚀", "Cambiar de carrera"],
    ["🧠", "Aprender nuevas habilidades"],
    ["👥", "Liderar equipos"],
    ["🎓", "Obtener certificaciones"],
    ["▥", "Mejorar mi desempeño actual"],
    ["💼", "Prepararme para una nueva oportunidad laboral"],
  ];

  const normalizeLevelLabel = (value) => {
    const level = String(value || "").toUpperCase();

    if (level === "BEGINNER") return "Principiante";
    if (level === "INTERMEDIATE") return "Intermedio";
    if (level === "ADVANCED") return "Avanzado";

    return value || "Recomendado";
  };

  const normalizeProviderName = (course) =>
    course.provider ||
    course.plataforma_nombre ||
    course.plataforma ||
    course.platform ||
    course.source_provider ||
    "";

  const normalizeCourseForCard = (course) => ({
    id: course.id,
    idInterno: course.id_interno || course.idInterno || "",
    colombiaCertificationId: course.colombiaCertificationId || course.id,
    title: course.nombre || course.title || "Certificación recomendada",
    level: normalizeLevelLabel(course.nivel_certificacion || course.level),
    hours: course.tiempo_certificacion || course.hours || "Flexible",
    institution:
      course.universidad_nombre ||
      course.empresa_nombre ||
      course.institution ||
      normalizeProviderName(course) ||
      "Top Education",
    provider: normalizeProviderName(course),
    platformLogo:
      course.platform_logo ||
      course.plat_ico ||
      course.plataforma_ico ||
      course.provider_logo ||
      "",
    mainSkill:
      course.main_skill ||
      course.skill_principal ||
      course.primary_skill ||
      "",
    mainSkillIcon:
      course.main_skill_icon ||
      course.skill_principal_icon ||
      course.primary_skill_icon ||
      "",
    image:
      course.imagen_final ||
      course.image ||
      course.imagen ||
      "/assets/content/courses/course-1.jpg",
  });

  const allRecommendedCourses = useMemo(
    () => [
      ...recommendedByLevel.level_1,
      ...recommendedByLevel.level_2,
      ...recommendedByLevel.level_3,
    ],
    [recommendedByLevel]
  );

  const learningRouteState = useMemo(
    () => ({
      route_id: routeId,
      name: `${form.first_name} ${form.last_name}`.trim(),
      email: form.email,
      age: form.age,
      gender: form.gender,
      country: form.country,
      goal: form.goal,
      topics: form.topics,
      selected_plan: selectedPlan,
      selected_paid_plan: selectedPaidPlan,
      status: selectedPlan === "free" ? "free_active" : "pro_trialing",
      recommended_courses: allRecommendedCourses,
    }),
    [form, routeId, selectedPlan, selectedPaidPlan, allRecommendedCourses]
  );

  const activePlanName = selectedPaidPlan.includes("plus")
    ? "Top Education Plus"
    : "Top Education X";

  const activePlanPrice = selectedPaidPlan.includes("plus")
    ? planPlusPrice
    : planXPrice;

  const activePlanInterval = selectedPaidPlan.includes("yearly") ? "año" : "mes";

  const activePlanDescription = selectedPaidPlan.includes("plus")
    ? "Obtén 7 días gratis de Top Education Plus. Cancela cuando quieras."
    : "Obtén 7 días gratis de Top Education X con MasterClass y Coursera. Cancela cuando quieras.";

  const trialEndDate = paidSubscriptionData?.trial_end
    ? new Date(paidSubscriptionData.trial_end).toLocaleDateString("es-CO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "al finalizar el período de prueba";

  const canContinueInfo =
    form.first_name.trim() &&
    form.last_name.trim() &&
    form.email.trim() &&
    form.age &&
    form.gender &&
    form.country;

  const syncClientifyHiddenForm = (payload = {}) => {
    const formEl = document.getElementById("clientify-startnow-form");
    if (!formEl) return;

    Object.entries(payload).forEach(([key, value]) => {
      const input = formEl.querySelector(`[name="${key}"]`);
      if (!input) return;

      input.value = Array.isArray(value) ? value.join(", ") : value || "";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  };

  const PasswordMatchMessage = ({ password, confirmPassword }) => {
    if (!confirmPassword) return null;

    const match = password === confirmPassword;

    return (
      <p
        className={`mt-2 !font-['Montserrat'] text-sm font-semibold ${
          match ? "text-[#5CC781]" : "text-red-500"
        }`}
      >
        {match ? "✓ Las contraseñas coinciden" : "Las contraseñas aún no coinciden"}
      </p>
    );
  };

  const submitClientifyHiddenForm = () => {
    const formEl = document.getElementById("clientify-startnow-form");
    if (!formEl) return;

    const emailInput = formEl.querySelector('[name="email"]');

    if (!emailInput?.value) return;

    formEl.dispatchEvent(
      new Event("submit", {
        bubbles: true,
        cancelable: true,
      })
    );
  };


  const pushClientifyEvent = (eventName, extra = {}) => {
    const payload = {
      event: eventName,
      source: "startNow",
      route_id: routeId,
      step,
      email: form.email,
      first_name: form.first_name,
      last_name: form.last_name,
      age: form.age,
      gender: form.gender,
      country: form.country,
      topics: form.topics,
      goal: form.goal,
      selected_plan: extra.selected_plan ?? selectedPlan,
      selected_paid_plan: extra.selected_paid_plan ?? selectedPaidPlan,
      billing_cycle: extra.billing_cycle ?? billingCycle,
      package_code: extra.package_code,
      ...extra,
    };

    syncClientifyHiddenForm(payload);
    submitClientifyHiddenForm();

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    window.topEducationLead = payload;

    window.dispatchEvent(
      new CustomEvent("topeducation:startnow", {
        detail: payload,
      })
    );
  };
  useEffect(() => {
    syncClientifyHiddenForm({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      age: form.age,
      gender: form.gender,
      country: form.country,
      topics: form.topics,
      goal: form.goal,
      selected_plan: selectedPlan,
      selected_paid_plan: selectedPaidPlan,
      billing_cycle: billingCycle,
      route_id: routeId || "",
    });
  }, [form, selectedPlan, selectedPaidPlan, billingCycle, routeId]);

  const trackClientifyPlanInterest = (planValue) => {
    const finalPlan = getFinalPlanFromPaidPlan(planValue);
    const packageCode = getPackageCode(planValue, finalPlan);

    pushClientifyEvent("startnow_plan_selected", {
      selected_plan: finalPlan,
      selected_paid_plan: planValue,
      billing_cycle: planValue.includes("yearly") ? "yearly" : "monthly",
      package_code: packageCode,
      recommended_courses: allRecommendedCourses.map((course, index) => ({
        idInterno: course.idInterno,
        colombiaCertificationId: course.colombiaCertificationId || course.id,
        title: course.title,
        provider: course.provider,
        level: course.level,
        order: index + 1,
      })),
    });
  };

  const persistLearningRoute = (override = {}) => {
    const payload = {
      ...learningRouteState,
      ...override,
    };

    localStorage.setItem("learningRoute", JSON.stringify(payload));

    return payload;
  };

  const toggleTopic = (topic) => {
    setForm((prev) => {
      const exists = prev.topics.includes(topic);

      if (!exists && prev.topics.length >= 3) return prev;

      return {
        ...prev,
        topics: exists
          ? prev.topics.filter((item) => item !== topic)
          : [...prev.topics, topic],
      };
    });
  };

  const getPackageCode = (
    planValue = selectedPaidPlan,
    finalPlan = selectedPlan
  ) => {
    if (finalPlan === "free") return "TOP_EDUCATION_FREE";
    if (planValue === "monthly_x") return "TOP_EDUCATION_X_MONTHLY";
    if (planValue === "yearly_x") return "TOP_EDUCATION_X_ANNUAL";
    if (planValue === "monthly_plus") return "TOP_EDUCATION_PLUS_MONTHLY";
    if (planValue === "yearly_plus") return "TOP_EDUCATION_PLUS_ANNUAL";

    return "TOP_EDUCATION_FREE";
  };

  const getTier = (packageCode) => {
    if (packageCode.includes("PLUS")) return "PLUS";
    if (packageCode.includes("_X_")) return "X";
    return "FREE";
  };

  const getBillingPeriod = (packageCode) => {
    if (packageCode.includes("MONTHLY")) return "MONTHLY";
    if (packageCode.includes("ANNUAL")) return "ANNUAL";
    return null;
  };

  const getRouteLevelByCourse = (course) => {
    if (recommendedByLevel.level_1.some((item) => item.id === course.id)) return 1;
    if (recommendedByLevel.level_2.some((item) => item.id === course.id)) return 2;
    return 3;
  };

  const buildMxPayload = ({ finalPlan, subscriptionData = {} }) => {
    const packageCode = getPackageCode(selectedPaidPlan, finalPlan);
    const isFree = finalPlan === "free";

    return {
      schemaVersion: "1.0",
      eventType: "USER_ACCESS_PROVISION",
      traceId: `col-startnow-${routeId || Date.now()}`,
      customer: {
        email: form.email,
        emailNormalized: form.email.trim().toLowerCase(),
        name: form.first_name,
        lastName: form.last_name,
        age: form.age ? Number(form.age) : null,
        gender: form.gender,
        country: form.country,
      },
      learningProfile: {
        topics: form.topics.map((topic, index) => ({
          id: null,
          name: topic,
          order: index + 1,
        })),
        goal: form.goal,
      },
      recommendedCourses: allRecommendedCourses.map((course, index) => ({
        idInterno: course.idInterno,
        colombiaCertificationId: course.colombiaCertificationId || course.id,
        title: course.title,
        level: course.level,
        provider: course.provider,
        order: index + 1,
        routeLevel: getRouteLevelByCourse(course),
      })),
      plan: {
        packageCode,
        tier: getTier(packageCode),
        billingPeriod: getBillingPeriod(packageCode),
        accessStatus: "ALLOWED",
        lifecycleStatus: isFree ? "FREE" : "TRIALING",
        pendingAction: "NONE",
        trial: {
          isTrial: !isFree,
          trialStart: subscriptionData?.trial_start || null,
          trialEnd: subscriptionData?.trial_end || null,
          trialDays: isFree ? 0 : 7,
        },
      },
      billing: {
        source: "COLOMBIA",
        stripeCustomerId: subscriptionData?.stripe_customer_id || null,
        stripeSubscriptionId: subscriptionData?.stripe_subscription_id || null,
        stripePaymentMethodId: subscriptionData?.payment_method_id || null,
        status: isFree ? "free" : subscriptionData?.status || "trialing",
        currentPeriodEnd: subscriptionData?.current_period_end || null,
      },
      redirects: {
        subscriptionManagementUrl: `${window.location.origin}/account?tab=license`,
        colombiaAccountUrl: `${window.location.origin}/account`,
      },
      metadata: {
        routeId,
        selectedPaidPlan,
        createdFrom: "startNow",
      },
    };
  };

  const getFinalPlanFromPaidPlan = (paidPlan = selectedPaidPlan) => {
    if (paidPlan.includes("plus")) return "plus";
    if (paidPlan.includes("basic")) return "basic";
    if (paidPlan.includes("x")) return "x";
    return "free";
  };

  const validatePassword = () => {
    const score = getPasswordScore(form.password);

    if (score < 4) {
      setErrorMsg(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial."
      );
      return false;
    }

    if (form.password !== form.confirm_password) {
      setErrorMsg("Las contraseñas no coinciden.");
      return false;
    }

    return true;
  };

  const createRoute = async () => {
  setErrorMsg("");
  setLoading(true);
  setIsBuildingRoute(true);
  setStep("building");
  setProgress(8);

  try {
    pushClientifyEvent("startnow_generate_route_clicked");

    const recommendationsRes = await postJSON(
      LEARNING_ROUTE_RECOMMENDATIONS_URL,
      {
        topics: form.topics,
        goal: form.goal,
        limit_per_level: 3,
      }
    );

    const recData = recommendationsRes?.data || recommendationsRes || {};

    const nextRecommendedByLevel = {
      level_1: normalizeLevelItems(recData.level_1).map(normalizeCourseForCard),
      level_2: normalizeLevelItems(recData.level_2).map(normalizeCourseForCard),
      level_3: normalizeLevelItems(recData.level_3).map(normalizeCourseForCard),
    };

    setRecommendedByLevel(nextRecommendedByLevel);

    const flattenedRecommendations = [
      ...nextRecommendedByLevel.level_1.map((course, index) => ({
        ...course,
        routeLevel: 1,
        order: index + 1,
      })),
      ...nextRecommendedByLevel.level_2.map((course, index) => ({
        ...course,
        routeLevel: 2,
        order: index + 1,
      })),
      ...nextRecommendedByLevel.level_3.map((course, index) => ({
        ...course,
        routeLevel: 3,
        order: index + 1,
      })),
    ];

    const data = await postJSON(LEARNING_ROUTE_CREATE_URL, {
      email: form.email,
      first_name: form.first_name,
      last_name: form.last_name,
      age: form.age ? Number(form.age) : null,
      gender: form.gender,
      country: form.country,
      topics: form.topics,
      goal: form.goal,
      recommended_certifications: flattenedRecommendations,
    });

    setRouteId(data?.id || data?.data?.id || null);

    setProgress(100);

    setTimeout(() => {
      setStep("ready");
    }, 500);
  } catch (error) {
    setErrorMsg(error.message || "No se pudo crear la ruta.");
    setStep("goal");
  } finally {
    setLoading(false);
    setIsBuildingRoute(false);
  }
};

  const startFreeSignup = async () => {
    setErrorMsg("");

    if (!form.password || form.password.length < 8) {
      setErrorMsg("La contraseña debe tener mínimo 8 caracteres.");
      return;
    }

    if (form.password !== form.confirm_password) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      await postJSON(LEARNING_ROUTE_FREE_SIGNUP_URL, {
        route_id: routeId,
        email: form.email,
        password: form.password,
      });

      const payload = persistLearningRoute({
        selected_plan: "free",
        status: "free_active",
      });

      navigate("/account?tab=cv", {
        state: {
          learningRoute: payload,
        },
      });
    } catch (error) {
      setErrorMsg(error.message || "No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  const startProSignup = async () => {
    setErrorMsg("");

    if (!form.pro_password || form.pro_password.length < 8) {
      setErrorMsg("La contraseña debe tener mínimo 8 caracteres.");
      return;
    }

    if (form.pro_password !== form.pro_confirm_password) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      await postJSON(LEARNING_ROUTE_FREE_SIGNUP_URL, {
        route_id: routeId,
        email: form.email,
        password: form.pro_password,
      });

      setSelectedPlan("x");
      persistLearningRoute({
        selected_plan: "pro",
        status: "pro_account_created",
      });
      setStep("proPayment");
    } catch (error) {
      setErrorMsg(error.message || "No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  const completeSignup = async ({ plan, redirectTo }) => {
    setErrorMsg("");

    if (!validatePassword()) return;

    setLoading(true);

    try {
      const finalPlan =
        plan ||
        (selectedPlan === "free"
          ? "free"
          : selectedPaidPlan.includes("plus")
          ? "plus"
          : "x");

      const subscriptionData = paidSubscriptionData || {};

      const res = await postJSON(LEARNING_ROUTE_COMPLETE_SIGNUP_URL, {
        route_id: routeId,
        email: form.email,
        password: form.password,
        selected_plan: finalPlan,
        selected_paid_plan: finalPlan === "free" ? "free" : selectedPaidPlan,
        stripe_subscription_id: subscriptionData?.stripe_subscription_id,
        stripe_customer_id: subscriptionData?.stripe_customer_id,
        route_status: finalPlan === "free" ? "free_active" : "pro_trialing",
      });

      const mxStatusRaw =
        res?.mx_status ||
        res?.data?.mx_status ||
        res?.data?.status ||
        res?.status ||
        "";

      const mxStatus = String(mxStatusRaw).toUpperCase();

      const validMxStatuses = [
        "APPLIED",
        "DUPLICATE",
        "CREATED",
      ];

      if (!validMxStatuses.includes(mxStatus)) {
        throw new Error(
          res?.mx_message ||
            res?.message ||
            `MX no pudo crear/aplicar el acceso. Estado: ${mxStatus || "UNKNOWN"}`
        );
      }

      const payload = persistLearningRoute({
        selected_plan: finalPlan,
        selected_paid_plan: selectedPaidPlan,
        status: finalPlan === "free" ? "free_active" : "pro_trialing",
        stripe_subscription_id: subscriptionData?.stripe_subscription_id,
        trial_start: subscriptionData?.trial_start,
        trial_end: subscriptionData?.trial_end,
        mx_status: mxStatus,
        mx_magic_link:
          res?.magic_link ||
          res?.data?.magic_link ||
          res?.data?.magicLink ||
          null,
        mx_response: res?.data || res,
      });

      pushClientifyEvent("startnow_signup_completed", {
        final_plan: finalPlan,
        mx_status: mxStatus,
      });

      setShowSuccessToast(true);

      setTimeout(() => {
        navigate(redirectTo, {
          state: { learningRoute: payload },
          replace: true,
        });
      }, 1300);
    } catch (error) {
      setErrorMsg(error.message || "No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  
  const startProSubscription = async () => {
    setErrorMsg("");

    if (!stripe || !elements) {
      setErrorMsg("Stripe aún está cargando. Intenta nuevamente.");
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      setErrorMsg("No se encontró el formulario de tarjeta.");
      return;
    }

    if (!cardComplete) {
      setErrorMsg("Completa los datos de tu tarjeta.");
      return;
    }

    setLoading(true);

    try {
      pushClientifyEvent("startnow_payment_submit", {
        selected_paid_plan: selectedPaidPlan,
      });

      const setup = await postJSON(BILLING_SETUP_INTENT_URL, {
        route_id: routeId,
        email: form.email,
        name: `${form.first_name} ${form.last_name}`.trim(),
      });

      const clientSecret = setup?.client_secret || setup?.data?.client_secret;

      if (!clientSecret) {
        throw new Error("No se pudo generar el SetupIntent de Stripe.");
      }

      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: `${form.first_name} ${form.last_name}`.trim(),
            email: form.email,
          },
        },
      });

      if (result.error) {
        throw new Error(
          result.error.message || "No se pudo validar la tarjeta."
        );
      }

      const paymentMethodId = result.setupIntent?.payment_method;

      if (!paymentMethodId) {
        throw new Error("Stripe no devolvió el método de pago.");
      }

      const methodRes = await postJSON(BILLING_PAYMENT_METHOD_CREATE_URL, {
        route_id: routeId,
        email: form.email,
        payment_method_id: paymentMethodId,
      });

      const subscriptionRes = await postJSON(BILLING_SUBSCRIPTION_CREATE_URL, {
        route_id: routeId,
        email: form.email,
        payment_method_id: paymentMethodId,
        plan: selectedPaidPlan,
      });

      const subscriptionData = {
        ...(subscriptionRes?.data || {}),
        payment_method_id: paymentMethodId,
      };

      setPaidSubscriptionData(subscriptionData);

      const finalPlan = getFinalPlanFromPaidPlan(selectedPaidPlan);
      setSelectedPlan(finalPlan);

      persistLearningRoute({
        selected_plan: finalPlan,
        selected_paid_plan: selectedPaidPlan,
        status: subscriptionData?.status || "pro_trialing",
        stripe_subscription_id: subscriptionData?.stripe_subscription_id,
        trial_start: subscriptionData?.trial_start,
        trial_end: subscriptionData?.trial_end,
        payment_method: methodRes?.data || null,
      });

      setStep("subscriptionSuccess");
    } catch (error) {
      setErrorMsg(error.message || "No se pudo iniciar tu prueba gratuita.");
    } finally {
      setLoading(false);
    }
  };

  const skipToPlans = () => {
    document.getElementById("plans")?.scrollIntoView({
      behavior: "smooth",
    });
  };
  

  useEffect(() => {
    const emailFromUrl = searchParams.get("email") || "";

    if (emailFromUrl) {
      setForm((prev) => ({
        ...prev,
        email: emailFromUrl,
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo(0, 0);
    pushClientifyEvent("startnow_step_view", { step });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    if (step !== "building") return;

    setProgress(8);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        return Math.min(prev + 7, 92);
      });
    }, 420);

    return () => clearInterval(interval);
  }, [step]);

  return (
    <>
      <Helmet>
        <title>Empieza Ahora | Top Education</title>
        <meta
          name="description"
          content="Construye tu ruta personalizada de aprendizaje con Top Education."
        />
      </Helmet>

      <style>
        {`
          @keyframes topoWave {
            0% { transform: scale(0.6); opacity: 0.32; }
            70% { opacity: 0.12; }
            100% { transform: scale(1.8); opacity: 0; }
          }

          .route-dot-grid {
            background-image: radial-gradient(#2563EB 1px, transparent 1px);
            background-size: 22px 22px;
          }
        `}
      </style>

      {showSuccessToast && <SuccessToast />}

      <main className="min-h-screen bg-[#F6F4EF] text-[#080808]">
        <form
          id="clientify-startnow-form"
          name="clientify-startnow-form"
          data-clientify-form="startnow"
          className="fixed bottom-0 right-0 h-[1px] w-[1px] overflow-hidden opacity-[0.01] pointer-events-none"
          onSubmit={(e) => e.preventDefault()}
        >
          <input type="text" name="first_name" value={form.first_name} readOnly />
          <input type="text" name="last_name" value={form.last_name} readOnly />
          <input type="email" name="email" value={form.email} readOnly />
          <input type="text" name="age" value={form.age} readOnly />
          <input type="text" name="gender" value={form.gender} readOnly />
          <input type="text" name="country" value={form.country} readOnly />
          <input type="text" name="topics" value={form.topics.join(", ")} readOnly />
          <input type="text" name="goal" value={form.goal} readOnly />
          <input type="text" name="selected_plan" value={selectedPlan} readOnly />
          <input type="text" name="selected_paid_plan" value={selectedPaidPlan} readOnly />
          <input type="text" name="billing_cycle" value={billingCycle} readOnly />
          <input type="text" name="route_id" value={routeId || ""} readOnly />
          <button type="submit" tabIndex={-1}>
            Enviar
          </button>
        </form>
        {step === "welcome" && (
          <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-20 text-center">
            <div className="route-dot-grid absolute inset-0 opacity-[0.14]" />
            <div className="pointer-events-none absolute left-1/2 top-[18%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#2563EB]/10 blur-[120px]" />

            <div className="relative z-10 mx-auto max-w-[850px]">
              <div className="flex justify-center">
                <StarLogo />
              </div>

              <h1 className="mt-10 !font-['Montserrat'] text-[2rem] font-semibold leading-[1.08em] text-[#111111] md:text-[3.5rem]">
                Descubre tu ruta de aprendizaje ideal
              </h1>

              <p className="mx-auto mt-5 max-w-[650px] !font-['Montserrat'] text-[1rem] leading-[1.3em] text-neutral-600 md:text-[1.1rem]">
                Cuéntanos sobre tus intereses y metas. Crearemos un viaje de
                aprendizaje personalizado diseñado para tu crecimiento
                profesional.
              </p>

              <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setStep("info")}
                  className="inline-flex items-center gap-3 rounded-full bg-[#2563EB] px-4 py-2 md:px-10 md:py-5 !font-['Montserrat'] text-lg font-semibold text-white shadow-[0_22px_55px_rgba(25,65,207,0.30)] transition hover:-translate-y-1 hover:bg-[#1941CF]"
                >
                  Crear mi ruta de aprendizaje <ArrowIcon />
                </button>

                <button
                  type="button"
                  onClick={skipToPlans}
                  className="rounded-full px-4 py-2 md:px-8 md:py-4 !font-['Montserrat'] text-lg font-medium text-neutral-600 hover:text-black"
                >
                  Conocer Más
                </button>
              </div>

              <button
                type="button"
                onClick={skipToPlans}
                className="mt-10 !font-['Montserrat'] text-neutral-400 hover:text-neutral-700"
              >
                Saltar por ahora
              </button>
            </div>
          </section>
        )}

        {step === "info" && (
          <section className="mx-auto min-h-screen max-w-[720px] px-5 py-20 md:py-24">
            <StepProgress current={1} />

            <h2 className="!font-['Montserrat'] text-[1.6rem] md:text-[2.5rem] font-semibold text-[#111111]">
              Conozcámonos
            </h2>

            <p className="mt-0 !font-['Montserrat'] text-[1rem] md:text-[1.1rem] text-neutral-600">
              Usaremos esta información para personalizar tu experiencia.
            </p>

            <div className="mt-5 space-y-3">
              <FormInput
                label="Nombre"
                required
                value={form.first_name}
                onChange={(e) =>
                  setForm({ ...form, first_name: e.target.value })
                }
                placeholder="Ingresa tu nombre"
              />

              <FormInput
                label="Apellido"
                required
                value={form.last_name}
                onChange={(e) =>
                  setForm({ ...form, last_name: e.target.value })
                }
                placeholder="Ingresa tu apellido"
              />

              <FormInput
                label="Correo Electrónico"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Ingresa tu correo electrónico"
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormInput
                  label="Edad"
                  required
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  placeholder="Tu edad"
                />

                <FormSelect
                  label="Género"
                  required
                  value={form.gender}
                  onChange={(e) =>
                    setForm({ ...form, gender: e.target.value })
                  }
                  placeholder="Selecciona"
                >
                  <option value="female">Femenino</option>
                  <option value="male">Masculino</option>
                  <option value="non_binary">No binario</option>
                  <option value="prefer_not_to_say">Prefiero no decirlo</option>
                  <option value="other">Otro</option>
                </FormSelect>
              </div>

              <FormSelect
                label="País"
                required
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="Selecciona tu país"
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </FormSelect>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <button
                type="button"
                onClick={() => setStep("welcome")}
                className="px-7 py-4 !font-['Montserrat'] text-lg font-medium text-neutral-600"
              >
                Atrás
              </button>

              <button
                type="button"
                disabled={!canContinueInfo}
                onClick={() => {
                  pushClientifyEvent("startnow_info_completed", {
                    first_name: form.first_name,
                    last_name: form.last_name,
                    email: form.email,
                    age: form.age,
                    gender: form.gender,
                    country: form.country,
                  });

                  setStep("topics");
                }}
                className="flex flex-1 items-center justify-center gap-3 rounded-[18px] bg-[#2563EB] px-4 py-2 md:px-8 md:py-5 !font-['Montserrat'] text-lg font-semibold text-white shadow-[0_22px_50px_rgba(25,65,207,0.25)] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continuar <ArrowIcon />
              </button>
            </div>
          </section>
        )}

        {step === "topics" && (
          <section className="mx-auto min-h-screen max-w-[980px] px-5 py-20 md:py-24">
            <StepProgress current={2} />

            <h2 className="!font-['Montserrat'] text-[1.6rem] leading-[1.2em] md:text-[2.5rem] font-semibold text-[#111111]">
              ¿Qué te gustaría aprender?
            </h2>

            <p className="mt-0 !font-['Montserrat'] text-[1rem] md:text-[1.05rem] text-neutral-600">
              Selecciona hasta 3 temas que te interesen.
            </p>

            <div className="mt-3 flex items-center gap-3 !font-['Montserrat'] text-sm text-neutral-600">
              {[1, 2, 3].map((num) => (
                <span
                  key={num}
                  className={`grid h-9 w-9 place-items-center rounded-xl font-semibold ${
                    form.topics.length >= num
                      ? "bg-[#2563EB] text-white"
                      : "bg-black/5 text-neutral-400"
                  }`}
                >
                  {num}
                </span>
              ))}

              <span>
                {form.topics.length === 0
                  ? "Selecciona al menos 1 tema"
                  : `${form.topics.length} temas seleccionados`}
              </span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 md:grid-cols-5">
              {topicOptions.map(([icon, topic]) => {
                const active = form.topics.includes(topic);

                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    className={`min-h-[120px] rounded-[16px] border bg-white p-3 md:p-4 text-center transition-all hover:-translate-y-1 ${
                      active
                        ? "border-[#2563EB] shadow-[0_20px_45px_rgba(25,65,207,0.16)]"
                        : "border-black/10 shadow-sm"
                    }`}
                  >
                    <span className="mx-auto grid h-12 w-12 place-items-center rounded-[14px] bg-[#ECE9FF] text-2xl">
                      {icon}
                    </span>

                    <span className="mt-2 block !font-['Montserrat'] text-[.7rem] md:text-[.9rem] font-semibold leading-tight text-[#111111]">
                      {topic}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex items-center gap-6">
              <button
                type="button"
                onClick={() => setStep("info")}
                className="px-7 py-4 !font-['Montserrat'] text-lg font-medium text-neutral-600"
              >
                ‹ Atrás
              </button>

              <button
                type="button"
                disabled={form.topics.length === 0}
                onClick={() => {
                  pushClientifyEvent("startnow_topics_completed", {
                    topics: form.topics,
                  });

                  setStep("goal");
                }}
                className="flex flex-1 items-center justify-center gap-3 rounded-[18px] bg-[#2563EB] px-4 py-2 md:px-8 md:py-5 !font-['Montserrat'] text-lg font-semibold text-white shadow-[0_22px_50px_rgba(25,65,207,0.25)] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continuar <ArrowIcon />
              </button>
            </div>
          </section>
        )}

        {step === "goal" && (
          <section className="mx-auto min-h-screen max-w-[900px] px-5 py-20 md:py-24">
            <StepProgress current={3} />

            <h2 className="!font-['Montserrat'] text-[1.6rem] md:text-[2.5rem] font-semibold text-[#111111]">
              ¿Cuál es tu meta principal?
            </h2>

            <p className="mt-0 !font-['Montserrat'] text-[1rem] md:text-[1.05rem] text-neutral-600">
              Esto nos ayudará a personalizar tu ruta de aprendizaje.
            </p>

            <div className="mt-3 grid grid-cols-1 gap-2 md:gap-3 md:grid-cols-2">
              {goals.map(([icon, goal]) => {
                const active = form.goal === goal;

                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setForm({ ...form, goal })}
                    className={`flex min-h-[60px] md:min-h-[80px] items-center gap-3 rounded-[16px] border bg-white p-3 text-left transition-all hover:-translate-y-1 ${
                      active
                        ? "border-[#2563EB] shadow-[0_20px_45px_rgba(25,65,207,0.16)]"
                        : "border-black/10 shadow-sm"
                    }`}
                  >
                    <span className="grid h-10 w-10 md:h-14 md:w-14 place-items-center rounded-[14px] bg-[#ECE9FF] text-2xl">
                      {icon}
                    </span>

                    <span className="!font-['Montserrat'] text-[16px] md:text-[18px] font-semibold leading-tight text-[#111111]">
                      {goal}
                    </span>
                  </button>
                );
              })}
            </div>

            {errorMsg && (
              <div className="mt-6 rounded-[16px] border border-red-100 bg-red-50 px-5 py-4 !font-['Montserrat'] text-sm font-semibold text-red-600">
                {errorMsg}
              </div>
            )}

            <div className="mt-10 flex items-center gap-6">
              <button
                type="button"
                onClick={() => setStep("topics")}
                className="px-7 py-4 !font-['Montserrat'] text-lg font-medium text-neutral-600"
              >
                ‹ Atrás
              </button>

              <button
                type="button"
                disabled={!form.goal || loading}
                onClick={() => {
                  pushClientifyEvent("startnow_goal_completed", {
                    goal: form.goal,
                    topics: form.topics,
                  });

                  createRoute();
                }}
                className="flex flex-1 items-center justify-center gap-3 rounded-[18px] bg-[#2563EB] px-4 py-2 md:px-8 md:py-5 !font-['Montserrat'] text-lg font-semibold text-white shadow-[0_22px_50px_rgba(25,65,207,0.25)] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Generando..." : "Generar Mi Ruta"} <ArrowIcon />
              </button>
            </div>
          </section>
        )}

        {step === "building" && (
          <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-20 text-center">
            <div className="route-dot-grid absolute inset-0 opacity-[0.14]" />

            <div className="relative z-10 mx-auto max-w-[620px]">
              <div className="flex justify-center">
                <StarLogo size="sm" />
              </div>

              <h2 className="mt-10 !font-['Montserrat'] text-[2.4rem] font-semibold leading-tight tracking-[-0.05em] text-[#111111]">
                Construyendo tu ruta de aprendizaje personalizada...
              </h2>

              <p className="mt-5 !font-['Montserrat'] text-lg text-neutral-600">
                Seleccionando contenido relevante.
              </p>

              <div className="mt-10 h-2 overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#2563EB,#5CC781)] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-5 !font-['Montserrat'] text-neutral-400">
                {progress}%
              </p>
            </div>
          </section>
        )}

        {step === "ready" && (
          <section className="mx-auto max-w-[1280px] px-2 md:px-5 py-20 md:py-24">
            <div className="text-center">
              <h2 className="!font-['Montserrat'] text-[2rem] leading-[1.2em] font-semibold text-[#111111] md:text-[3rem]">
                Tu ruta de aprendizaje está lista
              </h2>

              <p className="mx-auto max-w-[760px] !font-['Montserrat'] text-[1rem] leading-[1.3em] text-neutral-600 md:text-[1.25rem]">
                Basándonos en tus intereses, hemos diseñado una experiencia
                personalizada para ayudarte a alcanzar tus objetivos
                profesionales.
              </p>
            </div>

            <section className="mt-8 rounded-[24px] bg-[#1941cf] px-8 py-9 text-white shadow-[0_22px_55px_rgba(47,91,219,0.22)] md:px-12">
              <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
                {[
                  [String(allRecommendedCourses.length || 0), "Cursos recomendados"],
                  ["3", "Certificaciones potenciales"],
                  ["~6", "Meses estimados"],
                  [String(form.topics.length || 0), "Habilidades principales"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <strong className="block !font-['Montserrat'] text-[3.4rem] font-black leading-none">
                      {value}
                    </strong>
                    <span className="mt-3 block !font-['Montserrat'] leading-[1.2em] text-[.8rem] md:text-[1rem] text-white/90">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-white/20 pt-7 text-center">
                <span className="!font-['Montserrat'] text-white/90">
                  Proveedores incluidos:
                </span>
                <span className="ml-4 inline-flex items-center gap-3 align-middle">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[13px] font-black text-[#2563EB]">
                    <img
                      className="h-6 w-6"
                      src="/assets/platforms/icons/icon-coursera.png"
                      alt=""
                    />
                  </span>
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[13px] font-black text-[#D33B3E]">
                    <img
                      className="h-6 w-6"
                      src="/assets/platforms/icons/icon-masterclass.png"
                      alt=""
                    />
                  </span>
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#003A3A] text-[11px] font-black text-white">
                    <img
                      className="h-6 w-6"
                      src="/assets/platforms/icons/icon-edx.png"
                      alt=""
                    />
                  </span>
                </span>
              </div>
            </section>

            <div className="mt-10 rounded-[26px] border border-black/10 bg-white p-5 md:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.05)] md:p-9">
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h3 className="!font-['Montserrat'] text-[1.6rem] leading-[1.2em] font-semibold text-[#111111]">
                  Tu Hoja de Ruta de Aprendizaje
                </h3>

                <span className="w-fit rounded-full bg-neutral-100 px-5 py-2 !font-['Montserrat'] text-sm text-neutral-500">
                  Tu acceso dependerá del plan seleccionado
                </span>
              </div>

              <div className="space-y-12">
                {[
                  [
                    "Nivel 1",
                    "Fundamentos",
                    "DISPONIBLE",
                    recommendedByLevel.level_1,
                  ],
                  [
                    "Nivel 2",
                    "Especialización",
                    "PLAN X / PLUS",
                    recommendedByLevel.level_2,
                  ],
                  [
                    "Nivel 3",
                    "Certificación",
                    "PLAN PLUS",
                    recommendedByLevel.level_3,
                  ],
                ].map(([level, subtitle, badge, courses], index) => (
                  <div key={level} className="grid grid-cols-[48px_1fr] gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-[#E8EEFF] font-black text-[#2563EB]">
                      ✓
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="!font-['Montserrat'] text-2xl font-black text-[#111111]">
                          {level}
                        </h4>
                        <span
                          className={`rounded-full px-3 py-1 !font-['Montserrat'] text-xs font-black ${
                            index === 0
                              ? "bg-[#5CC781]/12 text-[#5CC781]"
                              : "bg-[#2563EB]/10 text-[#2563EB]"
                          }`}
                        >
                          {badge}
                        </span>
                      </div>

                      <p className="!font-['Montserrat'] text-neutral-500">
                        {subtitle}
                      </p>

                      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
                        {courses.length > 0 ? (
                          courses.map((course) => (
                            <CourseCard
                              key={`${level}-${course.id || course.title}`}
                              course={course}
                            />
                          ))
                        ) : (
                          <p className="rounded-[16px] bg-neutral-50 p-5 !font-['Montserrat'] text-sm text-neutral-400">
                            No encontramos recomendaciones para este nivel.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <section id="plans" className="mt-16">
              <div className="text-center">
                <h3 className="!font-['Montserrat'] text-[2.7rem] font-black tracking-[-0.05em] text-[#111111] md:text-[3.2rem]">
                  ¿Cómo quieres comenzar?
                </h3>

                <p className="mt-3 !font-['Montserrat'] text-[1.1rem] text-neutral-600">
                  Elige la experiencia de aprendizaje que mejor se adapte a tus
                  objetivos.
                </p>
              </div>

              {errorMsg && (
                <div className="mx-auto mt-6 max-w-[720px] rounded-[16px] border border-red-100 bg-red-50 px-5 py-4 !font-['Montserrat'] text-sm font-semibold text-red-600">
                  {errorMsg}
                </div>
              )}

              <div className="mt-8 flex items-center justify-center gap-4 !font-['Montserrat']">
                <span
                  className={
                    !isAnnual
                      ? "font-black text-[#111111]"
                      : "font-semibold text-neutral-500"
                  }
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
                  className={`relative h-10 w-[72px] rounded-full p-1 transition ${
                    isAnnual ? "bg-[#1941cf]" : "bg-neutral-300"
                  }`}
                >
                  <span
                    className={`block h-8 w-8 rounded-full bg-white shadow transition ${
                      isAnnual ? "translate-x-8" : "translate-x-0"
                    }`}
                  />
                </button>

                <span
                  className={
                    isAnnual
                      ? "font-black text-[#111111]"
                      : "font-semibold text-neutral-500"
                  }
                >
                  Anual
                </span>

                <span className="rounded-full bg-[#5CC781] px-3 py-1 text-xs font-black text-white">
                  Ahorra 14%
                </span>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-3 lg:grid-cols-3">
                <button
                  type="button"
                  onClick={() => {
                    trackClientifyPlanInterest("free");
                    setSelectedPlan("free");
                    setStep("createPassword");
                  }}
                  className="flex min-h-[420px] mt-4 mb-4 flex-col rounded-[24px] border border-black/10 bg-white px-5 py-8 text-left shadow-[0_16px_45px_rgba(0,0,0,0.05)] transition hover:-translate-y-1"
                >
                  <span className="!font-['Montserrat'] text-sm font-black uppercase text-[#5CC781]">
                    Comenzar gratis
                  </span>
                  <h4 className="mt-0 !font-['Montserrat'] text-[1.8rem] font-black text-[#111111]">
                    Top Education Free
                  </h4>
                  <div className="mt-2 !font-['Montserrat'] text-[3.2rem] font-black leading-none text-[#111111]">
                    $0
                  </div>
                  <p className="mt-3 !font-['Montserrat'] text-neutral-600">
                    Explora la plataforma y descubre tu potencial.
                  </p>

                  <span className="mt-5 !font-['Montserrat'] font-black uppercase text-[#111111]">
                    Incluye:
                  </span>
                  <ul className="mt-2 space-y-3 !font-['Montserrat'] text-neutral-700">
                    <li className="text-[#5CC781]">
                      ✓{" "}
                      <span className="text-neutral-700">
                        Acceso al Nivel 1 de tu ruta
                      </span>
                    </li>
                    <li className="text-[#5CC781]">
                      ✓{" "}
                      <span className="text-neutral-700">
                        3 cursos seleccionados por Top Education
                      </span>
                    </li>
                    <li className="text-[#5CC781]">
                      ✓{" "}
                      <span className="text-neutral-700">
                        Dashboard de aprendizaje
                      </span>
                    </li>
                    <li>✓ Análisis de tu CV cotejado con tu ruta</li>
                    <li className="text-[#5CC781]">
                      ✓{" "}
                      <span className="text-neutral-700">
                        Recomendaciones básicas
                      </span>
                    </li>
                    <li className="text-neutral-300">
                      × <span className="text-neutral-400">Certificaciones</span>
                    </li>
                    <li className="text-neutral-300">
                      ×{" "}
                      <span className="text-neutral-400">
                        Acceso completo a la ruta
                      </span>
                    </li>
                    <li className="text-neutral-300">
                      ×{" "}
                      <span className="text-neutral-400">
                        Seguimiento avanzado
                      </span>
                    </li>
                    <li className="text-neutral-300">
                      × <span className="text-neutral-400">IA personalizada</span>
                    </li>
                  </ul>

                  <div className="mt-auto rounded-[16px] border border-black/10 bg-[#F6F4EF] px-6 py-4 text-center !font-['Montserrat'] font-bold text-[#111111]">
                    Comenzar Gratis
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const plan = isAnnual ? "yearly_x" : "monthly_x";
                    setSelectedPlan("x");
                    setSelectedPaidPlan(plan);
                    trackClientifyPlanInterest(plan);
                    setStep("proPayment");
                  }}
                  disabled={loading}
                  className="relative flex min-h-[560px] flex-col rounded-[24px] bg-[#1941cf] px-5 py-8 text-left text-white shadow-[0_26px_70px_rgba(47,91,219,0.28)] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="absolute left-1/2 top-[-18px] -translate-x-1/2 rounded-full bg-[#FDBA3B] px-5 py-2 !font-['Montserrat'] text-sm font-black text-white shadow-[0_14px_35px_rgba(253,186,59,0.28)]">
                    ⭐ MÁS POPULAR
                  </span>

                  <h4 className="mt-6 !font-['Montserrat'] text-[2rem] font-black">
                    Top Education X
                  </h4>
                  <div className="mt-2 !font-['Montserrat'] text-[3.2rem] font-black leading-none">
                    {planXPrice}{" "}
                    <span className="text-lg font-medium text-white/75">
                      USD / mes
                    </span>
                  </div>
                  <p className="mt-2 !font-['Montserrat'] text-white/70">
                    {planXSubcopy}
                  </p>
                  <p className="mt-4 !font-['Montserrat'] text-lg font-semibold leading-[1.45em] text-white">
                    La mejor combinación para acelerar tu crecimiento
                    profesional.
                  </p>

                  <span className="mt-5 !font-['Montserrat'] font-black uppercase">
                    Incluye:
                  </span>
                  <ul className="my-2 space-y-2 !font-['Montserrat'] text-white">
                    <li>✓ Coursera + MasterClass</li>
                    <li>✓ Certificaciones disponibles en tus 3 cursos</li>
                    <li>✓ Acceso a toda tu ruta personalizada</li>
                    <li>✓ IA Topo: recomendaciones inteligentes</li>
                    <li>✓ Acceso a toda tu ruta personalizada</li>
                    <li>✓ Certificaciones disponibles</li>
                    <li>✓ Seguimiento de progreso</li>
                    <li>✓ Recomendaciones inteligentes</li>
                    <li>✓ Nuevas rutas personalizadas</li>
                    <li>✓ Actualización continua de habilidades</li>
                    <li>✓ Prueba gratuita de 7 días</li>
                  </ul>

                  <div className="mt-auto rounded-[16px] bg-white px-6 py-4 text-center !font-['Montserrat'] font-black text-[#1941cf]">
                    Comenzar prueba gratuita →
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const plan = isAnnual ? "yearly_plus" : "monthly_plus";
                    setSelectedPlan("plus");
                    setSelectedPaidPlan(plan);
                    trackClientifyPlanInterest(plan);
                    setStep("proPayment");
                  }}
                  disabled={loading}
                  className="flex min-h-[420px] my-4 flex-col rounded-[24px] border border-black/10 bg-white p-7 text-left shadow-[0_16px_45px_rgba(0,0,0,0.05)] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <h4 className="mt-3 !font-['Montserrat'] text-[1.8rem] font-black text-[#111111]">
                    Top Education Plus
                  </h4>
                  <div className="mt-2 !font-['Montserrat'] text-[3.2rem] font-black leading-none text-[#111111]">
                    {planPlusPrice}{" "}
                    <span className="text-lg font-medium text-neutral-500">
                      USD / mes
                    </span>
                  </div>
                  <p className="mt-2 !font-['Montserrat'] text-neutral-500">
                    {planPlusSubcopy}
                  </p>
                  <p className="mt-4 !font-['Montserrat'] leading-[1.55em] text-neutral-600">
                    La experiencia completa para quienes buscan maximizar su
                    aprendizaje.
                  </p>

                  <span className="mt-5 !font-['Montserrat'] font-black uppercase text-[#111111]">
                    Incluye:
                  </span>
                  <ul className="my-2 space-y-2 !font-['Montserrat'] text-neutral-700">
                    <li className="text-[#2563EB]">
                      ✓ <span className="text-neutral-700">Coursera</span>
                    </li>
                    <li className="text-[#2563EB]">
                      ✓ <span className="text-neutral-700">edX</span>
                    </li>
                    <li className="text-[#2563EB]">
                      ✓ <span className="text-neutral-700">MasterClass</span>
                    </li>
                    <li className="text-[#2563EB]">
                      ✓{" "}
                      <span className="text-neutral-700">
                        Todas las certificaciones disponibles
                      </span>
                    </li>
                    <li className="text-[#2563EB]">
                      ✓ <span className="text-neutral-700">Ruta completa</span>
                    </li>
                    <li className="text-[#2563EB]">
                      ✓ <span className="text-neutral-700">IA avanzada</span>
                    </li>
                    <li className="text-[#2563EB]">
                      ✓{" "}
                      <span className="text-neutral-700">
                        Recomendaciones premium
                      </span>
                    </li>
                    <li className="text-[#2563EB]">
                      ✓{" "}
                      <span className="text-neutral-700">
                        Acceso prioritario a nuevas experiencias
                      </span>
                    </li>
                    <li className="text-[#2563EB]">
                      ✓{" "}
                      <span className="text-neutral-700">
                        Prueba gratuita de 7 días
                      </span>
                    </li>
                  </ul>

                  <div className="mt-auto rounded-[16px] bg-[#1941cf] px-6 py-4 text-center !font-['Montserrat'] font-black text-white">
                    Comenzar prueba gratuita →
                  </div>
                </button>
              </div>
            </section>

            <section className="mt-16 rounded-[28px] border border-black/10 bg-white p-7 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-10">
              <h3 className="text-center !font-['Montserrat'] text-2xl font-black text-[#111111]">
                Comparativa rápida
              </h3>

              <div className="mt-8 overflow-x-auto">
                <table className="min-w-full !font-['Montserrat'] text-left text-[15px]">
                  <thead>
                    <tr className="border-b border-black/10 text-neutral-600">
                      <th className="px-5 py-4">Característica</th>
                      <th className="px-5 py-4 text-center">Free</th>
                      <th className="bg-[#F4F6FB] px-5 py-4 text-center text-[#2563EB]">
                        X
                      </th>
                      <th className="px-5 py-4 text-center">Plus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Cursos recomendados", "✓", "✓", "✓"],
                      ["Ruta completa", "×", "✓", "✓"],
                      ["MasterClass", "×", "✓", "✓"],
                      ["Coursera", "×", "Opcional", "✓"],
                      ["edX", "×", "×", "✓"],
                      ["Certificaciones", "×", "✓", "✓"],
                      ["IA Top Education", "Básica", "Completa", "Premium"],
                    ].map(([feature, free, x, plus]) => (
                      <tr key={feature} className="border-b border-black/5">
                        <td className="px-5 py-4 text-[#111111]">{feature}</td>
                        <td
                          className={`px-5 py-4 text-center ${
                            free === "✓"
                              ? "text-[#5CC781]"
                              : free === "×"
                              ? "text-neutral-300"
                              : "text-neutral-500"
                          }`}
                        >
                          {free}
                        </td>
                        <td className="bg-[#F4F6FB] px-5 py-4 text-center font-bold text-[#2563EB]">
                          {x}
                        </td>
                        <td
                          className={`px-5 py-4 text-center ${
                            plus === "✓"
                              ? "text-[#2563EB]"
                              : "text-neutral-500"
                          }`}
                        >
                          {plus}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="mt-12 text-center">
              <h3 className="!font-['Montserrat'] text-xl font-black text-[#111111]">
                Más de 24,500 certificaciones emitidas a través de nuestros
                proveedores educativos.
              </h3>
              <p className="mt-3 !font-['Montserrat'] text-neutral-500">
                Comienza gratis o desbloquea toda tu ruta personalizada hoy.
              </p>
            </div>
          </section>
        )}

        {step === "freeSignup" && (
          <section className="mx-auto flex min-h-screen max-w-[590px] flex-col items-center justify-center px-5 py-16 md:py-24">
            <div className="grid h-16 w-16 place-items-center rounded-[18px] bg-[#5CC781]/10 text-3xl text-[#5CC781]">
              ♙
            </div>

            <span className="mt-6 !font-['Montserrat'] font-semibold uppercase text-[#5CC781]">
              Plan explorador
            </span>

            <h2 className="mt-2 text-center !font-['Montserrat'] text-3xl font-semibold text-[#111111]">
              Crea tu cuenta gratis
            </h2>

            <p className="mt-2 text-center !font-['Montserrat'] text-neutral-600">
              Accede a cursos seleccionados y explora todo el catálogo sin
              costo.
            </p>

            <div className="mt-4 w-full rounded-[20px] border border-[#5CC781]/30 bg-[#5CC781]/10 p-4">
              <h3 className="!font-['Montserrat'] font-semibold text-[#111111]">
                Tu plan incluye:
              </h3>

              <ul className="mt-1 flex flex-wrap space-y-1 !font-['Montserrat'] text-[14px] text-neutral-700">
                <li className="w-[50%]">✓ Cursos seleccionados gratis</li>
                <li className="w-[50%]">✓ Explorar todas las categorías</li>
                <li className="w-[50%]">✓ Perfil de aprendizaje básico</li>
                <li className="w-[50%]">✓ Recomendaciones iniciales</li>
              </ul>
            </div>

            <div className="mt-8 w-full space-y-3">
              <FormInput
                label="Correo Electrónico"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Correo electrónico"
              />

              <FormInput
                label="Contraseña"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="Crea una contraseña segura"
                type={showPass ? "text" : "password"}
                rightAction={
                  <button
                    type="button"
                    onClick={() => setShowPass((prev) => !prev)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 !font-['Montserrat'] text-sm font-semibold text-neutral-400 hover:text-[#2563EB]"
                  >
                    {showPass ? "Ocultar" : "Ver"}
                  </button>
                }
              />

              <FormInput
                label="Confirmar Contraseña"
                value={form.confirm_password}
                onChange={(e) =>
                  setForm({ ...form, confirm_password: e.target.value })
                }
                placeholder="Confirma tu contraseña"
                type={showPass2 ? "text" : "password"}
                rightAction={
                  <button
                    type="button"
                    onClick={() => setShowPass2((prev) => !prev)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 !font-['Montserrat'] text-sm font-semibold text-neutral-400 hover:text-[#2563EB]"
                  >
                    {showPass2 ? "Ocultar" : "Ver"}
                  </button>
                }
              />
            </div>

            {errorMsg && (
              <div className="mt-6 w-full rounded-[16px] border border-red-100 bg-red-50 px-5 py-4 !font-['Montserrat'] text-sm font-semibold text-red-600">
                {errorMsg}
              </div>
            )}

            <button
              type="button"
              onClick={startFreeSignup}
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-[18px] bg-[#2563EB] px-4 py-2 md:px-8 md:py-5 !font-['Montserrat'] text-lg font-semibold text-white shadow-[0_22px_50px_rgba(25,65,207,0.25)] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta gratis"}{" "}
              <ArrowIcon />
            </button>

            <button
              type="button"
              onClick={() => setStep("ready")}
              className="mt-5 !font-['Montserrat'] text-sm font-medium text-neutral-500 hover:text-[#111111]"
            >
              Volver a planes
            </button>
          </section>
        )}

        {step === "proSignup" && (
          <section className="mx-auto flex min-h-screen max-w-[620px] flex-col items-center justify-center px-5 py-16 md:py-24">
            <div className="grid h-16 w-16 place-items-center rounded-[18px] bg-[#2563EB]/10 text-3xl text-[#2563EB]">
              ✦
            </div>

            <span className="mt-6 !font-['Montserrat'] font-semibold uppercase text-[#2563EB]">
              {activePlanName}
            </span>

            <h2 className="mt-2 text-center !font-['Montserrat'] text-3xl font-semibold text-[#111111]">
              Crea tu cuenta para iniciar tu prueba
            </h2>

            <p className="mt-2 text-center !font-['Montserrat'] text-neutral-600">
              Guardaremos tu ruta y luego podrás agregar tu tarjeta para activar
              los 7 días gratis.
            </p>

            <div className="mt-6 w-full rounded-[20px] border border-[#2563EB]/20 bg-white p-5 shadow-[0_16px_45px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="!font-['Montserrat'] text-sm text-neutral-500">
                    Cuenta
                  </p>
                  <p className="!font-['Montserrat'] text-lg font-semibold text-[#111111]">
                    {form.email}
                  </p>
                </div>

                <span className="rounded-full bg-[#2563EB]/10 px-4 py-2 !font-['Montserrat'] text-sm font-semibold text-[#2563EB]">
                  7 días gratis
                </span>
              </div>
            </div>

            <div className="mt-8 w-full space-y-3">
              <FormInput
                label="Correo Electrónico"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Correo electrónico"
                readOnly
              />

              <FormInput
                label="Contraseña"
                value={form.pro_password}
                onChange={(e) =>
                  setForm({ ...form, pro_password: e.target.value })
                }
                placeholder="Crea una contraseña segura"
                type={showProPass ? "text" : "password"}
                rightAction={
                  <button
                    type="button"
                    onClick={() => setShowProPass((prev) => !prev)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 !font-['Montserrat'] text-sm font-semibold text-neutral-400 hover:text-[#2563EB]"
                  >
                    {showProPass ? "Ocultar" : "Ver"}
                  </button>
                }
              />

              <FormInput
                label="Confirmar Contraseña"
                value={form.pro_confirm_password}
                onChange={(e) =>
                  setForm({ ...form, pro_confirm_password: e.target.value })
                }
                placeholder="Confirma tu contraseña"
                type={showProPass2 ? "text" : "password"}
                rightAction={
                  <button
                    type="button"
                    onClick={() => setShowProPass2((prev) => !prev)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 !font-['Montserrat'] text-sm font-semibold text-neutral-400 hover:text-[#2563EB]"
                  >
                    {showProPass2 ? "Ocultar" : "Ver"}
                  </button>
                }
              />
            </div>

            {errorMsg && (
              <div className="mt-6 w-full rounded-[16px] border border-red-100 bg-red-50 px-5 py-4 !font-['Montserrat'] text-sm font-semibold text-red-600">
                {errorMsg}
              </div>
            )}

            <button
              type="button"
              onClick={startProSignup}
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-[18px] bg-[#2563EB] px-4 py-2 md:px-8 md:py-5 !font-['Montserrat'] text-lg font-semibold text-white shadow-[0_22px_50px_rgba(25,65,207,0.25)] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creando cuenta..." : "Continuar a pago seguro"}{" "}
              <ArrowIcon />
            </button>

            <button
              type="button"
              onClick={() => setStep("ready")}
              className="mt-5 !font-['Montserrat'] text-sm font-medium text-neutral-500 hover:text-[#111111]"
            >
              Volver a planes
            </button>
          </section>
        )}

        {step === "proPayment" && (
          <section className="mx-auto flex min-h-screen max-w-[820px] flex-col items-center px-5 py-16 md:py-24">
            <div className="grid h-16 w-16 place-items-center rounded-[18px] bg-[#2563EB]/10 text-3xl text-[#2563EB]">
              ▬
            </div>

            <span className="mt-6 !font-['Montserrat'] font-black uppercase tracking-[0.12em] text-[#1941cf]">
              Empieza tu prueba gratis
            </span>

            <h2 className="mt-2 text-center !font-['Montserrat'] text-[2rem] font-black text-[#111111]">
              Completa tu suscripción
            </h2>

            <p className="mt-3 max-w-[650px] text-center !font-['Montserrat'] text-[1.1rem] leading-[1.45em] text-neutral-600">
              {activePlanDescription}
            </p>

            <div className="mt-10 w-full rounded-[22px] bg-[#1941cf] p-6 text-white shadow-[0_22px_60px_rgba(37,58,207,0.22)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="!font-['Montserrat'] text-[15px] font-semibold text-white/90">
                    {activePlanName}
                  </p>

                  <div className="mt-2 flex items-end gap-2">
                    <span className="!font-['Montserrat'] text-[2.4rem] font-black leading-none">
                      {activePlanPrice}
                    </span>

                    <span className="mb-1 !font-['Montserrat'] text-lg text-white/75">
                      /{activePlanInterval}
                    </span>
                  </div>
                </div>

                <span className="mt-4 rounded-full bg-[#6EC982] px-5 py-2 !font-['Montserrat'] text-sm font-black text-white">
                  7 días gratis
                </span>
              </div>

              <div className="mt-6 border-t border-white/20 pt-5">
                <p className="!font-['Montserrat'] text-sm text-white/90">
                  <strong>Hoy:</strong> $0.00 ·{" "}
                  <strong>{trialEndDate}:</strong>{" "}
                  {activePlanPrice.replace("$", "$")}
                  {activePlanInterval === "año" ? " anual" : ".00"}
                </p>
              </div>
            </div>

            <div className="mt-8 w-full rounded-[24px] bg-white p-7 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
              <div className="space-y-5">
                <FormInput
                  label="Correo electrónico"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="correo@ejemplo.com"
                  readOnly
                />

                <label className="block !font-['Montserrat'] text-[16px] font-semibold text-[#111111]">
                  Número de tarjeta

                  <div className="mt-2 rounded-[18px] border border-black/10 bg-white px-5 py-4 transition-all focus-within:border-[#1941cf] focus-within:ring-4 focus-within:ring-[#1941cf]/15">
                    <CardElement
                      options={cardElementOptions}
                      onChange={(event) => {
                        setCardComplete(event.complete);

                        if (event.error) {
                          setErrorMsg(event.error.message);
                        } else {
                          setErrorMsg("");
                        }
                      }}
                    />
                  </div>
                </label>

                <FormInput
                  label="Nombre del titular"
                  value={`${form.first_name} ${form.last_name}`.trim()}
                  onChange={() => {}}
                  placeholder="Como aparece en la tarjeta"
                  readOnly
                />

                <FormSelect
                  label="País"
                  value={form.country || "Colombia"}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  placeholder="Selecciona tu país"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </FormSelect>
              </div>

              {errorMsg && (
                <div className="mt-6 rounded-[16px] border border-red-100 bg-red-50 px-5 py-4 !font-['Montserrat'] text-sm font-semibold text-red-600">
                  {errorMsg}
                </div>
              )}

              <button
                type="button"
                onClick={startProSubscription}
                disabled={loading || !stripe}
                className="mt-7 flex w-full items-center justify-center gap-3 rounded-[18px] bg-[#1941cf] px-4 py-2 md:px-8 md:py-5 !font-['Montserrat'] text-lg font-black text-white shadow-[0_22px_50px_rgba(37,58,207,0.25)] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Activando prueba..." : "Comenzar prueba gratis"}{" "}
                <ArrowIcon />
              </button>

              <p className="mt-7 text-center !font-['Montserrat'] text-sm leading-[1.45em] text-neutral-400">
                Al continuar, aceptas los términos de servicio y la política de
                privacidad. Tu suscripción se renovará automáticamente después
                del período de prueba.
              </p>
            </div>

            <div className="mt-7 flex items-center justify-center gap-8 !font-['Montserrat'] text-sm text-neutral-500">
              <span>▢ Pago seguro</span>
              <span>✓ Cancela cuando quieras</span>
            </div>

            <button
              type="button"
              onClick={() => setStep("ready")}
              className="mt-6 !font-['Montserrat'] text-sm font-medium text-neutral-500 hover:text-[#111111]"
            >
              Volver
            </button>
          </section>
        )}

        {step === "subscriptionSuccess" && (
          <section className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-5 backdrop-blur-sm">
            <div className="w-full max-w-[740px] mt-15 rounded-[34px] bg-white p-4 text-center shadow-[0_25px_80px_rgba(0,0,0,0.25)] md:p-10">
              <div className="mx-auto grid h-18 w-18 place-items-center rounded-full bg-[#1941cf] text-white">
                <CheckIcon />
              </div>

              <h2 className="mt-5 !font-['Montserrat'] text-[1.5rem] font-black tracking-[-0.04em] text-[#111111]">
                ¡Bienvenido a {activePlanName}!
              </h2>

              <p className="mt-0 !font-['Montserrat'] text-md text-neutral-500">
                Tu suscripción ha sido activada exitosamente.
              </p>

              <div className="mt-5 rounded-[22px] bg-[#E9ECFF] p-4 text-left">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="!font-['Montserrat'] text-xl font-black text-[#111111]">
                    Período de prueba
                  </h3>
                  <span className="rounded-full bg-[#6EC982] px-4 py-2 !font-['Montserrat'] text-xs font-black uppercase text-white">
                    7 días gratis
                  </span>
                </div>

                <p className="mt-2 !font-['Montserrat'] text-sm leading-[1.5em] text-neutral-600">
                  Tienes <strong>7 días</strong> para explorar todas las
                  funciones premium sin costo. El primer cobro se realizará el{" "}
                  <strong>{trialEndDate}</strong>.
                </p>

                <div className="mt-3 border-t border-black/10 pt-3">
                  <ul className="space-y-2 !font-['Montserrat'] text-[xs] text-[#111111]">
                    <li className="text-[#6EC982]">
                      ✓{" "}
                      <span className="text-[#111111]">
                        Acceso a MasterClass y Coursera
                      </span>
                    </li>
                    <li className="text-[#6EC982]">
                      ✓{" "}
                      <span className="text-[#111111]">
                        9,000+ cursos disponibles
                      </span>
                    </li>
                    <li className="text-[#6EC982]">
                      ✓{" "}
                      <span className="text-[#111111]">Ruta personalizada</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-3 rounded-[18px] border border-[#FDBA3B]/25 bg-[#FFF8EA] p-4 text-left">
                <h3 className="!font-['Montserrat'] text-md font-black text-[#111111]">
                  Siguiente paso
                </h3>
                <p className="mt-0 !font-['Montserrat'] text-[14px] text-neutral-500">
                  Crea una contraseña segura para proteger tu cuenta y comenzar
                  tu aprendizaje.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep("createPassword")}
                className="mt-3 flex w-full items-center justify-center gap-3 rounded-[18px] bg-[#1941cf] px-5 py-3 !font-['Montserrat'] text-lg font-black text-white shadow-[0_20px_45px_rgba(37,58,207,0.25)]"
              >
                Crear contraseña <ArrowIcon />
              </button>
            </div>
          </section>
        )}

        {step === "createPassword" && (
          <section className="mx-auto flex min-h-screen max-w-[620px] flex-col items-center justify-center px-5 py-16 md:py-24">
            <div className="grid h-16 w-16 place-items-center rounded-[18px] bg-[#5CC781]/10 text-[#5CC781]">
              <LockIcon />
            </div>
            <span className="mt-3 !font-['Montserrat'] font-black uppercase tracking-[0.12em] text-[#5CC781]">
              Acceso verificado
            </span>
            <h2 className="mt-1 text-center !font-['Montserrat'] text-3xl font-black text-[#111111]">
              Crea tu contraseña
            </h2>
            <p className="mt-0 max-w-[720px] text-center !font-['Montserrat'] text-lg text-neutral-600">
              Por seguridad, crea una contraseña personal antes de continuar.
            </p>

            <div className="mt-5 w-full rounded-[24px] bg-white p-7 shadow-[0_18px_55px_rgba(0,0,0,0.06)]">
              <FormInput
                label="Nueva contraseña"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="Crea una contraseña segura"
                type={showPass ? "text" : "password"}
                rightAction={
                  <button
                    type="button"
                    onClick={() => setShowPass((prev) => !prev)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 !font-['Montserrat'] text-sm font-semibold text-neutral-400 hover:text-[#2563EB]"
                  >
                    {showPass ? "Ocultar" : "Ver"}
                  </button>
                }
              />

              <PasswordStrength password={form.password} />

              <div className="mt-3">
                <FormInput
                  label="Confirmar contraseña"
                  value={form.confirm_password}
                  onChange={(e) =>
                    setForm({ ...form, confirm_password: e.target.value })
                  }
                  placeholder="Confirma tu contraseña"
                  type={showPass2 ? "text" : "password"}
                  rightAction={
                    <button
                      type="button"
                      onClick={() => setShowPass2((prev) => !prev)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 !font-['Montserrat'] text-sm font-semibold text-neutral-400 hover:text-[#2563EB]"
                    >
                      {showPass2 ? "Ocultar" : "Ver"}
                    </button>
                  }
                />
                <PasswordMatchMessage
                  password={form.password}
                  confirmPassword={form.confirm_password}
                />
              </div>

              {errorMsg && (
                <div className="mt-6 rounded-[16px] border border-red-100 bg-red-50 px-5 py-4 !font-['Montserrat'] text-sm font-semibold text-red-600">
                  {errorMsg}
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  completeSignup({
                    plan:
                      selectedPlan === "free"
                        ? "free"
                        : getFinalPlanFromPaidPlan(selectedPaidPlan),
                    redirectTo:
                      selectedPlan === "free"
                        ? "/account?tab=cv"
                        : "/account?tab=license",
                  })
                }
                disabled={
                  loading ||
                  getPasswordScore(form.password) < 4 ||
                  form.password !== form.confirm_password
                }
                className="mt-3 flex w-full items-center justify-center gap-3 rounded-[18px] bg-[#1941cf] px-5 py-3 !font-['Montserrat'] text-lg font-black text-white shadow-[0_22px_50px_rgba(37,58,207,0.25)] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creando cuenta..." : "Guardar y entrar"}{" "}
                <ArrowIcon />
              </button>

              <p className="mt-3 text-center !font-['Montserrat'] text-sm text-neutral-300">
                Tu contraseña se cifra de forma segura. Nunca la compartiremos.
              </p>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default function StartNow() {
  const stripePromise = useMemo(() => {
    const key = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

    if (!key) {
      console.warn("Falta REACT_APP_STRIPE_PUBLISHABLE_KEY");
      return null;
    }

    return loadStripe(key);
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <StartNowContent />
    </Elements>
  );
}