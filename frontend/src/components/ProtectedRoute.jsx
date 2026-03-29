import { motion } from "framer-motion";
import { useAuth } from "../auth/useAuth.js";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate()

  return (
    <>
      {loading ? (
        <div>...loading</div>
      ) : !user ? (
        <div className="bg-black p-8 w-full min-h-screen flex gap-4 items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, filter: "blur(12px)" }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
            }}
            className="text-3xl font-light flex gap-2"
          >
            <span className="font-medium hover:cursor-pointer hover:text-neutral-400 duration-150 flex items-center gap-2" onClick={()=> navigate("/login")}><Lock size={32}/> Login</span> to continue
          </motion.h1>
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default ProtectedRoute;
