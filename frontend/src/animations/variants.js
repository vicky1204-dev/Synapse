export const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(12px)" },
  show: { opacity: 1, y: 0, filter: "blur(0)" },
  exit: { opacity: 0, y: 10 },
};