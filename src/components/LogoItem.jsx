import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const LogoItem = ({ logo, index, onClick }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });

  return (
    <motion.div
      ref={ref}
      className="bg-[#F6F4EF] rounded-2xl shadow-xl p-2 flex items-center justify-center w-[120px] h-[120px] cursor-pointer"
      initial={{ scale: 0.3, opacity: 0, y: 50 }}
      animate={isInView ? { scale: 1, opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.03, ease: "easeInOut" }}
      whileHover={{ scale: 1.12 }}
      onClick={onClick}
    >
      <img
        src={logo.empr_img}
        alt={logo.nombre}
        className="w-full h-full object-contain"
      />
    </motion.div>
  );
};

export default LogoItem;
