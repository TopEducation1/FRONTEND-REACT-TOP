import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuTop from "./MenuTop";
import { FaAnglesLeft } from "react-icons/fa6";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";

const API = (process.env.REACT_APP_API_URL || "http://localhost:8000").replace(/\/+$/, "");

const Header = ({ toggleMenu,onTagSelect, openIndexResponsiveMenu, isMenuOpen }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(false);

  // ✅ navegación con transición
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

  /* ===========================
     AUTH CHECK
  =========================== */
  useEffect(() => {
    let mounted = true;

    fetch(`${API}/api/account/me/`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then(async (res) => {
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) return null;
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

  /* ===========================
     CLOSE DROPDOWN ON OUTSIDE
  =========================== */
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ===========================
     LOGOUT
  =========================== */
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
      <nav className="nav-main relative m-auto w-[90vw] md:w-[64vw] rounded-[36px] bg-[#1c1c1c] px-4 py-2 backdrop-blur-md md:flex md:items-center md:justify-between md:px-6 md:py-0 lg:px-8">

        {/* LOGO + BACK */}
        <div className="wrapper-logo-nav flex items-center gap-2">
          <button
            className="btn-atras text-[#F6F4EF]"
            onClick={handleAtras}
            title="Volver atrás"
          >
            <FaAnglesLeft className="text-[2.3rem]" />
          </button>

          <button onClick={() => navigateWithTransition("/inicio")}>
            <img
              src="/assets/logos/TOPEDUCATIONLOGONAV.png"
              alt="Logo Top.education"
              className="logo-nav"
            />
          </button>
        </div>
        {/* BURGUER */}
          <div
            className="container-burguer-button"
            onClick={() => toggleMenu()}
          >
            <span className="burguer-bar"></span>
          </div>
        {/* MENU */}
        <div className={`navigation-menu ${isMenuOpen ? "open" : ""}`}>
            <MenuTop toggleMenu={toggleMenu} />
            <div className="flex items-center gap-0 relative" ref={dropdownRef}>
            {/* AUTH STATE */}
            {!loadingAuth && !user && (
              <button
                onClick={() => navigateWithTransition("/login")}
                className="ml-0 mt-3 lg:mt-0 lg:ml-4 shadow-[0px_0px_10px_3px_#F6F4EF] bg-[#F6F4EF] !text-[#1c1c1c] z-[11] !py-2 !px-5 !rounded-full"
              >
                Iniciar sesión
              </button>
            )}

            {!loadingAuth && user && (
              <button
                onClick={() => setOpenDropdown((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-600 text-slate-100 hover:bg-slate-800"
              >
                <FaUserCircle className="text-xl" />
                <span className="hidden sm:block text-sm max-w-[120px] truncate">
                  {user.full_name || user.email}
                </span>
                <FaChevronDown className="text-xs opacity-70" />
              </button>
            )}

            {/* DROPDOWN */}
            {openDropdown && user && (
              <div className="absolute right-0 top-[120%] w-48 rounded-xl border border-slate-700 bg-neutral-900 shadow-xl z-50 overflow-hidden">
                <button
                  onClick={() => {
                    setOpenDropdown(false);
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
      </nav>
    </header>
  );
};

export default Header;
