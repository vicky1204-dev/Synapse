import { motion } from "framer-motion";
import {itemVariants} from "../animations/variants.js"

//the parent must be animate presence component for

const SkeletonLoader = () => {
  return Array.from({ length: 4 }).map((_, i) => (
    <motion.div
      key={i}
      variants={itemVariants}
      animate={{
        backgroundPosition: ["200% 0%", "-200% 0%"], // 🔥 keep shimmer
      }}
      transition={{
        backgroundPosition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        },
      }}
      className="h-40 bg-linear-to-r from-bg-secondary via-white/10 to-bg-secondary bg-size-[200%_100%] w-full rounded-lg"
    />
  ));
};

export default SkeletonLoader;
