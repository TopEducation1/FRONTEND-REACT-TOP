import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import LogoItem from "./LogoItem";

const Flags = ({ logos = [] }) => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  function navigateWithTransition(path) {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        navigate(path);
      });
    } else {
      navigate(path);
    }
  }

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -220]);

  const handleClick = (category, tag) => {
    const query = `${category}=${encodeURIComponent(tag)}&page=1&page_size=16`;
    navigateWithTransition(`/explora/filter?${query}`);
  };

  const visibleLogos = logos.slice(0, 50);

  return (
    <section
      ref={sectionRef}
      className="pt-5  xl:pt-5 lg:pt-5 pb-[4.5rem] xl:pb-5 lg:pb-5 md:pb-10 relative"
    >
      <div>
        <h2 className="text-[#F6F4EF] text-center text-4xl leading-[1.2em] lg:text-5xl font-normal font-[Lora] w-full mb-10">
          Trabajamos con líderes de la industria
        </h2>
      </div>

      <div className="overflow-x-auto px-12 py-10">
        <motion.div
          style={{ x }}
          className="grid grid-flow-col grid-rows-2 auto-cols-[150px] gap-4 px-20 min-w-max"
        >
          {visibleLogos.map((logo, index) => {
            //if (index % 3 === 0) return <div className="border-[#F6F4EF] rounded-2xl border-1 " key={index} />;
            return (
              <LogoItem
                key={index}
                logo={logo}
                index={index}
                onClick={() => handleClick("Empresa", logo.nombre)}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Flags;
