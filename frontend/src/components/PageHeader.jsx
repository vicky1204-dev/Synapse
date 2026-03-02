import { motion } from "framer-motion";

const PageHeader = ({ title }) => {
  return (
    <div>
      <motion.h1
        className="text-6xl"
        initial={{ opacity: 0, filter: "blur(12px)" }}
        animate={{ opacity: 1, filter: "blur(0px)", transition: {duration: 0.6} }}
      >
        {title}
      </motion.h1>
      <motion.div
        className="w-full h-px bg-white/50 mt-3"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{
          duration: 0.5,
          ease: [0.76, 0, 0.24, 1],
        }}
      ></motion.div>
    </div>
  );
};

export default PageHeader;
