const Footer = () => {
  const socialLinks = [
    {
      href: "https://www.instagram.com/topeducationofficial/",
      label: "Instagram",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
          <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0" />
          <path d="M16.5 7.5v.01" />
        </svg>
      ),
    },
    {
      href: "https://www.linkedin.com/company/topdoteducation/",
      label: "LinkedIn",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-[18px] w-[18px]"
        >
          <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 7.02a1.96 1.96 0 1 0 0-3.92 1.96 1.96 0 0 0 0 3.92ZM20.44 20h-3.37v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.15 1.46-2.15 2.96V20H9.69V8.5h3.24v1.57h.05c.45-.85 1.56-1.75 3.2-1.75 3.42 0 4.05 2.25 4.05 5.18V20Z" />
        </svg>
      ),
    },
    {
      href: "https://www.tiktok.com/@topeducationofficial",
      label: "TikTok",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M21 7.917v4.034a9.948 9.948 0 0 1-5-1.951v4.5a6.5 6.5 0 1 1-8-6.326v4.326a2.5 2.5 0 1 0 4 2V3h4.083A6.005 6.005 0 0 0 21 7.917z" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      id="footerPage"
      className="wrapper relative bg-[#0F090D] px-6 py-8"
    >
      <div className="container mx-auto">
        <div className="grid items-center gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <a
              href="/politicas-privacidad"
              className="text-[16px] font-semibold text-white transition-colors duration-300 hover:text-[#5CC781]"
            >
              Políticas de privacidad
            </a>

            <p className="mt-0 text-[12px] text-[#F8F7F4]/80">
              Todos los derechos reservados |{" "}
              <span className="text-white">top</span>
              <span className="text-white">.education</span> 2025
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src="/assets/logos/logo-top-education.png"
              className="max-w-[170px] brightness-0 invert"
              alt="Logo Top.Education"
            />
          </div>

          <div className="flex flex-col items-center gap-3 md:items-end">
            <div className="flex items-center gap-4">
              <h3 className="text-[14px] !font-[Montserrat] font-semibold text-white">
                Síguenos
              </h3>

              <div className="flex items-center gap-3">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/15
                      bg-white/[0.02]
                      text-white/70
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-white/35
                      hover:bg-white/10
                      hover:text-white
                    "
                  >
                    <span className="[&_svg]:h-[19px] [&_svg]:w-[19px] [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-2 [&_svg]:stroke-linecap-round [&_svg]:stroke-linejoin-round">
                      {item.icon}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;