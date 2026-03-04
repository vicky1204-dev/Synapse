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
            className="absolute inset-0 z-20 backdrop-blur-sm"
            onClick={onClose}
          ></motion.div>

          {/* DIALog************* */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-bg-secondary border border-white/20 rounded-lg p-6 shadow-xl"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Dialog;
