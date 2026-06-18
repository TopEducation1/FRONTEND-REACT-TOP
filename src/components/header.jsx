import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuTop from "./MenuTop";
import { FaChevronLeft } from "react-icons/fa6";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";

const API = (process.env.REACT_APP_API_URL || "http://localhost:8000").replace(/\/+$/, "");

const Header = ({
  toggleMenu,
  onTagSelect,
  openIndexResponsiveMenu,
  isMenuOpen,
  hideMenuTop = false,
}) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(false);

  const navigateWithTransition = (url) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(url));
    } else {
      navigate(url);
    }
  };

  const handleAtras = () => {
    navigateWithTransition(-1);
  };

  useEffect(() => {
    let mounted = true;

    fetch(`${API}/api/account/me/`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then(async (res) => {
        if (res.status === 401) return null;

        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) return null;
        if (!res.ok) return null;

        return res.json();
      })
      .then((data) => {
        if (!mounted) return;

        if (data?.ok && data?.data) {
          setUser(data.data);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => mounted && setLoadingAuth(false));

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await fetch(`${API}/api/auth/logout/`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      setUser(null);
      setOpenDropdown(false);
      navigateWithTransition("/login");
    }
  };

  return (
    <header>
      <nav
        className="
          top-4
          nav-main relative m-auto w-[90vw] md:w-[75vw]
          rounded-[36px] bg-[#1c1c1c] px-4 py-2 backdrop-blur-md
          md:flex md:items-center md:justify-between md:px-6 md:py-0 lg:px-8

          max-md:fixed max-md:left-1/2 max-md:top-2 max-md:z-[9999]
          max-md:flex max-md:h-11 max-md:w-[calc(100vw-24px)]
          max-md:-translate-x-1/2 max-md:items-center max-md:justify-between
          max-md:rounded-full max-md:bg-[#1f1b1d] max-md:px-3 max-md:py-0
          max-md:shadow-[0_8px_24px_rgba(0,0,0,0.35)]
        "
      >
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {!hideMenuTop && (
              <button
                className="
                  !h-9 !w-9 btn-atras bg-[#F5F3EE]/10 hover:bg-[#F5F3EE]/30
                  flex justify-center items-center rounded-full text-[#F6F4EF]
                  -ml-2 md:-ml-5 -mr-1 md:-mr-0
                  max-md:hidden
                "
                onClick={handleAtras}
                title="Volver atrás"
              >
                <FaChevronLeft className="text-[1.2rem]" />
              </button>
            )}
            <button onClick={() => navigateWithTransition("/inicio")} className="!z-[999]">
              <img
                src="/assets/logos/TOPEDUCATIONLOGONAV.png"
                alt="Logo Top.education"
                className="
                  w-[200px]
                  h-auto
                  !z-[999]
                  object-contain
                  md:w-[210px]
                  lg:w-[230px]
                  max-md:w-[128px]
                "
              />
            </button>
          </div>

          {hideMenuTop && (
            <button
              className="
                flex h-10 w-10 items-center justify-center rounded-full
                bg-[#F5F3EE]/10 text-[#F6F4EF] -mr-4
                transition hover:bg-[#F5F3EE]/25
              "
              onClick={handleAtras}
              title="Volver atrás"
            >
              <FaChevronLeft className="text-[1.2rem]" />
            </button>
          )}

          
        </div>

        {!hideMenuTop && (
          <button
            type="button"
            className={`
              container-burguer-button
              max-md:z-[10002] max-md:flex max-md:h-9 max-md:w-9
              max-md:cursor-pointer max-md:items-center max-md:justify-center
              max-md:rounded-full max-md:bg-white/10
              max-md:transition-opacity max-md:duration-200
              ${
                isMenuOpen
                  ? "max-md:opacity-0 max-md:pointer-events-none"
                  : "max-md:opacity-100"
              }
            `}
            onClick={toggleMenu}
            aria-label="Abrir menú"
          >
            <span
              className="
                burguer-bar
                max-md:relative max-md:block max-md:h-[2px] max-md:w-4
                max-md:rounded-full max-md:bg-[#F6F4EF]
                max-md:before:absolute max-md:before:left-0 max-md:before:block
                max-md:before:h-[2px] max-md:before:w-4 max-md:before:-translate-y-[6px]
                max-md:before:rounded-full max-md:before:bg-[#F6F4EF] max-md:before:content-['']
                max-md:after:absolute max-md:after:left-0 max-md:after:block
                max-md:after:h-[2px] max-md:after:w-4 max-md:after:translate-y-[6px]
                max-md:after:rounded-full max-md:after:bg-[#F6F4EF] max-md:after:content-['']
              "
            />
          </button>
        )}

        {!hideMenuTop && (
          <>
            <div
              onClick={toggleMenu}
              className={`
                md:hidden max-md:fixed max-md:inset-0 max-md:z-[10000]
                max-md:bg-black/60 max-md:backdrop-blur-md rounded-full
                max-md:transition-opacity max-md:duration-300
                ${
                  isMenuOpen
                    ? "max-md:opacity-100 max-md:pointer-events-auto"
                    : "max-md:opacity-0 max-md:pointer-events-none"
                }
              `}
            />

            <div
              className={`
                navigation-menu
                min-w-[70%]
                justify-end
                max-md:fixed max-md:top-[-8px] max-md:right-[-12px] max-md:z-[10001]
                max-md:flex max-md:h-[100vh]
                max-md:w-[calc(100vw-48px)]
                max-md:max-w-[560px]
                max-md:flex-col max-md:overflow-hidden
                max-md:border max-md:border-white/10 max-md:bg-[#090306]
                max-md:shadow-[-20px_0_50px_rgba(0,0,0,0.45)]
                max-md:transition-transform max-md:duration-300 max-md:ease-out

                md:flex md:items-center md:gap-4

                ${
                  isMenuOpen
                    ? "max-md:translate-x-0"
                    : "max-md:translate-x-[calc(100%+40px)]"
                }
              `}
            >
              <div className="hidden h-[70px] items-center justify-between border-b border-white/10 px-[18px] max-md:flex">
                <img
                  src="/assets/logos/TOPEDUCATIONLOGONAV.png"
                  alt="Top.education"
                  className="w-[132px]"
                />

                <button
                  type="button"
                  onClick={toggleMenu}
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/15 text-[22px] leading-none text-[#F6F4EF]"
                  aria-label="Cerrar menú"
                >
                  ×
                </button>
              </div>

              <div className="max-md:flex max-md:flex-1 max-md:flex-col max-md:px-3 max-md:pt-3 md:flex md:items-center md:gap-4">
                <MenuTop toggleMenu={toggleMenu} />

                <div className="mx-1 my-5 hidden h-px bg-white/10 max-md:block" />

                <div
                  className="relative flex items-center gap-0 max-md:w-full"
                  ref={dropdownRef}
                >
                  {!loadingAuth && !user && (
                    <button
                      onClick={() => {
                        toggleMenu?.();
                        navigateWithTransition("/login");
                      }}
                      className="
                        -mr-2 mt-3 lg:mt-0 bg-[#F6F4EF] !text-[#1c1c1c]
                        z-[11] !py-1.5 !px-5 !rounded-full

                        max-md:m-0 max-md:h-11 max-md:w-full max-md:bg-white
                        max-md:!py-0 max-md:!px-4 max-md:text-center
                        max-md:font-bold max-md:!text-[#1c1c1c]
                      "
                    >
                      Iniciar sesión
                    </button>
                  )}

                  {!loadingAuth && user && (
                    <button
                      onClick={() => setOpenDropdown((v) => !v)}
                      className="
                        flex items-center gap-2 px-3 py-2 rounded-full border border-slate-600
                        text-slate-100 hover:bg-slate-800 -mr-4

                        max-md:mr-0 max-md:w-full max-md:justify-center
                      "
                    >
                      <FaUserCircle className="text-xl" />
                      <span className="hidden sm:block text-sm max-w-[120px] truncate max-md:block max-md:max-w-[180px]">
                        {user.full_name || user.email}
                      </span>
                      <FaChevronDown className="text-xs opacity-70" />
                    </button>
                  )}

                  {openDropdown && user && (
                    <div className="absolute right-0 top-[120%] w-48 rounded-xl border border-slate-700 bg-neutral-900 shadow-xl z-50 overflow-hidden max-md:left-0 max-md:right-auto max-md:w-full">
                      <button
                        onClick={() => {
                          setOpenDropdown(false);
                          toggleMenu?.();
                          navigateWithTransition("/account");
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-slate-200 hover:bg-slate-800"
                      >
                        Mi cuenta
                      </button>

                      <div className="h-px bg-slate-700" />

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-300 hover:bg-red-500/10"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="hidden border-t border-white/10 px-4 py-5 text-center text-[10px] text-[#F6F4EF]/50 max-md:block">
                Conecta los puntos, forma tu historia
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;