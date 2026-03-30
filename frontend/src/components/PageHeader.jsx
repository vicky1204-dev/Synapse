import { motion, useScroll } from "framer-motion";
import { Bell, Menu } from "lucide-react";
import { useMainContext } from "../context/MainContext";
import { useState, useEffect } from "react";

const PageHeader = ({ title, notifications = [] }) => {
  const { setSidebarVisible, setNotificationVisible } = useMainContext();
  const { scrollY } = useScroll();
  const [shrink, setShrink] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (value) => {
      if (value > 10) {
        setShrink(true);
      } else {
        setShrink(false);
      }
    });

    return () => unsubscribe();
  }, [scrollY]);

  return (
    <header className="sticky top-0 pt-6 bg-black z-10">
      <div className="flex justify-between items-center">
        <motion.h1
          className="leading-0 text-6xl origin-left flex items-center gap-2 font-light"
          initial={{ opacity: 0, filter: "blur(12px)"}}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
            scale: shrink ? 0.5 : 1,  
          }}
          transition={{
            opacity: { duration: 0.6, ease: "easeOut" },
            filter: { duration: 0.6, ease: "easeOut" },
            fontSize: {
              duration: 0.3,
              ease: "easeInOut",
            },
          }}
        >
          {title}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.6 } }}
          className="flex gap-6 items-center justify-center"
        >
          <div
            className="sm:hidden cursor-pointer"
            onClick={() => setSidebarVisible((prev) => !prev)}
          >
            <Menu strokeWidth={1} />
          </div>
          <div 
           onClick={() => setNotificationVisible((prev) => !prev)}
          className="w-fit p-3 border border-white/20 rounded-sm relative cursor-pointer">
            <Bell strokeWidth={1} />
            <p className="absolute rounded-full w-4 aspect-square bg-blue-600 top-1 p-0.5 text-center right-1 text-[10px]">
              {notifications.length}
            </p>
          </div>
        </motion.div>
      </div>
      <motion.div
        className="w-full h-px bg-white/15 mt-3"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{
          duration: 0.5,
          ease: [0.76, 0, 0.24, 1],
        }}
      ></motion.div>
    </header>
  );
};

export default PageHeader;
