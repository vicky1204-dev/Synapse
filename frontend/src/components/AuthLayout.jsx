import { useLocation, useNavigate, useOutlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AuthLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegister = location.pathname === "/register";
  const isLogin = location.pathname === "/login";
  const outlet = useOutlet();
  return (
    <div className="flex items-center justify-center w-full">
      <div className="h-fit pt-16  flex flex-col w-100">
        <motion.div
          layout="position"
          transition={{ duration: 0.2 }}
          className="flex gap-2 text-base text-text-secondary bg-bg-secondary border border-white/15 py-2 px-2 w-fit rounded-lg mb-4"
        >
          <div
            onClick={() => navigate("/register")}
            className={`${isRegister ? "text-white" : ""} cursor-pointer px-8 py-2 relative`}
          >
            {isRegister && (
              <motion.div
                layoutId="active-tab-auth"
                className="absolute inset-0 bg-bg-primary rounded-lg z-0 shadow-sm"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              ></motion.div>
            )}
            <span className="relative z-99">Sign Up</span>
          </div>
          <div
            onClick={() => navigate("/login")}
            className={`${isLogin ? "text-white" : ""} cursor-pointer px-8 py-2 relative `}
          >
            {isLogin && (
              <motion.div
                layoutId="active-tab-auth"
                className="absolute inset-0 bg-bg-primary rounded-lg z-0 shadow-sm"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              ></motion.div>
            )}
            <span className="relative z-99">Login</span>
          </div>
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthLayout;
