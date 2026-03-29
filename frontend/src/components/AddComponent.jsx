import { motion } from "framer-motion";

const AddComponent = (props) => {
  const Icon = props.icon;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1} }}
      className="flex justify-between items-center p-4 border border-white/15 rounded-lg text-text-secondary"
    >
      <div>{props.meta}</div>
      <button
        onClick={props.onClick}
        className=" bg-bg-secondary rounded-full py-2 px-4 cursor-pointer flex justify-center items-center gap-2 text-sm text-text-secondary hover:text-white border border-black hover:border-white/15 duration-200 ease-in-out"
      >
        {props.buttonText}
        <Icon size={18} strokeWidth={1} />
      </button>
    </motion.div>
  );
};

export default AddComponent;
