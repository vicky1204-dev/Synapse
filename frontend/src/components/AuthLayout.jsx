import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const AuthLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegister = location.pathname === "/register";
  const isLogin = location.pathname === "/login";
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="h-full pt-16 w-300px">
        <motion.div
          layout
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
          <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
