import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const Dialog = ({ isOpen, onClose, children, buttonText }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay************ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-60 backdrop-blur-sm"
            onClick={onClose}
          ></motion.div>

          {/* DIALog************* */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-70 bg-black border border-white/20 rounded-lg p-6 shadow-xl"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Dialog;
