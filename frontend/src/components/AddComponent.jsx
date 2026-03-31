import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const AddComponent = (props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1} }}
      className="flex justify-between items-center p-4 border border-white/15 rounded-lg text-text-secondary"
    >
      <div className="text-sm">{props.meta}</div>
      <button
        onClick={props.onClick}
        className=" bg-bg-secondary rounded-full py-2 px-4 cursor-pointer flex justify-center items-center gap-2 text-sm text-text-secondary hover:text-white border border-black hover:border-white/15 duration-200 ease-in-out"
      >
        {props.buttonText}
        <Plus size={18} strokeWidth={1} />
      </button>
    </motion.div>
  );
};

export default AddComponent;
