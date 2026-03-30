import { motion, AnimatePresence, usePresence } from "framer-motion";
import SideBar from "./SideBar";
import { useLocation, useOutlet } from "react-router-dom";
import { useRef, useLayoutEffect, useState } from "react";
import { MainContext } from "../context/MainContext";
import NotificationPanel from "./NotificationPanel";
//Use useLayoutEffect (not useEffect) so measurement happens before paint:

const MainLayout = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false)
  const location = useLocation();
  const outlet = useOutlet();
  const contentRef = useRef(null);
  const [contentLeft, setContentLeft] = useState(0);
  useLayoutEffect(() => {
    if (contentRef.current) {
      const rect = contentRef.current.getBoundingClientRect();
      setContentLeft(rect.left);
    }
  }, []);

  return (
    <MainContext.Provider value={{ setSidebarVisible, setNotificationVisible }}>
      <div className={`fixed right-0 top-0 bottom-0 z-70 ${notificationVisible ? "translate-0" : "translate-x-full"} duration-200 ease-in-out`}>
        <NotificationPanel/>
      </div>
      <div className="min-h-screen w-full flex">
        <div
          className={`sm:sticky fixed left-0 top-0 h-screen flex-[0,0,auto] sm:py-8 sm:pl-8 z-50 opacity-0 ${sidebarVisible ? " translate-x-0 opacity-100 " : "-translate-x-full"} sm:translate-x-0 sm:opacity-100 duration-300`}
        >
          <SideBar />
        </div>
        <div className="flex-1 relative min-h-screen bg-white/15">
          <AnimatePresence mode="wait">
            //since i am animating 2 elements and animatepresence expects only
            one direct child so wrap them with div with key, where the key changes as location changes
            
            <motion.div key={location.pathname}>
              {/* Page transition SLIDER ******** */}
              <motion.div
                className="fixed inset-y-0 right-0 bg-black z-40 pointer-events-none"
                style={{
                  left: contentLeft,
                }}
                initial={{ y: "100%" }}
                animate={{ y: "100%" }}
                exit={{ y: "0%" }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              />

              {/* PAGE */}
              <motion.main
                initial={{ opacity: 1, scale: 1, y: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0.5,
                  scale: 0.9,
                  y: -100,
                  transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
                }}
                ref={contentRef}
                className="relative min-h-screen"
              >
                {outlet}
              </motion.main>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </MainContext.Provider>
  );
};

export default MainLayout;
